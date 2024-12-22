const db_schedule = require("../model/db_schedule");

// @desc Get all schedule
// @route GET /schedule
// @access Private
const getAllSchedules = async (req, res) => {
  // Get all schedule from SQL
  try {
    const allSchedules = await db_schedule.getAllSchedules();
    return res.status(200).json({ rows: allSchedules });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching schedules." });
  }
};

// @desc Create new schedule
// @route POST /schedule
// @access Private
const createSchedules = async (req, res) => {
  console.log("receved");

  const { outlet_name, start_time, end_time, vacancy } = req.body;

  // Confirm data
  if (!outlet_name || !start_time || !end_time || !vacancy) {
    return res.status(400).json({
      message: "outlet_name, start_time, end_time, and vacancy required.",
    });
  }
  // Create and store new schedule
  try {
    await db_schedule.addSchedule(outlet_name, start_time, end_time, vacancy);
    return res.status(201).json({
      message: `New schedule at ${outlet_name} from ${start_time} to ${end_time} with ${vacancy} vacancy created!`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating new schedule." });
  }
};

// @desc Update a schedule
// @route PATCH /schedule
// @access Private
const updateSchedules = async (req, res) => {
  const {
    schedule_id,
    outlet_name,
    start_time,
    end_time,
    vacancy,
    employee_emails,
    employee_names,
  } = req.body;

  // Confirm data
  if (!schedule_id || !outlet_name || !start_time || !end_time || !vacancy) {
    return res
      .status(400)
      .json({ message: "Missing Informations to update schedule" });
  }

  // Does the schedule exist to update?
  try {
    const exist = await db_schedule.checkScheduleIdExists(schedule_id);
    if (!exist) {
      return res.status(404).json({ message: "Schedule not found." });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error checking for schedule when updating." });
  }

  // Allow updates to the original schedule_id
  try {
    await db_schedule.updateSchedule(
      schedule_id,
      outlet_name,
      start_time,
      end_time,
      vacancy,
      employee_emails,
      employee_names
    );
    return res
      .status(200)
      .json({ message: `Schedule ID ${schedule_id} updated!` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating schedule." });
  }
};

// @desc Delete a schedule
// @route DELETE /schedule
// @access Private
const deleteSchedules = async (req, res) => {
  const { schedule_id } = req.body;

  // Confirm data
  if (!schedule_id) {
    return res.status(400).json({ message: "Schedule ID required." });
  }
  // Does the schedule exist to delete?
  try {
    const exist = await db_schedule.checkScheduleIdExists(schedule_id);
    if (!exist) {
      return res.status(404).json({ message: "Schedule ID not found." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error checking for Schedule ID." });
  }
  // Delete the user
  try {
    await db_schedule.deleteScheduleId(schedule_id);
    return res.status(200).json({ message: `User ${schedule_id} deleted!` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting user." });
  }
};

const addUserToSchedule = async (res, req) => {
  const { employee_emails } = req.body;

  try {
    if (db_schedule.checkUserExistsInSchedule(employee_emails)) {
      return res.status(409).json({
        message: "User already working at another shift in that time slot",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error adding user to schedule" });
  }

  
};
module.exports = {
  getAllSchedules,
  createSchedules,
  updateSchedules,
  deleteSchedules,
  addUserToSchedule,
};