require("dotenv").config();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

//To Shift to Config
// Create a MySQL connection pool
const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  })
  .promise(); // Use promise-based pool

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
  const query = "SELECT * FROM users";

  try {
    // Execute query using promise pool
    const [rows, fields] = await pool.execute(query);

    // log the result to inspect
    console.log("Database query result:", rows);

    return rows; // Returns the rows (user data)
  } catch (err) {
    throw new Error(err);
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
  firstAid
) {
  const query =
    "INSERT INTO users (name, nric, email, password, phonenumber, sex, dob, bankName, bankAccountNo, address, workPlace, occupation, driverLicense, firstAid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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

async function updateUser(
  name,
  nric,
  email,
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
  joinDate,
  roles,
  active
) {
  const query =
    "UPDATE users SET name = ?, nric = ? , phonenumber = ?, sex = ?, dob = ?, bankName = ?, bankAccountNo = ?, address = ?, workplace = ?, occupation = ?, driverLicense = ?, firstAid = ?, joinDate = ?, roles = ?, active = ? WHERE email = ?";
  const values = [
    name,
    nric,
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
    joinDate,
    roles,
    active,
    email,
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

module.exports = {
  comparePassword,
  getAllUsers,
  getUserByEmail,
  checkUserExists,
  addUser,
  updateUser,
  deleteUser,
};
