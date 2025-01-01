const db = require("../model/db");
const db_roles = require("../model/db_roles");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  // Get all users from SQL
  try {
    const allUsers = await db.getAllUsers();
    const allRoles = await db_roles.getAllRoles();
    return res.status(200).json({ rows: allUsers, allRoles: allRoles });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching users." });
  }
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

  //Find ID for default role "user"
  const role_id = await db_roles.findOne({ where: { role_name: "User" } });
  try {
    await db.addUser(username, hashedPwd, role_id);
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
  const data = req.body;
  // Confirm data
  if (
    !data.name ||
    !data.nric ||
    !data.email ||
    !data.phonenumber ||
    !data.sex ||
    !data.dob ||
    !data.bankName ||
    !data.bankAccountNo ||
    !data.address ||
    !data.workplace ||
    !data.occupation ||
    data.driverLicense == null ||
    data.firstAid == null ||
    !data.joinDate ||
    !data.role_id ||
    data.active == null ||
    data.admin == null ||
    data.leaves == null ||
    data.offs == null
  ) {
    return res.status(400).json({ message: "Missing Informations" });
  }

  // Does the user exist to update?
  try {
    const exist = await db.getUserByEmail(data.email);
    if (!exist) {
      return res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error checking for user." });
  }

  // Allow updates to the original user
  try {
    await db.updateUser(data);
    return res.status(200).json({ message: `User ${data.email} updated!` });
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
    await db.deleteUser(email);
    return res.status(200).json({ message: `User ${email} deleted!` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting user." });
  }
};

const getWorkinghours = async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    const allWorkingHours = await db.getWorkinghours(startDate, endDate);
    return res.status(200).json({ rows: allWorkingHours });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error fetching working hours of users." });
  }
};
const resetPassword = async (req, res) => {
  const { id, newPassword, confirmPassword } = req.body;

  // Confirm data
  console.log("resetPassword");
  console.log(req.body);

  if (!id || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Hash the new password
  const hashedPwd = await bcrypt.hash(newPassword, 10);
  // Update the user's password
  try {
    await db.updatePassword(id, hashedPwd);
    return res.status(200).json({ message: "Password updated." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating password." });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getWorkinghours,
  resetPassword,
};
