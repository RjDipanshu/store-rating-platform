const express = require("express");

const router = express.Router();

const ownerController =
  require("../controllers/ownerController");

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");



// Owner Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("STORE_OWNER"),
  ownerController.dashboard
);


module.exports = router;