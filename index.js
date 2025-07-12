const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("DB Error:", err));

// Mongoose Model
const Log = mongoose.model("Log", new mongoose.Schema({
  date: String,
  subject: String,
  topic: String,
  duration: Number,
}));

// Health Check
app.get("/", (req, res) => {
  res.send("Study Tracker API is live 🎯");
});

// Routes
app.get("/api/logs", async (req, res) => {
  try {
    const logs = await Log.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

app.post("/api/logs", async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save log" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
