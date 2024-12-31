const db = require("../model/db");
const db_schedule = require("../model/db_schedule");

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

module.exports = {
  getAllUsers,
  getUserByUserId,
};
