const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Resume = require('../models/Resume');

router.post('/', auth, async (req, res) => {
  try {
    const data = req.body;

    data.user = req.userId;

    const r = await Resume.create(data);
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const list = await Resume.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await Resume.findOneAndUpdate(
      { _id: id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Not found' });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;

    await Resume.findOneAndDelete({ _id: id, user: req.userId });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
