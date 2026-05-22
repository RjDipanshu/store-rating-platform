const {
  getDashboardStats,
  createUser,
  createStore,
  getAllUsers,
  getAllStores
} = require("../services/adminService");

const { validateRegister } = require("../validators/authValidator");



// Dashboard
exports.dashboard = async (req, res) => {

  try {

    const stats =
      await getDashboardStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// Add User
exports.addUser = async (req, res) => {

  try {
    const errors = validateRegister(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    const user =
      await createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created",
      data: user
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};



// Add Store
exports.addStore = async (req, res) => {

  try {

    const store =
      await createStore(req.body);

    res.status(201).json({
      success: true,
      message: "Store created",
      data: store
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};



// Get Users
exports.users = async (req, res) => {

  try {

    const users =
      await getAllUsers(req.query);

    res.json({
      success: true,
      data: users
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// Get Stores
exports.stores = async (req, res) => {

  try {

    const stores =
      await getAllStores(req.query);

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