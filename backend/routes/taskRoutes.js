const express = require("express");
const {
  createTask,
  getAllTasks,
  getClientTasks,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require auth
router.use(protect);

// USER routes
router.post("/", authorize("user"), createTask);
router.get("/", authorize("user"), getAllTasks);
router.delete("/:id", authorize("user"), deleteTask);

// CLIENT routes
router.get("/my-tasks", authorize("client"), getClientTasks);
router.put("/:id/status", authorize("client"), updateTaskStatus);

module.exports = router;
