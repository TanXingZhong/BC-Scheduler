const db = require("../model/db"); // Import your DB connection
const bcrypt = require("bcrypt");
const handleNewUser = async (req, res) => {
  const {
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
  } = req.body; // Ensure username, password are passed if required

  // Ensure the required fields are present
  if (
    !name ||
    !nric ||
    !email ||
    !password ||
    !phonenumber ||
    !sex ||
    !dob ||
    !bankName ||
    !bankAccountNo ||
    !address
  ) {
    return res.status(400).json({
      message: "Missing Informations",
    });
  }
  // check for duplicate usernames in the db
  try {
    const userExists = await db.checkUserExists(email);
    if (userExists) {
      return res.status(409).json({ message: "Username already taken" });
    }

    //Encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    //Add new user to db
    await db.addUser(
      name,
      nric,
      email,
      hashedPwd,
      phonenumber,
      sex,
      dob,
      bankName,
      bankAccountNo,
      address,
      workplace ? workplace : "NA",
      occupation ? occupation : "NA",
      driverLicense ? driverLicense : false,
      firstAid ? firstAid : false
    );

    //Respond with a success message
    res.status(201).json({ success: `New user ${email} created!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating new user." });
  }
};

module.exports = { handleNewUser };
