const db_leaveOffsApp = require("../model/db_leaveOffsApp");

const applyLeaveOffs = async (req, res) => {
  console.log("receved");

  const { user_id, type, startDate, endDate, duration, amt_used } = req.body;

  // Confirm data
  if (!user_id || !type || !startDate || !endDate || !duration || !amt_used) {
    return res.status(400).json({
      message: "outlet_name, start_time, end_time, and vacancy required.",
    });
  }
  // Create and store new schedule
  try {
    await db_leaveOffsApp.addLeaveOffApplication(
      user_id,
      type,
      startDate,
      endDate,
      duration,
      amt_used
    );
    return res.status(201).json({
      message: `${type} applied from ${startDate} to ${endDate} (${duration}) for ${user_id}!`,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error creating applying leave/off." });
  }
};

const getAllPendingLeavesAndOffs = async (req, res) => {
  try {
    const allLeavesAndOffs = await db_leaveOffsApp.getAllPendingLeavesOffs();
    return res.status(200).json({ rows: allLeavesAndOffs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching users." });
  }
};

const actionLeaveOff = async (req, res) => {
  const { leave_offs_id, user_id, type, amt_used, action } = req.body;
  try {
    if (action !== "accepted" && action !== "rejected") {
      return res.status(400).send({
        message: 'Invalid action. Action should be "accepted" or "rejected".',
      });
    }
    await db_leaveOffsApp.updateLeaveOffsStatus(leave_offs_id, action);
    if (action === "accepted") {
      return res.status(200).send({ message: `${type} application approved.` });
    } else if (action === "rejected") {
      await db_leaveOffsApp.updateUserLeaveOffCount(user_id, type, amt_used);
      return res.status(200).send({
        message: `${type} application rejected. You can apply for other day or reapply for this one.`,
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error approving or rejecting leave/off application" });
  }
};

const getLeavesByUserId = async (req, res) => {
  const { user_id } = req.body;
  try {
    const allLeavesAndOffs = await db_leaveOffsApp.getLeavesByUserId(user_id);
    return res.status(200).json({ rows: allLeavesAndOffs });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error fetching applied leaves of user." });
  }
};

const clearLeaveApplication = async (req, res) => {
  const { leave_offs_id, user_id, type, status, amt_used } = req.body;
  try {
    if (!leave_offs_id || !user_id || !type || !status || !amt_used) {
      return res.status(400).send({
        message: "Fields are empty",
      });
    }
    await db_leaveOffsApp.removeLeaveApplication(leave_offs_id);
    if (status === "rejected") {
      return res.status(200).send({ message: `${type} application approved.` });
    } else if (status === "accepted" || status === "pending") {
      await db_leaveOffsApp.updateUserLeaveOffCount(user_id, type, amt_used);
      return res.status(200).send({
        message: `${type} application cancelled. You can apply for other day or reapply for this one.`,
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error cancelling leave/off application" });
  }
};

const getMonthLeaveOffs = async (req, res) => {
  const { startDate } = req.body;
  try {
    const monthLeaveOffs = await db_leaveOffsApp.getMonthLeaveOffs(startDate);
    return res.status(200).json({ rows: monthLeaveOffs });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error fetching the month's leaves and offs." });
  }
};

module.exports = {
  applyLeaveOffs,
  getAllPendingLeavesAndOffs,
  actionLeaveOff,
  getLeavesByUserId,
  clearLeaveApplication,
  getMonthLeaveOffs,
};
