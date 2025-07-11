// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const salaryRoutes = require("./routes/salary");
const employeeRoutes = require("./routes/employee");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory (one level up)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Database connection
mongoose.connect("mongodb://localhost:27017/payroll", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// API Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/salary", salaryRoutes);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Serve test pages (from root directory)
app.get('/test.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'test.html'));
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'test.html'));
});

app.get('/simple-test', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'simple-test.html'));
});

app.get('/verify', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'final-verification.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
