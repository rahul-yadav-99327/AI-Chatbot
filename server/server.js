const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const kbRoutes = require('./routes/kb');
const chatRoutes = require('./routes/chat');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

console.log("Loading Environment Variables...");
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Set (starts with " + process.env.OPENAI_API_KEY.substring(0, 7) + ")" : "NOT SET");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-kb-chat';
mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB Connected to', mongoUri))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        // Don't exit, just log, so server stays up for other endpoint checks if needed, 
        // but ideally we should fix the connection.
    });

// Routes
app.use('/api/kb', kbRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('AI Knowledge Base Chatbot API Running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
