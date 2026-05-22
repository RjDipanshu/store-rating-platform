const validator = require("validator");

// Helper to validate password according to rules: 8-16 chars, 1 uppercase, 1 special character
const validatePasswordStrength = (password) => {
  const errors = [];
  const pwd = password || "";
  
  if (pwd.length < 8 || pwd.length > 16) {
    errors.push("Password must be between 8 and 16 characters.");
  }
  if (!/[A-Z]/.test(pwd)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  // Check for at least one special character (non-alphanumeric or underscore)
  if (!/[\W_]/.test(pwd)) {
    errors.push("Password must contain at least one special character.");
  }
  
  return errors;
};

exports.validatePassword = (password) => {
  return validatePasswordStrength(password);
};

exports.validateRegister = (data) => {
  const errors = [];

  // Name validation: Min 20, Max 60
  if (!data.name || data.name.trim().length < 20 || data.name.trim().length > 60) {
    errors.push("Name must be between 20 and 60 characters.");
  }

  // Email validation
  if (!data.email || !validator.isEmail(data.email)) {
    errors.push("Invalid email address.");
  }

  // Password validation: 8-16 chars, 1 uppercase, 1 special character
  const pwdErrors = validatePasswordStrength(data.password);
  errors.push(...pwdErrors);

  // Address validation: Max 400
  if (!data.address || data.address.trim().length === 0) {
    errors.push("Address is required.");
  } else if (data.address.length > 400) {
    errors.push("Address must be less than 400 characters.");
  }

  return errors;
};
