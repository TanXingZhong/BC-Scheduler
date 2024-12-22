const db = require("../model/db");
const db_roles = require("../model/db_roles");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  // Get all users from SQL
  try {
    const allNames = await db.getAllUsersNames();
    return res.status(200).json({ rows: allNames });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching users." });
  }
};

module.exports = {
  getAllUsers,
};
