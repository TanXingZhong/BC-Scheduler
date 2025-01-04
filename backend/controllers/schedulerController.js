const db_schedule = require("../model/db_schedule");
const db = require("../model/db");

// @desc Get all schedule
// @route GET /schedule
// @access Private
const getAllSchedules = async (req, res) => {
  // Get all schedule from SQL
  const { start_date } = req.body;
  try {
    const allSchedules = await db_schedule.getAllSchedules(start_date);
    const scheduleWithUsers = await db_schedule.getAllSchedulesAndUsers(
      start_date
    );
    return res
      .status(200)
      .json({ rows: allSchedules, rowsplus: scheduleWithUsers });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching schedules." });
  }
};

// @desc Create new schedule
// @route POST /schedule
// @access Private
const createSchedules = async (req, res) => {
  const { outlet_name, start_time, end_time, vacancy, show } = req.body;

  // Confirm data
  if (!outlet_name || !start_time || !end_time || !vacancy) {
    return res.status(400).json({
      message: "outlet_name, start_time, end_time, and vacancy required.",
    });
  }
  // Create and store new schedule
  try {
    await db_schedule.addSchedule(
      outlet_name,
      start_time,
      end_time,
      vacancy,
      show
    );
    return res.status(201).json({
      message: `New schedule at ${outlet_name} created!`,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error creating new schedule." });
  }
};

const createSchedulesAddUser = async (req, res) => {
  const { outlet_name, start_time, end_time, vacancy, user_id, show } =
    req.body;

  // Confirm data
  if (!outlet_name || !start_time || !end_time || !vacancy) {
    return res.status(400).json({
      message: "outlet_name, start_time, end_time, and vacancy required.",
    });
  }

  // Create and store new schedule
  let accepted = [];
  let promiseChain = Promise.resolve();

  user_id.forEach((user) => {
    promiseChain = promiseChain.then(() => {
      return db_schedule.getAllShiftsByUser(user).then((userShifts) => {
        return db
          .checkConflicts(userShifts, start_time, end_time)
          .then((hasConflict) => {
            if (!hasConflict) {
              accepted.push(user);
            }
          });
      });
    });
  });

  try {
    await promiseChain;

    if (accepted.length > 0) {
      const rows = await db_schedule.addSchedule(
        outlet_name,
        start_time,
        end_time,
        vacancy,
        show
      );
      const schedule_id = rows.insertId;
      for (let user of accepted) {
        const schedule = await db_schedule.getScheduleById(schedule_id);
        await db_schedule.addUserToSchedule(schedule_id, user, schedule);
      }

      return res.status(201).json({
        message: `Shift created and assigned!`,
      });
    } else {
      return res.status(400).json({
        message: `Some users have shifts conflict.`,
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error creating new schedule." });
  }
};

// @desc Update a schedule
// @route PATCH /schedule
// @access Private
const updateSchedules = async (req, res) => {
  const { schedule_id, outlet_name, start_time, end_time, vacancy, published } =
    req.body;

  console.log(req.body);
  // Confirm data
  if (!schedule_id || !outlet_name || !start_time || !end_time || vacancy < 0) {
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
      published
    );
    return res
      .status(200)
      .json({ message: `Schedule ID ${schedule_id} updated!` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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
    return res.status(500).json({ message: "Error checking for Schedule ID." });
  }
  // Delete the user
  try {
    await db_schedule.deleteScheduleId(schedule_id);
    return res
      .status(200)
      .json({ message: `Schedule ${schedule_id} deleted!` });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting schedule." });
  }
};

const addUserToSchedule = async (req, res) => {
  const { schedule_id, employee_id } = req.body;
  if (!schedule_id || !employee_id) {
    return res.status(400).json({
      message: "schedule_id and employee_id are required.",
    });
  }

  try {
    const exists = await db_schedule.checkUserExistsInSchedule(
      schedule_id,
      employee_id
    );
    if (exists) {
      return res.status(409).json({
        message: "User already working in this time slot.",
      });
    }

    const schedule = await db_schedule.getScheduleById(schedule_id);
    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found.",
      });
    }

    const userShifts = await db_schedule.getAllShiftsByUser(employee_id);
    const hasConflict = await db.checkConflicts(
      userShifts,
      schedule[0].start_time,
      schedule[0].end_time
    );
    if (hasConflict) {
      return res.status(409).json({
        message: "User shift has a conflict.",
      });
    }
    await db_schedule.addUserToSchedule(schedule_id, employee_id, schedule);
    return res.status(200).json({
      message: `User ${employee_id} added to schedule ${schedule_id}`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const removeUserFromSchedule = async (req, res) => {
  const { schedule_id, employee_id } = req.body;

  if (!schedule_id || !employee_id) {
    return res.status(400).json({
      message: "schedule_id, employee_id required.",
    });
  }

  try {
    const exists = await db_schedule.checkScheduleIdExists(schedule_id);
    if (!exists) {
      return res.status(409).json({
        message: "Schedule doesnt exist",
      });
    }
    await db_schedule.removeScheduledWorker(schedule_id, employee_id);
    return res.status(200).json({
      message: `User ${employee_id} removed from schedule ${schedule_id}`,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error removing user from schedule" });
  }
};

const changeUserFromSchedule = async (req, res) => {
  const { schedule_id, employee_id, new_employee_id } = req.body;

  if (!schedule_id || !employee_id || !new_employee_id) {
    return res.status(400).json({
      message: "schedule_id, employee_id and new_employee_id required.",
    });
  }

  try {
    const exists = await db_schedule.checkScheduleIdExists(schedule_id);
    if (!exists) {
      return res.status(409).json({
        message: "Schedule doesnt exist",
      });
    }
    await db_schedule.replaceScheduledWorker(
      schedule_id,
      employee_id,
      new_employee_id
    );
    return res.status(200).json({
      message: `User ${employee_id} replace with User ${new_employee_id} in schedule ${schedule_id}`,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error replacing user from schedule" });
  }
};

module.exports = {
  getAllSchedules,
  createSchedules,
  updateSchedules,
  deleteSchedules,
  addUserToSchedule,
  createSchedulesAddUser,
  removeUserFromSchedule,
  changeUserFromSchedule,
};
