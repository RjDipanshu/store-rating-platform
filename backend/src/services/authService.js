const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Register Service
exports.registerUser = async ({
  name,
  email,
  password,
  address
}) => {

  // Check existing user
  const existingUser =
    await prisma.user.findUnique({
      where: { email }
    });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword =
    await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      address,
      role: "USER"
    }
  });

  return user;
};



// Login Service
exports.loginUser = async ({
  email,
  password
}) => {

  const user =
    await prisma.user.findUnique({
      where: { email }
    });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  return {
    token,
    user
  };
};

// Update Password Service
exports.updateUserPassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error("Incorrect current password.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  return { success: true };
};