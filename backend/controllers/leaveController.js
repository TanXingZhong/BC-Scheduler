const db_leaveOffsApp = require("../model/db_leaveOffsApp");

const applyLeaveOffs = async (req, res) => {
  console.log("receved");

  const { user_id, type, startDate, endDate, duration } = req.body;

  // Confirm data
  if (!user_id || !type || !startDate || !endDate || !duration) {
    return res.status(400).json({
      message: "outlet_name, start_time, end_time, and vacancy required.",
    });
  }
  // Create and store new schedule
  try {
    await db_leaveOffsApp.addLeaveOffApplication(user_id, type, startDate, endDate, duration);
    return res.status(201).json({
      message: `${type} applied from ${startDate} to ${endDate} (${duration}) for ${user_id}!`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating applying leave/off." });
  }
};

module.exports = {
  applyLeaveOffs
};
