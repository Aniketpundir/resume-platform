const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Resume = require('../models/Resume');

// CREATE resume
router.post('/', auth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: userId missing" });
    }

    const data = req.body;
    data.user = req.userId;

    // ✅ Safe defaults
    if (!data.personal || typeof data.personal !== 'object') {
      data.personal = { fullName: "", email: "", phone: "", summary: "" };
    }
    if (!data.education || !Array.isArray(data.education)) data.education = [];
    if (!data.experience || !Array.isArray(data.experience)) data.experience = [];
    if (!data.skills) data.skills = [];
    if (typeof data.skills === 'string') {
      data.skills = data.skills.split(',').map(s => s.trim());
    }

    const newResume = await Resume.create(data);
    res.json(newResume);
  } catch (err) {
    console.error("Resume creation failed:", err.message);
    console.error(err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all resumes
router.get('/', auth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: userId missing" });
    }
    const list = await Resume.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Fetch resumes failed:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE resume
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: userId missing" });
    }

    const data = req.body;

    if (!data.personal || typeof data.personal !== 'object') {
      data.personal = { fullName: "", email: "", phone: "", summary: "" };
    }
    if (data.education && !Array.isArray(data.education)) data.education = [data.education];
    if (data.experience && !Array.isArray(data.experience)) data.experience = [data.experience];
    if (data.skills && typeof data.skills === 'string') {
      data.skills = data.skills.split(',').map(s => s.trim());
    }

    const updated = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      data,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Resume not found' });
    res.json(updated);
  } catch (err) {
    console.error("Resume update failed:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE resume
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: userId missing" });
    }

    const deleted = await Resume.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error("Resume deletion failed:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
