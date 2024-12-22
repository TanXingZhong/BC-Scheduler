require("dotenv").config();
const bcrypt = require("bcrypt");

// Create a MySQL connection pool
const pool = require("../config/db_pool").pool;

// Compare password
async function comparePassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (err) {
    throw new Error(err);
  }
}

// Get all users from SQL
async function getAllUsers() {
  const query = `
    SELECT 
      users.id, 
      users.name, 
      users.nric, 
      users.email, 
      users.phonenumber, 
      users.sex, 
      users.dob, 
      users.bankName, 
      users.bankAccountNo, 
      users.address, 
      users.workplace, 
      users.occupation, 
      users.driverLicense, 
      users.firstAid, 
      users.role_id, 
      roles.role_name,  -- role name from the roles table
      users.active, 
      users.joinDate, 
      users.admin 
    FROM users
    JOIN roles ON users.role_id = roles.id`;

  try {
    // Execute query using promise pool
    const [rows, fields] = await pool.execute(query);

    // Log the result to inspect
    console.log("Database query result:", rows);

    return rows; // Returns the rows (user data)
  } catch (err) {
    console.error("Error occurred while fetching users:", err);
    throw new Error("Error fetching users: " + err.message); // Throw a detailed error message
  }
}

// Get user by username
async function getUserByEmail(email) {
  const query = "SELECT * FROM users WHERE email = ?";
  const values = [email];

  try {
    // Execute query using promise pool
    const [rows, fields] = await pool.execute(query, values);

    // Log the result to inspect
    console.log("Database query result:", rows);

    return rows; // Returns the rows (user data)
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Error fetching user.");
  }
}

// Check if user exists
async function checkUserExists(email) {
  const user = await getUserByEmail(email);
  return user.length > 0;
}

// Add new user to the database
async function addUser(
  name,
  nric,
  email,
  password,
  phonenumber,
  sex,
  dob,
  bankName,
  bankAccountNo,
  address,
  workplace,
  occupation,
  driverLicense,
  firstAid,
  role_id
) {
  const shifts = JSON.stringify({ shifts: [] });
  const query =
    "INSERT INTO users (name, nric, email, password, phonenumber, sex, dob, bankName, bankAccountNo, address, workPlace, occupation, driverLicense, firstAid, shifts, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    name,
    nric,
    email,
    password,
    phonenumber,
    sex,
    dob,
    bankName,
    bankAccountNo,
    address,
    workplace,
    occupation,
    driverLicense,
    firstAid,
    shifts,
    role_id,
  ];

  try {
    const [result] = await pool.execute(query, values);
    console.log("User added successfully", result);
    return result;
  } catch (err) {
    console.error("Error adding user:", err);
    throw new Error(err);
  }
}

async function updateUser(data) {
  const query =
    "UPDATE users SET name = ?, nric = ? , phonenumber = ?, sex = ?, dob = ?, bankName = ?, bankAccountNo = ?, address = ?, workplace = ?, occupation = ?, driverLicense = ?, firstAid = ?, joinDate = ?, role_id = ?, active = ?, admin = ? WHERE email = ?";
  const values = [
    data.name,
    data.nric,
    data.phonenumber,
    data.sex,
    data.dob,
    data.bankName,
    data.bankAccountNo,
    data.address,
    data.workplace,
    data.occupation,
    data.driverLicense,
    data.firstAid,
    data.joinDate,
    data.role_id,
    data.active,
    data.admin,
    data.email,
  ];

  try {
    const [result] = await pool.execute(query, values);
    console.log("User updated successfully", result);
    return result;
  } catch (err) {
    console.error("Error updating user:", err);
    throw new Error(err);
  }
}

async function deleteUser(email) {
  const query = "DELETE FROM users WHERE email = ?";
  const values = [email];

  try {
    const [result] = await pool.execute(query, values);
    console.log("User deleted successfully", result);
    return result;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw new Error(err);
  }
}

function checkConflicts(shifts, start_time, end_time) {
  const lt = new Date(start_time),
    rt = new Date(end_time);

  for (let i = 0; i < shifts.length; i++) {
    const shift = shifts[i];
    const ls = new Date(shift.start_time),
      rs = new Date(shift.end_time);

    if (lt >= ls && lt < rs) return true;
    if (rt > ls && rt <= rs) return true;
    if (lt <= ls && rt >= rs) return true;
  }

  return false;
}

async function addScheduleToUser(email, schedule_id, start_time, end_time) {
  try {
    console.log("Adding schedule to user");
    console.log(email, schedule_id, start_time, end_time);

    const user = await getUserByEmail(email);

    if (checkConflicts(user[0].shifts.body, start_time, end_time)) {
      throw new Error("Shifts conflict");
    }

    const shifts = user[0].shifts;

    shifts.body.push({
      schedule_id: schedule_id,
      start_time: start_time,
      end_time: end_time,
    });
    const shifts_json = JSON.stringify(shifts);
    const query = "UPDATE users SET shifts = ? WHERE email = ?";
    const values = [shifts_json, email];
    const [result] = await pool.execute(query, values);
    console.log("Schedule added to user successfully", result);

    return result;
  } catch (err) {
    throw new Error(err);
  }
}

async function removeScheduleFromUser(email, schedule_id) {
  try {
    const user = await getUserByEmail(email);
    const shifts = user[0].shifts;

    const newShifts = shifts.body.filter(
      (shift) => shift.schedule_id != schedule_id
    );
    shifts.body = newShifts;
    const shifts_json = JSON.stringify(shifts);
    const query = "UPDATE users SET shifts = ? WHERE email = ?";
    const values = [shifts_json, email];
    const [result] = await pool.execute(query, values);
    console.log("Schedule removed from user successfully", result);

    return result;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  comparePassword,
  getAllUsers,
  getUserByEmail,
  checkUserExists,
  addUser,
  updateUser,
  deleteUser,
  checkConflicts,
  addScheduleToUser,
  removeScheduleFromUser,
};
