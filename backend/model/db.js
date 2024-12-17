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
async function addUser(name, username, password) {
  const query = "INSERT INTO users (name, username, password) VALUES (?, ?, ?)";
  const values = [name, username, password];

  try {
    const [result] = await pool.execute(query, values);
    console.log("User added successfully", result);
  } catch (err) {
    console.error("Error adding user:", err);
    throw new Error(err);
  }
}

module.exports = {
  comparePassword,
  getUserByUsername,
  checkUserExists,
  addUser,
};
