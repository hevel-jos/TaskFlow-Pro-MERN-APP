const Task = require("../models/Task");
const User = require("../models/User");

/**
 * USER: Create task and assign to client
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, clientId } = req.body;

    const client = await User.findById(clientId);
    if (!client || client.role !== "client") {
      return res.status(400).json({ message: "Invalid client" });
    }

    const task = await Task.create({
      title,
      description,
      client: clientId,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * USER: Get all tasks
 */
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("client", "name email")
      .populate("createdBy", "name email");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CLIENT: Get own tasks
 */
exports.getClientTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ client: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CLIENT: Update task status
 */
exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    task.status = req.body.status || task.status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * USER: Delete task
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
