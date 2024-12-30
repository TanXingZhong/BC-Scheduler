const express = require("express");
const router = express.Router();
const schedulerController = require("../controllers/schedulerController");
const shiftApplicationController = require("../controllers/shiftApplicationController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT.verifyAdmin);

router
  .route("/")
  .post(schedulerController.createSchedules)
  .patch(schedulerController.updateSchedules)
  .delete(schedulerController.deleteSchedules)
  .put(schedulerController.addUserToSchedule);

router.route("/createAdd").post(schedulerController.createSchedulesAddUser);
router.route("/bydate").post(schedulerController.getAllSchedules);

router
  .route("/user")
  .post(shiftApplicationController.getUserPendingApplication)
  .delete(shiftApplicationController.deleteApplication);

router
  .route("/application")
  .get(shiftApplicationController.getAllPendingApplication)
  .post(shiftApplicationController.applyShift)
  .put(shiftApplicationController.approve_reject)
  .delete(shiftApplicationController.deleteApplication);

module.exports = router;
