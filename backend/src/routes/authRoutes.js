const express = require("express");

const router = express.Router();

const {
  register,
  login,
  updatePassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");


// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Update Password
router.post("/update-password", authMiddleware, updatePassword);


module.exports = router;