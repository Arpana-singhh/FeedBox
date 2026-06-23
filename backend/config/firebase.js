// Firebase Admin SDK — server-side Firebase library (full privileges)
const admin = require("firebase-admin");

// Your secret credentials — proves this request is from your trusted server
const serviceAccount = require("./serviceAccountKey.json");

// Initialize only once (guard prevents re-init if this file is imported multiple times)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export so any file can do: const admin = require('./config/firebase')
module.exports = admin;
