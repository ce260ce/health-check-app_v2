const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
    label: String,
    url: String,
    forAll: Boolean,
    forName: String,
});

module.exports = mongoose.model("Link", linkSchema);