const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./src/routes/auth');
const resumeRoutes = require('./src/routes/resume');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/resume', resumeRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/resume_platform';

mongoose.connect(MONGO, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=> {
    console.log('MongoDB connected');
    app.listen(PORT, ()=> console.log('Server running on', PORT));
  })
  .catch(err => {
    console.error('DB connection error', err);
  });
