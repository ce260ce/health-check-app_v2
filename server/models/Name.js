const mongoose = require('mongoose');

const NameSchema = new mongoose.Schema({ name: String });

module.exports = mongoose.model('Name', NameSchema);