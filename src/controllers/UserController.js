const User = require('../models/User');

// Get all users from the database
exports.getAllUsers = async () => {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch users.");
  }
};

exports.deleteUser = async (userId) => {
  try {
    await User.findByIdAndDelete(userId);
    return "User deleted successfully";
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete user.");
  }
};
