const db_schedule = require("../model/db_schedule");
const db_shiftApplication = require("../model/db_shiftApplication");
const db = require("../model/db");
// @desc Get all schedule
// @route GET /schedule
// @access Private

const getAllPendingApplication = async (req, res) => {
  try {
    const rows = await db_shiftApplication.getAllApplications();
    console.log(rows);
    return res.status(200).json({ rows: rows });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error retriving pending applications" });
  }
};

const getUserPendingApplication = async (req, res) => {
  const { user_id } = req.body;
  try {
    const rows = await db_shiftApplication.getAllApplicationByUserId(user_id);
    return res.status(200).json({ rows: rows });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error retriving user pending applications" });
  }
};

const applyShift = async (req, res) => {
  const { schedule_id, user_id } = req.body;
  try {
    const exist = await db_shiftApplication.checkExistingApplication(
      user_id,
      schedule_id
    );
    if (exist) {
      return res
        .status(400)
        .json({ message: "You already applied for this shift" });
    }
    const shifts = await db_schedule.getAllShiftsByUser(user_id);
    const schedule = await db_schedule.getScheduleById(schedule_id);
    const conflict = await db.checkConflicts(
      shifts,
      schedule[0].start_time,
      schedule[0].end_time
    );
    if (conflict) {
      return res.status(400).json({ message: "User is occupied" });
    }
    if (schedule[0].vacancy > 0) {
      await db_shiftApplication.addShiftApplication(user_id, schedule_id);
      return res.status(201).json({
        message: "Shift application submitted. Awaiting admin approval.",
      });
    } else {
      return res
        .status(400)
        .json({ message: "No available slots for this shift." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error applying for the shift." });
  }
};

const approve_reject = async (req, res) => {
  const { schedule_id, user_id, action } = req.body;
  try {
    if (action !== "accepted" && action !== "rejected") {
      return res.status(400).send({
        message: 'Invalid action. Action should be "accepted" or "rejected".',
      });
    }
    await db_shiftApplication.updateShiftStatus(schedule_id, user_id, action);
    if (action === "accepted") {
      await db_schedule.addUserToSchedule(schedule_id, user_id);
      return res.status(200).send({ message: "Shift application approved." });
    } else if (action === "rejected") {
      return res.status(200).send({
        message:
          "Shift application rejected. You can apply for other shifts or reapply for this one.",
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error approving or rejecting shift application" });
  }
};

const deleteApplication = async (req, res) => {
  const { application_id, action } = req.body;
  try {
    if (action !== "clear") {
      return res.status(400).send({
        message: 'Invalid action. Action should be "clear"',
      });
    }
    const exist = await db_shiftApplication.checkApplicationIdExists(
      application_id
    );
    if (!exist) {
      return res
        .status(400)
        .json({ message: "This application was already deleted" });
    }
    await db_shiftApplication.deleteApplication(application_id);
    return res.status(200).json({ message: "Application sucessfully cleared" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting application" });
  }
};

module.exports = {
  applyShift,
  approve_reject,
  deleteApplication,
  getAllPendingApplication,
  getUserPendingApplication,
};
