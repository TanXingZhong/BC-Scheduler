require("dotenv").config();

//MySQL connection pool
const pool = require("../config/db_pool").pool;

async function getAllApplications() {
  const query = `SELECT 
    sa.application_id AS id,
    sa.user_id,
    u.name,
    r.role_name,
    sa.schedule_id,
    s.start_time AS date,
    s.* -- Retrieves all columns from the schedule table 
    FROM shift_applications sa 
    JOIN  users u ON sa.user_id = u.id 
    JOIN schedule s ON sa.schedule_id = s.schedule_id 
    JOIN roles r ON u.role_id = r.id
    WHERE sa.status = 'pending';`;
  try {
    const [rows, fields] = await pool.execute(query);
    console.log(rows);
    return rows;
  } catch (err) {
    console.error("Original Error:", err); // Log the original error for debugging
    throw new Error(`Error getting application from SQL: ${err.message}`); // Throw new error with original message
  }
}

async function getAllApplicationByUserId(user_id) {
  const query = "SELECT * FROM shifts_application WHERE user_id = ?";
  try {
    const [rows, fields] = await pool.execute(query);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

async function addShiftApplication(user_id, schedule_id) {
  try {
    const query = `INSERT INTO shift_applications (user_id, schedule_id) VALUES (?, ?)`;
    const exists = await checkExistingApplication(user_id, schedule_id);
    if (exists) {
      throw new Error("You have already applied for this shift.");
    }
    await pool.execute(query, [user_id, schedule_id]);
  } catch (err) {
    console.log(err);
    throw new Error("Error inserting a pending shift");
  }
}

async function updateShiftStatus(schedule_id, user_id, action) {
  try {
    const exists = await checkExistingApplication(user_id, schedule_id);
    if (!exists) {
      throw new Error("This shift doesnt exist");
    }
    const query = `UPDATE shift_applications SET status = ? WHERE schedule_id = ? AND user_id = ? AND status = 'pending'`;
    await pool.execute(query, [action, schedule_id, user_id]);
  } catch (err) {
    console.log(err);
    throw new Error("Error updating shift status");
  }
}

async function checkExistingApplication(user_id, schedule_id) {
  try {
    const query = `
      SELECT COUNT(*) AS count 
      FROM shift_applications 
      WHERE user_id = ? AND schedule_id = ? AND status = 'pending'
    `;
    const [rows] = await pool.execute(query, [user_id, schedule_id]);
    return rows[0].count > 0; // Return true if an existing application is found
  } catch (err) {
    console.log(err);
    throw new Error("Error checking for existing application");
  }
}

async function checkApplicationIdExists(application_id) {
  const query = "SELECT * FROM shift_applications WHERE application_id = ?";
  try {
    const [rows, fields] = await pool.execute(query, [application_id]);
    return rows.length > 0;
  } catch (err) {
    throw new Error(err);
  }
}

async function deleteApplication(application_id) {
  const query = "DELETE FROM shift_applications WHERE application_id = ?";
  try {
    await pool.execute(query, [application_id]);
  } catch (err) {
    throw new Error("Error deleting schedule");
  }
}

module.exports = {
  addShiftApplication,
  updateShiftStatus,
  checkExistingApplication,
  checkApplicationIdExists,
  getAllApplicationByUserId,
  deleteApplication,
  getAllApplications,
};
