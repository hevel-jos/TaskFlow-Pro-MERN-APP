const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

// Debug environment variables
console.log("=== ENVIRONMENT VARIABLES ===");
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI exists?", !!process.env.MONGO_URI);
console.log("MONGODB_URI exists?", !!process.env.MONGODB_URI); // Check both names
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("========================");

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "https://task-flow-pro-mern-app.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173" // Vite default port
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Test route
app.get("/", (req, res) => {
  res.json({ 
    message: "ClientTask API is running",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Health check for Render
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// API test route
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working!",
    timestamp: new Date(),
    version: "1.0.0"
  });
});

// MongoDB Connection - Try both variable names
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/taskflow";

console.log("Connecting to MongoDB...");
console.log("Using URI:", mongoURI ? "Provided" : "Using fallback");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
})
.then(() => {
  console.log("✅ MongoDB Connected Successfully!");
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.CLIENT_URL || "Not set"}`);
    console.log(`⚙️  Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 MongoDB: Connected`);
  });
})
.catch((error) => {
  console.error("❌ MongoDB connection error:", error.message);
  console.log("⚠️ Starting server without MongoDB connection...");
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT} (without MongoDB)`);
    console.log(`⚠️ Warning: MongoDB connection failed. Some features may not work.`);
  });
});