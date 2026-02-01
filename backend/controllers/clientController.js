const User = require("../models/User");

// CREATE CLIENT (user only)
exports.createClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingClient = await User.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "Client already exists" });
    }

    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const client = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "client",
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL CLIENTS (user only)
exports.getClients = async (req, res) => {
  try {
    const clients = await User.find({ role: "client" }).select("-password");
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE CLIENT
exports.updateClient = async (req, res) => {
  try {
    const client = await User.findById(req.params.id);

    if (!client || client.role !== "client") {
      return res.status(404).json({ message: "Client not found" });
    }

    client.name = req.body.name || client.name;
    client.email = req.body.email || client.email;

    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE CLIENT
exports.deleteClient = async (req, res) => {
  try {
    const client = await User.findById(req.params.id);

    if (!client || client.role !== "client") {
      return res.status(404).json({ message: "Client not found" });
    }

    await User.deleteOne({ _id: client._id });

    res.json({ message: "Client removed successfully" });
  } catch (error) {
    console.error("Delete client error:", error);
    res.status(500).json({ message: "Failed to delete client" });
  }
};
