const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Debug environment variables
console.log("=== ENVIRONMENT CHECK ===");
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("=========================");

// CORS configuration
app.use(cors({
  origin: [
    "https://task-flow-pro-mern-app.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

// Test routes (keep these BEFORE MongoDB connection)
app.get("/", (req, res) => {
  res.json({ 
    message: "ClientTask API is running",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working!",
    timestamp: new Date(),
    version: "1.0.0"
  });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// MongoDB Connection - Try multiple variable names
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

console.log("Attempting MongoDB connection...");

if (!mongoURI) {
  console.log("❌ No MongoDB URI found in environment variables!");
  console.log("⚠️ Starting server WITHOUT MongoDB (API will fail)");
  
  // Start server without MongoDB (for testing)
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`⚠️ Server running on port ${PORT} (NO MONGODB)`);
    console.log(`⚠️ API routes will return 500 errors`);
  });
} else {
  console.log("Found MongoDB URI, attempting connection...");
  
  // Connect to MongoDB with better options
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000, // 15 seconds timeout
    socketTimeoutMS: 45000, // 45 seconds socket timeout
    family: 4, // Use IPv4, skip IPv6
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    
    // Load routes ONLY after MongoDB connects
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/clients", require("./routes/clientRoutes"));
    app.use("/api/tasks", require("./routes/taskRoutes"));
    
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend: https://task-flow-pro-mern-app.vercel.app`);
      console.log(`⚙️  Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 MongoDB: Connected to ${mongoURI.split('@')[1]?.split('.')[0] || 'database'}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection FAILED:", error.message);
    console.log("Error details:", error);
    
    // Start server anyway but API routes will fail
    const PORT = process.env.PORT || 5000;
    
    // Define placeholder routes that show error
    app.use("/api/auth", (req, res, next) => {
      res.status(503).json({ 
        error: "Database unavailable", 
        message: "MongoDB connection failed. Please check your database configuration.",
        timestamp: new Date()
      });
    });
    
    app.use("/api/clients", (req, res, next) => {
      res.status(503).json({ 
        error: "Database unavailable",
        timestamp: new Date()
      });
    });
    
    app.use("/api/tasks", (req, res, next) => {
      res.status(503).json({ 
        error: "Database unavailable",
        timestamp: new Date()
      });
    });
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`⚠️ Server running on port ${PORT} (MONGODB FAILED)`);
      console.log(`❌ All API routes will return 503 Database Unavailable`);
    });
  });
}