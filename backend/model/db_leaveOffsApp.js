require("dotenv").config();

//MySQL connection pool
const pool = require("../config/db_pool").pool;

async function addLeaveOffApplication(user_id, type, startDate, endDate, duration) {
  try {
    const query = `INSERT INTO leave_offs (user_id, type, start_date, end_date, duration) VALUES (?, ?, ?, ?, ?)`;
    await pool.execute(query, [user_id, type, startDate, endDate, duration]);
  } catch (err) {
    console.log(err);
    throw new Error("Error inserting a leave/off application");
  }
}

module.exports = {
  addLeaveOffApplication
};
