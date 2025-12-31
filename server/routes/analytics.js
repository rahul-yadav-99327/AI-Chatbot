const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');

router.get('/', async (req, res) => {
    try {
        // Simple list of recent queries
        const recentQueries = await Analytics.find().sort({ timestamp: -1 }).limit(20);

        // Simple aggregate: total queries
        const totalQueries = await Analytics.countDocuments();

        // Simple aggregate: queries with context found
        const contextFoundCount = await Analytics.countDocuments({ ragContextFound: true });

        res.json({
            stats: {
                total: totalQueries,
                withContext: contextFoundCount
            },
            recent: recentQueries
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
