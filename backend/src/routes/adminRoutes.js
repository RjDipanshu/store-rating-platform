const express = require("express");

const router = express.Router();

const adminController =
  require("../controllers/adminController");

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");


// Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.dashboard
);


// Add User
router.post(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.addUser
);


// Add Store
router.post(
  "/stores",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.addStore
);


// Get Users
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.users
);


// Get Stores
router.get(
  "/stores",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.stores
);


module.exports = router;