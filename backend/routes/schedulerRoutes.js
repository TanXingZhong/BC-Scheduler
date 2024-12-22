const express = require("express");
const router = express.Router();
const schedulerController = require("../controllers/schedulerController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT.verifyAdmin);

router
  .route("/")
  .get(schedulerController.getAllSchedules)
  .post(schedulerController.createSchedules)
  .patch(schedulerController.updateSchedules)
  .delete(schedulerController.deleteSchedules)
  .put(schedulerController.addUserToSchedule);

module.exports = router;
