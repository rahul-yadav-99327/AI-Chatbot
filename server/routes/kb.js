const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

const memoryStore = require('../memoryStore');
const mongoose = require('mongoose');

// GET all articles
router.get('/', async (req, res) => {
    try {
        let articles = [];

        // Try DB
        if (mongoose.connection.readyState === 1) {
            try {
                articles = await Article.find().sort({ createdAt: -1 });
            } catch (e) { console.warn("KB Fetch Error", e); }
        }

        // Combine with memory (deduplicate by id if needed, but for now just concat)
        // We put memory ones first or last? memoryStore.articles is simple array.

        // If DB is down, strictly use memory
        if (mongoose.connection.readyState !== 1) {
            articles = memoryStore.articles;
        } else {
            // If DB is up, maybe we want to show both? 
            // For simplicity in this hybrid state, let's just return what we have.
            // If the user added to memory because DB was down, they want to see it.
            // So let's concat.
            articles = [...articles, ...memoryStore.articles];
        }

        res.json(articles);
    } catch (err) {
        // If completely failed, return memory
        res.json(memoryStore.articles);
    }
});

// POST new article
router.post('/', async (req, res) => {
    const articleData = {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
    };

    const article = new Article(articleData);

    try {
        if (mongoose.connection.readyState === 1) {
            const newArticle = await article.save();
            res.status(201).json(newArticle);
        } else {
            throw new Error("DB Disconnected");
        }
    } catch (err) {
        console.warn("Saving article to in-memory store due to DB error");
        const memArticle = {
            ...articleData,
            _id: 'mem_' + Date.now(),
            createdAt: new Date()
        };
        memoryStore.articles.push(memArticle);
        res.status(201).json(memArticle);
    }
});

// Search articles (specifically for debugging or manual search)
router.get('/search', async (req, res) => {
    const { q } = req.query;
    try {
        const articles = await Article.find({ $text: { $search: q } });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE article
router.delete('/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.json({ message: 'Article deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
