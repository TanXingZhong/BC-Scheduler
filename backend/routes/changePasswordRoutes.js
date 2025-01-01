const express = require("express");
const router = express.Router();
const { verifyChangePassword } = require("../middleware/verifyJWT");
const employeeController = require("../controllers/employeeController");

router.use(verifyChangePassword);
router.route("/").post(employeeController.changePassword);

module.exports = router;
