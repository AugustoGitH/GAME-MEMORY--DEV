const mongoose = require("mongoose")
const playerSchema = new mongoose.Schema({
    namePlayer: {type: String, required: true},
    timeRecord: {type: Number, default: 1000000}
})

module.exports = mongoose.model("Player", playerSchema)