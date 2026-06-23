// Protects routes — only lets requests through if they carry a valid Firebase token
const admin = require("../config/firebase");

const authMiddleware = async (req, res, next) => {

  // Check if Authorization header exists and starts with "Bearer "
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract the token part after "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    // Ask Firebase to verify the token — returns decoded user info if valid
    const decodedUser = await admin.auth().verifyIdToken(token);

    // Attach user info to the request so controllers can use it (req.user.uid, req.user.email)
    req.user = decodedUser;

    // Token is valid — move on to the next handler
    next();
  } catch (error) {
    // Token is invalid, expired, or tampered with
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
