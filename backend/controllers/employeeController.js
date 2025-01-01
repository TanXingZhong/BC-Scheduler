const db = require("../model/db");
const db_schedule = require("../model/db_schedule");
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

const getUserByUserId = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({
      message: "No user id input",
    });
  }
  try {
    const user = await db.getUserByidWithoutPassword(user_id);
    const userShfits = await db_schedule.getAllShiftsByUser(user_id);
    return res.status(200).json({ employee: user, userShifts: userShfits });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching user info." });
  }
};

const changePassword = async (req, res) => {
  const { user_id, oldPassword, newPassword } = req.body;

  if (!user_id || !oldPassword || !newPassword) {
    return res.status(400).json({
      message: "Missing input",
    });
  }

  try {
    const user = await db.getUserByid(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const match = await bcrypt.compare(oldPassword, user[0].password);
    
    if (!match) {
      return res.status(401).json({
        message: "Old password incorrect",
      });
    }

    const hashedPwd = await bcrypt.hash(newPassword, 10);
    await db.updatePassword(user_id, hashedPwd);

    return res.status(200).json({
      message: "Password updated",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error updating password",
    });
  }
}

module.exports = {
  getAllUsers,
  getUserByUserId,
  changePassword,
};
