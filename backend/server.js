const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS
app.use(cors({
  origin: ["https://task-flow-pro-mern-app.vercel.app", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log("🔗 Connecting to Railway MongoDB...");
    
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }
    
    // Log first part (without password for security)
    const safeURI = mongoURI.replace(/:[^:]*@/, ':****@');
    console.log("Using URI:", safeURI);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB Connected Successfully!");
    return true;
    
  } catch (error) {
    console.log("❌ MongoDB Connection Error:", error.message);
    return false;
  }
};

// Test routes (always work)
app.get("/", (req, res) => {
  res.json({ 
    success: true,
    message: "TaskFlow API is running",
    timestamp: new Date(),
    database: "Railway MongoDB"
  });
});

app.get("/api/test", (req, res) => {
  res.json({ 
    success: true,
    message: "API test successful",
    timestamp: new Date()
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy",
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Start server
const startServer = async () => {
  const dbConnected = await connectDB();
  
  if (dbConnected) {
    // Load MongoDB routes
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/tasks", require("./routes/taskRoutes"));
    app.use("/api/clients", require("./routes/clientRoutes"));
    console.log("✅ MongoDB routes loaded");
  } else {
    // Fallback message
    app.use("/api/*", (req, res) => {
      res.status(503).json({
        error: "Database unavailable",
        message: "MongoDB connection failed. Please try again later.",
        timestamp: new Date()
      });
    });
    console.log("⚠️ Using fallback routes (no database)");
  }
  
  const PORT = process.env.PORT || 10000;
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log("=".repeat(50));
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Frontend: https://task-flow-pro-mern-app.vercel.app`);
    console.log(`🗄️  Database: ${dbConnected ? "Connected ✅" : "Not Connected ❌"}`);
    console.log("=".repeat(50));
  });
};

startServer();