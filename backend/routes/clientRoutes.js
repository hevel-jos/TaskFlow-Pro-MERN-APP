const express = require("express");
const {
  createClient,
  getClients,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize("user"));

router.post("/", createClient);
router.get("/", getClients);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;