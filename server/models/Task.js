const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    startDate: Date,
    dueDate: Date,
    files: [{ fileName: String, filePath: String }],
    checkedBy: { type: Map, of: Boolean, default: {} },
    isCompleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', TaskSchema);
