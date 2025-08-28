const mongoose = require('mongoose');

const HealthSchema = new mongoose.Schema({
    name: String,
    condition: String,
    conditionReason: String,
    breakfast: String,
    task: String,
    ky: String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Health', HealthSchema);