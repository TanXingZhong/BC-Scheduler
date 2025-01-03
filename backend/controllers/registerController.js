const db = require("../model/db");
const db_roles = require("../model/db_roles");
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
      return res.status(409).json({ message: "Email already taken" });
    }

    //Encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    const role_id = await db_roles.findDefaultRoleId();
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
      firstAid ? firstAid : false,
      role_id
    );

    //Respond with a success message
    res.status(201).json({ message: `New user ${email} created!` });
  } catch (err) {
    res.status(500).json({ message: "Error creating new user." });
  }
};

module.exports = { handleNewUser };
