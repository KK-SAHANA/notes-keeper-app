const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

// Create Note
router.post("/", authMiddleware, async (req, res) => {
  try {
    const note = new Note({
      user: req.user,
      title: req.body.title,
      content: req.body.content,
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// Get Notes for Logged-in User (pinned first)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user })
      .sort({ pinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// Update Note (edit title/content)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, content },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// Toggle Pin
router.patch("/:id/pin", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user });

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    note.pinned = !note.pinned;
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// Delete Note
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.user });
    res.json({ msg: "Note Deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
