const db = require("../model/db"); // Import your DB connection
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  // Get all users from SQL
  // If no users
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const { username, password, roles } = req.body;

  // Confirm data

  // Check for duplicate username

  // Hash password

  // Create and store new user
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // Confirm data

  // Does the user exist to update?

  // Check for duplicate

  // Allow updates to the original user
};

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body;

  // Confirm data

  // Does the user still have assigned notes?

  // Does the user exist to delete?
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
