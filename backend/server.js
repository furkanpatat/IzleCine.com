require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',  // frontend adresin
  credentials: true
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB bağlantısı başarılı');
  app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
})
.catch((err) => {
  console.error('MongoDB bağlantı hatası:', err);
});
