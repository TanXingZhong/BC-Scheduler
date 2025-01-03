const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT.verifyJWT);
router
  .route("/")
  .get(employeeController.getAllUsers)
  .post(employeeController.getUserByUserId);

module.exports = router;
