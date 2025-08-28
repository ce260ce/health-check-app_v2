const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cleanupOldUploads = require('./utils/cleanupOldUploads');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB接続
mongoose.connect('mongodb://mongo_v2:27017/healthcheck')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// ルート分割
app.use('/api/health', require('./routes/health'));
app.use('/api/names', require('./routes/names'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/links', require('./routes/links'));
app.use('/api/bulletins', require('./routes/bulletins'));

// クリーンアップ処理
cleanupOldUploads();
setInterval(cleanupOldUploads, 24 * 60 * 60 * 1000);

app.listen(5500, () => console.log('🚀 APIサーバー起動: http://localhost:5500'));
