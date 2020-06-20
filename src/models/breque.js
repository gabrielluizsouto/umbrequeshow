const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const brequeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    brequeId: { type: Number},
    title: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    startTime: { type: String },
    endTime: { type: String },
    categories: [String],
    user: mongoose.Schema.Types.ObjectId,
    visible: {type: Boolean, default: false}
});

brequeSchema.plugin(AutoIncrement, {inc_field:'brequeId'});

module.exports = mongoose.model('Breque', brequeSchema);