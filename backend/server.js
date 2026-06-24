// Entry point — boots the Express app, loads middleware, and mounts all routes
require("dotenv").config();

const express = require("express");
const cors    = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────────
// Allows frontend (different port/domain) to talk to this backend
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";
app.use(cors({ origin: CORS_ORIGIN }));

// Parses incoming JSON request bodies (req.body)
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────

// All auth routes live under /api/auth
// e.g. POST /api/auth/register,  GET /api/auth/get-user
app.use("/api/auth", authRoutes);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
