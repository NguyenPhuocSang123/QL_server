const ServerRoom = require('../models/ServerRoom');
const { chat, verifyGeminiKey } = require('../services/chatAI');
const { getSmartTemperatureAlerts, computeRoomStatusFromMetrics } = require('../services/temperatureAI');

/**
 * @desc    Lấy cảnh báo nhiệt độ thông minh
 * @route   GET /api/ai/temperature-alerts
 * @access  Private
 */
exports.getTemperatureAlerts = async (req, res) => {
  try {
    const rooms = await ServerRoom.find().select(
      'roomName roomCode temperature humidity status acStatus'
    );
    await Promise.all(
      rooms.map(async (room) => {
        const nextStatus = computeRoomStatusFromMetrics(room);
        if (room.status !== nextStatus) {
          room.status = nextStatus;
          await room.save();
        }
      })
    );
    const result = await getSmartTemperatureAlerts(rooms);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Chat với AI chatbot
 * @route   POST /api/ai/chat
 * @access  Private
 */
exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ message: 'Vui lòng nhập câu hỏi' });
    }
    const result = await chat(message.trim(), req.user);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Kiểm tra trạng thái AI
 * @route   GET /api/ai/status
 * @access  Private
 */
exports.getAIStatus = async (req, res) => {
  try {
    const hasKey = Boolean(process.env.GEMINI_API_KEY?.trim());
    let geminiWorking = false;
    let geminiError = null;
    let geminiModel = null;

    if (hasKey) {
      const check = await verifyGeminiKey();
      geminiWorking = check.ok;
      geminiError = check.error;
      geminiModel = check.model;
    }

    res.json({
      geminiEnabled: hasKey,
      geminiWorking,
      geminiError,
      geminiModel,
      temperatureAI: true,
      chatMode: geminiWorking ? 'gemini' : hasKey ? 'rules (key lỗi)' : 'rules',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
