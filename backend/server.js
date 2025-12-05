const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");


dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));





// Basic test route
app.get("/", (req, res) => {
  res.send("Backend + MongoDB connected ✔️");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
