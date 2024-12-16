require("dotenv").config();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { validate } = require("uuid");

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

// Hash password
// async function hashPassword(password) {
//   try {
//     const hashedPwd = await bcrypt.hash(password, 10); // salt rounds
//     return hashedPwd;
//   } catch (err) {
//     throw new Error(err);
//   }
// }

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
  const query = "SELECT * FROM users"

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
async function getUserByUsername(username) {
  const query = "SELECT * FROM users WHERE username = ?";
  const values = [username];

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
async function checkUserExists(username) {
  const user = await getUserByUsername(username);
  return user.length > 0;
}

// Add new user to the database
async function addUser(username, password) {
  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  const values = [username, password];

  try {
    const [result] = await pool.execute(query, values);
    console.log("User added successfully", result);
    return result;
  } catch (err) {
    console.error("Error adding user:", err);
    throw new Error(err);
  }
}

async function updateUser(username, password, roles, active) {
  const query = "UPDATE users SET password = ?, roles = ?, active = ? WHERE username = ?";
  const values = [password, roles, active, username];

  try {
    const [result] = await pool.execute(query, values);
    console.log("User updated successfully", result);
    return result;
  } catch (err) {
    console.error("Error updating user:", err);
    throw new Error(err);
  }
}

async function deleteUser(username) {
  const query = "DELETE FROM users WHERE username = ?";
  const values = [username];

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
  getUserByUsername,
  checkUserExists,
  addUser,
  updateUser,
  deleteUser,
};
