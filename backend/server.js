const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS
app.use(cors({
  origin: ["https://task-flow-pro-mern-app.vercel.app", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());

// ALWAYS WORKING ROUTES
app.get("/", (req, res) => {
  res.json({ 
    success: true,
    message: "TaskFlow API is running",
    timestamp: new Date()
  });
});

app.get("/api/test", (req, res) => {
  res.json({ 
    success: true,
    message: "API is working!",
    timestamp: new Date()
  });
});

// SIMPLE MONGODB CONNECTION
console.log("Starting server...");

const mongoURI = process.env.MONGODB_URI;

if (mongoURI && mongoURI.startsWith("mongodb://")) {
  console.log("Found MongoDB URI, attempting connection...");
  
  mongoose.connect(mongoURI.trim())
  .then(() => {
    console.log("✅ MongoDB Connected!");
    
    // Load routes
    try {
      app.use("/api/auth", require("./routes/authRoutes"));
      app.use("/api/tasks", require("./routes/taskRoutes"));
      app.use("/api/clients", require("./routes/clientRoutes"));
      console.log("✅ Routes loaded");
    } catch (error) {
      console.log("⚠️ Routes error:", error.message);
      setupFallbackRoutes();
    }
  })
  .catch(error => {
    console.log("❌ MongoDB failed:", error.message);
    setupFallbackRoutes();
  });
} else {
  console.log("⚠️ No valid MongoDB URI found");
  setupFallbackRoutes();
}

// SIMPLE FALLBACK ROUTES (without wildcard errors)
function setupFallbackRoutes() {
  console.log("Setting up fallback routes...");
  
  app.post("/api/auth/register", (req, res) => {
    res.json({
      success: true,
      message: "Registration (fallback mode)",
      data: req.body
    });
  });

  app.post("/api/auth/login", (req, res) => {
    res.json({
      success: true,
      message: "Login (fallback mode)",
      data: req.body
    });
  });

  app.get("/api/tasks", (req, res) => {
    res.json({
      success: true,
      message: "Tasks endpoint (fallback)",
      tasks: []
    });
  });

  app.post("/api/tasks", (req, res) => {
    res.json({
      success: true,
      message: "Task created (fallback)",
      task: req.body
    });
  });

  app.get("/api/clients", (req, res) => {
    res.json({
      success: true,
      message: "Clients endpoint (fallback)",
      clients: []
    });
  });

  app.post("/api/clients", (req, res) => {
    res.json({
      success: true,
      message: "Client created (fallback)",
      client: req.body
    });
  });
}

// START SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend: https://task-flow-pro-mern-app.vercel.app`);
});