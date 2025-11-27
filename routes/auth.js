const express = require("express");
const router = express.Router();
const { register, login, deleteUser } = require("../controllers/authController");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");

// Auth routes
router.post("/register", register);
router.post("/login", login);

// DELETE user (admin only)
router.delete("/:id", authenticate, authorizeAdmin, deleteUser);

module.exports = router;
