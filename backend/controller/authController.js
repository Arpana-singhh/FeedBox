// Handles all auth-related business logic: register and login
const admin = require("../config/firebase");

// ── Register ──────────────────────────────────────────────────────────────────
// Creates a new user in Firebase Auth using email + password
const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Create the user in Firebase — Firebase stores email/password securely
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid,
      email: userRecord.email,
    });
  } catch (error) {
    // e.g. email already in use, weak password, etc.
    res.status(400).json({ message: error.message });
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
// Login is handled on the FRONTEND via Firebase client SDK (signInWithEmailAndPassword)
// The frontend gets the ID token and sends it in the Authorization header.
// This endpoint just verifies the token and returns the user info.
const getUser = async (req, res) => {
  // req.user is already set by authMiddleware (token already verified)
  res.status(200).json({
    uid  : req.user.uid,
    email: req.user.email,
    name : req.user.name || null,
  });
};

module.exports = { register, getUser };
