const {
  registerUser,
  loginUser,
  updateUserPassword
} = require("../services/authService");

const {
  validateRegister,
  validatePassword
} = require("../validators/authValidator");



// REGISTER
exports.register = async (req, res) => {

  try {

    const errors =
      validateRegister(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        errors
      });
    }

    const user =
      await registerUser(req.body);

    res.status(201).json({
      message:
        "User registered successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};



// LOGIN
exports.login = async (req, res) => {

  try {

    const data =
      await loginUser(req.body);

    res.json({
      message: "Login successful",
      ...data
    });

  } catch (error) {

    res.status(400).json({
      error: error.message
    });

  }
};


// UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        errors: ["Old password and new password are required."]
      });
    }

    const errors = validatePassword(newPassword);
    if (errors.length > 0) {
      return res.status(400).json({
        errors
      });
    }

    await updateUserPassword(req.user.id, oldPassword, newPassword);

    res.status(200).json({
      success: true,
      message: "Password updated successfully."
    });

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};