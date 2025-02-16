const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();

connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
