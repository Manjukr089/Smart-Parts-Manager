// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// require('dotenv').config();

const partInfoRoutes = require('./routes/partinfo');
const salesRoutes = require('./routes/sales');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const dotenv = require('dotenv');

dotenv.config();

// Middleware
app.use(cors({ origin: '*'}));    
app.use(express.json());

// Routes
app.use('/api/parts', partInfoRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/auth', authRoutes);



// MongoDB connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myparts-assistant', {
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI , 
//   {
//   useNewUrlParser: true,
//   // useUnifiedTopology: true,
 
// }
).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
});
