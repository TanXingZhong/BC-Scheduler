const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const leaveController = require("../controllers/leaveController");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/leaveoffapply").post(leaveController.applyLeaveOffs);
router.route("/appliedleaves").post(leaveController.getLeavesByUserId);

router
  .route("/clearleaveapplication")
  .post(leaveController.clearLeaveApplication);

router.use(verifyJWT.verifyAdmin);
router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);
router.route("/reset-password").post(usersController.resetPassword);

router.route("/leaveoffapprovalaction").put(leaveController.actionLeaveOff);
router.route("/leaveoff").get(leaveController.getAllPendingLeavesAndOffs);

module.exports = router;
