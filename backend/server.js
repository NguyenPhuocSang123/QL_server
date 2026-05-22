require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { startSensorPolling } = require('./services/roomSensorService');

connectDB().then(() => {
  startSensorPolling();
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'QL Server API' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/racks', require('./routes/racks'));
app.use('/api/servers', require('./routes/servers'));
app.use('/api/network-devices', require('./routes/networkDevices'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/ai', require('./routes/ai'));

// Phục vụ file tĩnh của frontend khi deploy lên production
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Lỗi server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
