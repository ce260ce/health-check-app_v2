const mongoose = require('mongoose');

const BulletinSchema = new mongoose.Schema({
    title: String,
    description: String,
    visibleUntil: Date,
    postedBy: String,
    files: [{ name: String, url: String }],
    checkedBy: { type: Map, of: Boolean, default: {} },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bulletin', BulletinSchema);
