require("dotenv").config();
const bcrypt = require("bcrypt");

//MySQL connection pool
const pool = require("../config/db_pool").pool;

async function checkConflicts(shifts, start_time, end_time) {
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

async function getAllRoles() {
  const query = "SELECT id, role_name FROM roles";

  try {
    // Execute query using promise pool
    const [rows, fields] = await pool.execute(query);

    // log the result to inspect
    console.log("Database query result for all roles:", rows);

    return rows; // Returns the rows (user data)
  } catch (err) {
    throw new Error(err);
  }
}

// Compare password
async function comparePassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (err) {
    throw new Error(err);
  }
}

async function getAllUsersNames() {
  const query = `
  SELECT 
    users.id, 
    users.name, 
    users.email, 
    users.role_id, 
    roles.role_name  -- role name from the roles table
  FROM users
  JOIN roles ON users.role_id = roles.id`;
  try {
    const [rows, fields] = await pool.execute(query);
    console.log("Database query result:", rows);
    return rows;
  } catch (err) {
    console.error("Error occurred while fetching users:", err);
    throw new Error("Error fetching users: " + err.message);
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

// // Get user by username
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

async function getUserByid(id) {
  const query = "SELECT * FROM users WHERE id = ?";
  const values = [id];

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

async function getUserByidWithoutPassword(id) {
  console.log("userid", id);
  const query =
    "SELECT id, name, nric, email, phonenumber, sex, dob, bankName, bankAccountNo, address, workplace, occupation, driverLicense, firstAid, joinDate, admin, active, role_id, leaves, offs FROM users WHERE id = ?";
  const values = [id];
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
  try {
    const user = await getUserByEmail(email);
    return user.length > 0;
  } catch (err) {
    throw new Error(err);
  }
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
  const query =
    "INSERT INTO users (name, nric, email, password, phonenumber, sex, dob, bankName, bankAccountNo, address, workPlace, occupation, driverLicense, firstAid, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
    "UPDATE users SET name = ?, nric = ? , phonenumber = ?, sex = ?, dob = ?, bankName = ?, bankAccountNo = ?, address = ?, workplace = ?, occupation = ?, driverLicense = ?, firstAid = ?, joinDate = ?, role_id = ?, active = ?, admin = ? WHERE id = ?";
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
    data.id,
  ];

  try {
    console.log("updating user");
    const [result] = await pool.execute(query, values);
    console.log("User updated successfully", result);
    return result;
  } catch (err) {
    console.error("Error updating user:", err);
    throw new Error(err);
  }
}

async function deleteUser(id) {
  const query = "DELETE FROM users WHERE id = ?";
  const values = [id];

  try {
    const [result] = await pool.execute(query, values);
    console.log("User deleted successfully", result);
    return result;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw new Error(err);
  }
}

module.exports = {
  getAllUsersNames,
  checkUserExists,
  getAllRoles,
  comparePassword,
  getAllUsers,
  getUserByid,
  getUserByEmail,
  addUser,
  updateUser,
  deleteUser,
  checkConflicts,
  getUserByidWithoutPassword,
};
