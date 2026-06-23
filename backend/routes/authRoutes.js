// Defines all auth-related API endpoints and connects them to controllers
const express = require("express");
const router = express.Router();

const { register, getUser } = require("../controller/authController");
const authMiddleware        = require("../middleware/authMiddleware");

// POST /api/auth/register — create a new user (no token needed, anyone can register)
router.post("/register", register);

// GET /api/auth/me — get logged-in user info (token required)
router.get("/get-user", authMiddleware, getUser);

module.exports = router;
