const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { analyzeSentiment } = require('./nlp'); // Import sentiment analysis
const Interaction = require('./models/Interaction'); // Import Interaction model
const { execFile } = require('child_process');

const app = express();
const PORT = 5000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mbti-database';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const userSchema = new mongoose.Schema({
  mbti: String,
  purpose: String,
  personalityAnswers: [Number],
});

const mbtiSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  strengths: [String],
  weaknesses: [String],
});

const feedbackSchema = new mongoose.Schema({
  message: String,
  isPositive: Boolean,
  mbti: String,
  purpose: String
});

const User = mongoose.model('User', userSchema);
const MBTI = mongoose.model('MBTI', mbtiSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// User Registration Endpoint
app.post('/api/users', async (req, res) => {
  try {
    const { mbti, purpose, personalityAnswers } = req.body;
    const newUser = new User({ mbti, purpose, personalityAnswers });
    await newUser.save();
    res.status(201).json({ message: 'User data saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

// Chat Endpoint with Personality Insights, Sentiment Analysis, and Interaction Logging
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userData } = req.body;
    
    // Validate input
    if (!message || !userData) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    
    // Find or create user
    let user = await User.findOne({ mbti: userData.mbti });
    if (!user) {
      user = await User.create({
        mbti: userData.mbti,
        purpose: userData.purpose,
        personalityAnswers: userData.personalityAnswers
      });
    }
    
    // Generate response using a valid model name (example: gemini-2.0-flash)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(message);
    const responseText = await result.response.text();
    
    // Analyze sentiment of the response
    const sentiment = analyzeSentiment(responseText);
    
    // Save interaction with sentiment analysis
    await Interaction.create({
      user: user._id,
      input: message,
      response: responseText,
      sentimentScore: sentiment,
      timestamp: new Date()
    });
    
    res.json({ response: responseText });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Feedback Endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { message, isPositive, userData } = req.body;
    await Feedback.create({
      message,
      isPositive,
      mbti: userData.mbti,
      purpose: userData.purpose
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Feedback submission failed' });
  }
});

// New Combined Response Endpoint for Ensemble Inference using execFile
app.post('/api/combined_response', (req, res) => {
  const { state } = req.body;  // 'state' should be an array of 10 numbers
  if (!state || !Array.isArray(state) || state.length !== 10) {
    return res.status(400).json({ error: 'Invalid state input. Expected an array of 10 numbers.' });
  }
  
  const inputState = JSON.stringify({ state });
  
  // Use execFile with cwd set to __dirname to ensure proper working directory
  execFile('python', ['combined_inference.py', inputState], { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error('Error during combined inference:', error);
      console.error('Stderr:', stderr);
      return res.status(500).json({ error: 'Combined inference failed', details: stderr });
    }
    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseError) {
      console.error('Error parsing Python output:', parseError);
      res.status(500).json({ error: 'Failed to parse inference result' });
    }
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Analytics Endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const data = await User.aggregate([
      { 
        $group: { 
          _id: "$mbti", 
          count: { $sum: 1 },
          avgAnswers: { $avg: "$personalityAnswers" }
        }
      }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Analytics failed' });
  }
});

// MBTI Data Retrieval Endpoints
app.get('/api/mbti', async (req, res) => {
  try {
    const types = await MBTI.find();
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/mbti/:type', async (req, res) => {
  try {
    const type = await MBTI.findOne({ type: req.params.type.toUpperCase() });
    res.json(type);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



