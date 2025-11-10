const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('JWT_SECRET from env:', process.env.JWT_SECRET);
console.log('MONGODB_URI from env:', process.env.MONGODB_URI);


const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));


app.use('/api/auth', authRoutes); 
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Social Media App API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});