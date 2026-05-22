const {
  getStores,
  submitStoreRating
} = require("../services/storeService");



// Get Stores
exports.getAllStores = async (req, res) => {

  try {

    const stores =
      await getStores(
        req.query,
        req.user?.id
      );

    res.json({
      success: true,
      data: stores
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};




// Submit Rating
exports.submitRating = async (
  req,
  res
) => {

  try {

    const result =
      await submitStoreRating({
        userId: req.user.id,
        storeId: Number(req.params.id),
        rating: req.body.rating
      });

    res.json({
      success: true,
      message: "Rating submitted",
      data: result
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};