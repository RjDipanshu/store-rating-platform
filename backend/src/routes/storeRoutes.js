const express = require("express");

const router = express.Router();

const storeController =
  require("../controllers/storeController");

const authMiddleware =
  require("../middleware/authMiddleware");


// Get All Stores
router.get(
  "/",
  authMiddleware,
  storeController.getAllStores
);


// Submit Rating
router.post(
  "/:id/rating",
  authMiddleware,
  storeController.submitRating
);


module.exports = router;