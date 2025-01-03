const express = require("express");
const router = express.Router();
const schedulerController = require("../controllers/schedulerController");
const shiftApplicationController = require("../controllers/shiftApplicationController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT.verifyJWT);
router.route("/bydate").post(schedulerController.getAllSchedules);

router
  .route("/application")
  .post(shiftApplicationController.applyShift)
  .delete(shiftApplicationController.deleteApplication);

router
  .route("/user")
  .post(shiftApplicationController.getUserPendingApplication)
  .delete(shiftApplicationController.deleteApplication);

router.use(verifyJWT.verifyAdmin);
router
  .route("/")
  .post(schedulerController.createSchedules)
  .patch(schedulerController.updateSchedules)
  .delete(schedulerController.deleteSchedules)
  .put(schedulerController.addUserToSchedule);

router
  .route("/edit")
  .delete(schedulerController.removeUserFromSchedule)
  .post(schedulerController.changeUserFromSchedule);

router.route("/createAdd").post(schedulerController.createSchedulesAddUser);

router
  .route("/application")
  .get(shiftApplicationController.getAllPendingApplication)
  .put(shiftApplicationController.approve_reject);

module.exports = router;
