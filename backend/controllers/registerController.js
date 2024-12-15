const db = require("../model/db"); // Import your DB connection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const handleNewUser = async (req, res) => {
  const { username, password, active, role } = req.body; // Ensure birth and role are passed if required

  // Ensure the required fields are present
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password required.",
    });
  }
  // check for duplicate usernames in the db
  try {
    const userExists = await db.checkUserExists(username);
    if (userExists) {
      return res.status(409).json({ message: "Username already taken" });
    }

    //Encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    //Add new user to db
    await db.addUser(username, hashedPwd);

    //Respond with a success message
    res.status(201).json({ success: `New user ${username} created!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating new user." });
  }
};

module.exports = { handleNewUser };
