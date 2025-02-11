require("dotenv").config();

//MySQL connection pool
const pool = require("../config/db_pool").pool;

async function checkConflicts(leavesAndOffs, start_time, end_time) {
  const lt = new Date(start_time),
    rt = new Date(end_time);

  for (let i = 0; i < leavesAndOffs.length; i++) {
    const timing = leavesAndOffs[i];
    const ls = new Date(timing.start_date),
      rs = new Date(timing.end_date);

    if (lt >= ls && lt < rs) return true;
    if (rt > ls && rt <= rs) return true;
    if (lt <= ls && rt >= rs) return true;
  }
  return false;
}

async function addLeaveOffApplication(
  user_id,
  type,
  startDate,
  endDate,
  duration,
  amt_used
) {
  try {
    const appliedLeaveAndOffs = await getLeaveAndOffsByUserId(user_id);

    if (await checkConflicts(appliedLeaveAndOffs, startDate, endDate)) {
      throw new Error("Conflicts with other leaves/offs");
    }

    const query = `INSERT INTO leave_offs (user_id, type, start_date, end_date, duration, amt_used) VALUES (?, ?, ?, ?, ?, ?)`;
    await pool.execute(query, [
      user_id,
      type,
      startDate,
      endDate,
      duration,
      amt_used,
    ]);

    var typeNamingConvention = "";
    if (type == "Leave") {
      typeNamingConvention = "leaves";
    } else {
      typeNamingConvention = "offs";
    }

    const query2 = `UPDATE users SET ${typeNamingConvention} = ${typeNamingConvention} - ? WHERE id = ?;`;
    await pool.execute(query2, [amt_used, user_id]);
  } catch (err) {
    throw new Error("Error inserting a leave/off application");
  }
}

async function getLeaveAndOffsByUserId(user_id) {
  try {
    const query = `SELECT * FROM leave_offs WHERE user_id = ?`;
    const [rows, field] = await pool.execute(query, [user_id]);
    return rows;
  } catch (err) {
    throw new Error("Error getting leaves and offs from user_id");
  }
}

async function getAllPendingLeavesOffs() {
  try {
    const query = `SELECT l.leave_offs_id, l.user_id, u.name, l.type, l.start_date, l.end_date, l.duration, l.amt_used, l.status FROM leave_offs l, users u WHERE l.status = 'pending' AND l.user_id = u.id`;
    const [rows, field] = await pool.execute(query);
    return rows;
  } catch (err) {
    throw new Error("Error getting all pending offs");
  }
}

async function updateLeaveOffsStatus(leave_offs_id, action) {
  try {
    const query = `UPDATE leave_offs SET status = ? WHERE leave_offs_id = ?`;
    await pool.execute(query, [action, leave_offs_id]);
  } catch (err) {
    throw new Error("Error updating leave/off status");
  }
}

async function updateUserLeaveOffCount(user_id, type, amt_used) {
  try {
    var typeNamingConvention = "";
    if (type == "Leave") {
      typeNamingConvention = "leaves";
    } else {
      typeNamingConvention = "offs";
    }
    const query = `UPDATE users SET ${typeNamingConvention} = ${typeNamingConvention} + ? WHERE id= ?`;
    await pool.execute(query, [amt_used, user_id]);
  } catch (err) {
    throw new Error("Error updating user leave/off balance");
  }
}

async function getLeavesByUserId(user_id) {
  try {
    const query = `SELECT * FROM leave_offs WHERE end_date >= CURDATE() AND user_id = ? ORDER BY start_date ASC;`;
    const [rows, field] = await pool.execute(query, [user_id]);
    return rows;
  } catch (err) {
    throw new Error("Error getting all applied leaves and offs from user");
  }
}

async function removeLeaveApplication(leave_offs_id) {
  try {
    const query = `DELETE FROM leave_offs WHERE leave_offs_id = ?;`;
    await pool.execute(query, [leave_offs_id]);
  } catch (err) {
    throw new Error("Error deleting leave application");
  }
}

async function getMonthLeaveOffs(startDate) {
  try {
    const query = `WITH RECURSIVE DateRange AS (
    SELECT MIN(start_date) AS date FROM leave_offs UNION ALL SELECT DATE_ADD(date, INTERVAL 1 DAY) FROM DateRange WHERE DATE_ADD(date, INTERVAL 1 DAY) <= (SELECT MAX(end_date) FROM leave_offs)
    )
    SELECT DATE_FORMAT(dr.date, '%Y-%m-%d') AS date,  -- Format the date to YYYY-MM-DD
    GROUP_CONCAT(
      DISTINCT CONCAT(u.name, ' [', UPPER(SUBSTRING(lo.status, 1, 1)), LOWER(SUBSTRING(lo.status, 2)), ': ', lo.type, ', ', lo.duration, ']')
        ORDER BY u.name SEPARATOR "\n"
    ) AS user_info
    FROM DateRange dr LEFT JOIN leave_offs lo ON dr.date BETWEEN lo.start_date AND lo.end_date LEFT JOIN users u ON lo.user_id = u.id
    WHERE EXISTS (
      SELECT 1
      FROM leave_offs lo
      WHERE dr.date BETWEEN lo.start_date AND lo.end_date 
      AND YEAR(dr.date) = YEAR(?) 
      AND MONTH(dr.date) = MONTH(?)
    )
    AND lo.status != 'rejected'
    GROUP BY dr.date ORDER BY dr.date;`;
    const [rows, field] = await pool.execute(query, [startDate, startDate]);
    return rows;
  } catch (err) {
    throw new Error("Error getting month's leaves and offs");
  }
}

async function getLeavesByDate(startDate) {
  try {
    const query = `SELECT u.name AS user_name, r.role_name AS role, lo.type AS leave_type, lo.start_date, lo.end_date, lo.duration, lo.amt_used,
    CONCAT(UPPER(SUBSTRING(lo.status, 1, 1)), LOWER(SUBSTRING(lo.status, 2))) AS status
    FROM leave_offs lo JOIN users u ON lo.user_id = u.id JOIN roles r ON u.role_id = r.id
    WHERE ? BETWEEN DATE(lo.start_date) AND DATE(lo.end_date)
    AND lo.status != 'rejected';`;
    const [rows, field] = await pool.execute(query, [startDate]);
    return rows;
  } catch (err) {
    throw new Error("Error getting all leaves and offs from date");
  }
}

module.exports = {
  addLeaveOffApplication,
  getAllPendingLeavesOffs,
  updateLeaveOffsStatus,
  updateUserLeaveOffCount,
  getLeavesByUserId,
  removeLeaveApplication,
  getMonthLeaveOffs,
  getLeavesByDate,
};
