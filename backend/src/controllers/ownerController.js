const {
  getOwnerDashboard
} = require("../services/ownerService");



// Owner Dashboard
exports.dashboard = async (
  req,
  res
) => {

  try {

    const data =
      await getOwnerDashboard(
        req.user.id
      );

    res.json({
      success: true,
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};