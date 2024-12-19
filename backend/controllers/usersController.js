const db = require("../model/db");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  // Get all users from SQL
  try {
    const allUsers = await db.getAllUsers();
    return res.status(200).json({ rows: allUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching users." });
  }
  // If no users
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const { username, password, roles } = req.body;

  // Confirm data
  if (!username || !password || !roles) {
    return res
      .status(400)
      .json({ message: "Username, password, and roles required." });
  }
  // Check for duplicate username
  try {
    const duplicate = await db.checkUserExists(username);
    if (duplicate) {
      return res.status(409).json({ message: "Username already taken." });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error checking for duplicated user." });
  }
  // Create and store new user
  const hashedPwd = await bcrypt.hash(password, 10);

  try {
    const result = await db.addUser(username, hashedPwd);
    return res.status(201).json({ message: `New user ${username} created!` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating new user." });
  }
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const {
    name,
    nric,
    email,
    phonenumber,
    sex,
    dob,
    bankName,
    bankAccountNo,
    address,
    workplace,
    occupation,
    driverLicense,
    firstAid,
    joinDate,
    roles,
    active,
  } = req.body;
  // Confirm data
  if (!name) {
    return res.status(400).json({ message: "Missing Informations" });
  }

  // Does the user exist to update?
  try {
    const exist = await db.getUserByEmail(email);
    if (!exist) {
      return res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error checking for user." });
  }

  // Allow updates to the original user
  try {
    await db.updateUser(
      name,
      nric,
      email,
      phonenumber,
      sex,
      dob,
      bankName,
      bankAccountNo,
      address,
      workplace,
      occupation,
      driverLicense,
      firstAid,
      joinDate,
      roles,
      active
    );
    return res.status(200).json({ message: `User ${email} updated!` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating user." });
  }
};

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { email } = req.body;

  // Confirm data
  if (!email) {
    return res.status(400).json({ message: "Email required." });
  }
  // Does the user still have assigned notes?

  // Does the user exist to delete?
  try {
    const exist = await db.checkUserExists(email);
    if (!exist) {
      return res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error checking for user." });
  }
  // Delete the user
  try {
    const result = await db.deleteUser(email);
    return res.status(200).json({ message: `User ${email} deleted!` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting user." });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
