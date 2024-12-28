const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const leaveController = require("../controllers/leaveController");
const verifyJWT = require("../middleware/verifyJWT");

router
.route("/leaveoffapply").post(leaveController.applyLeaveOffs)

router.use(verifyJWT.verifyAdmin);
router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
