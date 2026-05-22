const ServerRoom = require('../models/ServerRoom');
const Rack = require('../models/Rack');
const Server = require('../models/Server');
const { computeRoomStatusFromMetrics } = require('./temperatureAI');

function round1(n) {
  return Math.round(n * 10) / 10;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/** Mô phỏng / tính chỉ số cảm biến theo tải phòng (server online, điều hòa) */
function computeSensorReading(room, onlineServerCount = 0) {
  const ac = room.acStatus || 'on';
  let temp = 21 + onlineServerCount * 0.45;
  let humidity = 42 + onlineServerCount * 0.8;

  if (ac === 'off') {
    temp += 3.5;
    humidity += 4;
  } else if (ac === 'maintenance') {
    temp += 1.8;
    humidity += 2;
  }

  // Nhiễu cảm biến nhỏ (±0.4°C, ±1% độ ẩm)
  temp += (Math.random() - 0.5) * 0.8;
  humidity += (Math.random() - 0.5) * 2;

  temp = round1(clamp(temp, 16, 38));
  humidity = Math.round(clamp(humidity, 28, 85));

  const powerBase = Number(room.powerConsumption) || 5000;
  const powerConsumption = Math.round(powerBase * (0.92 + Math.random() * 0.16));

  return { temperature: temp, humidity, powerConsumption };
}

async function countOnlineServersByRoom() {
  const racks = await Rack.find().select('room').lean();
  const rackIdsByRoom = new Map();
  for (const rack of racks) {
    const key = String(rack.room);
    if (!rackIdsByRoom.has(key)) rackIdsByRoom.set(key, []);
    rackIdsByRoom.get(key).push(rack._id);
  }

  const servers = await Server.find({ status: 'online' }).select('rack').lean();
  const countByRoom = new Map();

  for (const srv of servers) {
    if (!srv.rack) continue;
    for (const [roomId, rackIds] of rackIdsByRoom) {
      if (rackIds.some((id) => String(id) === String(srv.rack))) {
        countByRoom.set(roomId, (countByRoom.get(roomId) || 0) + 1);
        break;
      }
    }
  }

  return countByRoom;
}

/** Cập nhật tất cả phòng chế độ auto */
async function updateAllRoomSensors() {
  const globalAuto = process.env.SENSOR_AUTO_UPDATE !== 'false';
  if (!globalAuto) return { updated: 0, skipped: 0 };

  const rooms = await ServerRoom.find();
  const onlineByRoom = await countOnlineServersByRoom();
  let updated = 0;
  let skipped = 0;

  for (const room of rooms) {
    if (room.sensorMode === 'manual') {
      skipped += 1;
      continue;
    }

    const onlineCount = onlineByRoom.get(String(room._id)) || 0;
    const reading = computeSensorReading(room, onlineCount);

    room.temperature = reading.temperature;
    room.humidity = reading.humidity;
    room.powerConsumption = reading.powerConsumption;
    room.status = computeRoomStatusFromMetrics(room);
    room.lastSensorAt = new Date();
    await room.save();
    updated += 1;
  }

  return { updated, skipped };
}

/** Nhận số đo từ cảm biến thật (ESP32, API IoT...) */
async function applyExternalReading(roomId, { temperature, humidity, powerConsumption }) {
  const room = await ServerRoom.findById(roomId);
  if (!room) return null;

  if (temperature != null) room.temperature = round1(Number(temperature));
  if (humidity != null) room.humidity = Math.round(clamp(Number(humidity), 0, 100));
  if (powerConsumption != null) room.powerConsumption = Math.round(Number(powerConsumption));
  room.status = computeRoomStatusFromMetrics(room);
  room.lastSensorAt = new Date();
  room.sensorMode = 'auto';
  await room.save();
  return room;
}

function startSensorPolling() {
  const globalAuto = process.env.SENSOR_AUTO_UPDATE !== 'false';
  if (!globalAuto) {
    console.log('Cảm biến tự động: TẮT (SENSOR_AUTO_UPDATE=false)');
    return null;
  }

  const seconds = Math.max(10, Number(process.env.SENSOR_INTERVAL_SECONDS) || 30);
  const ms = seconds * 1000;

  const tick = async () => {
    try {
      const result = await updateAllRoomSensors();
      if (result.updated > 0) {
        console.log(`[Sensor] Đã cập nhật ${result.updated} phòng (${seconds}s/lần)`);
      }
    } catch (err) {
      console.error('[Sensor] Lỗi cập nhật:', err.message);
    }
  };

  tick();
  const timer = setInterval(tick, ms);
  console.log(`Cảm biến tự động: BẬT — cập nhật mỗi ${seconds} giây`);
  return timer;
}

module.exports = {
  computeSensorReading,
  updateAllRoomSensors,
  applyExternalReading,
  startSensorPolling,
};
