const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS
app.use(cors({
  origin: "*",  // Allow all origins temporarily for testing
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

// Function to create default admin
const createAdminUser = async () => {
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    
    if (adminExists) {
      console.log('ℹ️ Admin user already exists');
      
      // Update role to "user" if it's "client"
      if (adminExists.role === 'client') {
        adminExists.role = 'user';
        await adminExists.save();
        console.log('✅ Updated admin role to "user"');
      }
      
      // Update password to 123456
      const validPass = await bcrypt.compare('123456', adminExists.password);
      if (!validPass) {
        adminExists.password = await bcrypt.hash('123456', 10);
        await adminExists.save();
        console.log('✅ Updated admin password to "123456"');
      }
      
      return;
    }
    
    // Create new admin
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'user'
    });
    
    await adminUser.save();
    console.log('✅ Admin user created:');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: 123456');
    console.log('   Role: user');
    
  } catch (error) {
    console.log('⚠️ Could not create admin user:', error.message);
  }
};

// Call it after MongoDB connects
mongoose.connect(mongoURI).then(() => {
  console.log('✅ MongoDB Connected!');
  createAdminUser();  // Add this line
  
  // Load routes...
});
    
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