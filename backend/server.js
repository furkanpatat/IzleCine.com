require('dotenv').config();
const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const movieRoutes = require('./routes/movieRoutes'); // ✅ yeni eklendi
const { connectRabbit } = require('./utils/rabbit');
const movieController = require('./controllers/movieController');

const app = express();
app.use(helmet());

// CORS configuration for production
const corsOptions = {
  origin: [
    'https://movieapp-frontend-ih7l.onrender.com',
    'https://izlecine.com',
    'http://localhost:3000' // for development
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test endpoint for debugging
app.post('/test-profile-update', (req, res) => {
  console.log('Test profile update request:', req.body);
  res.json({ 
    message: 'Test endpoint working',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
    body: req.body,
    headers: {
      authorization: req.headers.authorization ? 'Bearer ***' : 'none',
      'content-type': req.headers['content-type']
    }
  });
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/movies', movieRoutes); // ✅ yeni route tanımı

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5002;

console.log('Connecting to MongoDB...');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');

    // RabbitMQ bağlantısı dene ama hata olursa uygulamayı durdurma
    try {
      await connectRabbit();
      console.log('RabbitMQ connected successfully');
    } catch (err) {
      console.warn('⚠️ RabbitMQ connection failed, continuing without it:', err.message);
    }

    // Uygulama her halükarda başlasın
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // MongoDB bağlanmazsa çık
  });
