const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    query: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    sessionId: String,
    responseGenerated: Boolean, // Did we use AI?
    ragContextFound: Boolean, // Did we find articles?
});

module.exports = mongoose.model('Analytics', analyticsSchema);
