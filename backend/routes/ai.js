const express = require('express');
const ServerRoom = require('../models/ServerRoom');
const { protect } = require('../middleware/auth');
const { chat, verifyGeminiKey } = require('../services/chatAI');
const { getSmartTemperatureAlerts, computeRoomStatusFromMetrics } = require('../services/temperatureAI');

const router = express.Router();

/** Cảnh báo nhiệt độ thông minh */
router.get('/temperature-alerts', protect, async (req, res) => {
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
});

/** Chatbot hỏi đáp */
router.post('/chat', protect, async (req, res) => {
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
});

/** Trạng thái AI — kiểm tra key Gemini có gọi API được không */
router.get('/status', protect, async (req, res) => {
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
});

module.exports = router;
