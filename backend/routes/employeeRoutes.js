const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const employeeController = require("../controllers/employeeController");

// router.use(verifyJWT.verifyJWT);

router.route("/").get(employeeController.getAllUsers);

module.exports = router;
