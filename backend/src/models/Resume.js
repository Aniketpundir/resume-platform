const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled Resume' },
  personal: {
    fullName: String,
    email: String,
    phone: String,
    summary: String
  },
  education: [{ school: String, degree: String, from: String, to: String }],
  experience: [{ company: String, role: String, from: String, to: String, description: String }],
  skills: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);
