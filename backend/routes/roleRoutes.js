const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/rolesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT.verifyAdmin);
router
  .route("/")
  .get(rolesController.getAllRoles)
  .post(rolesController.createNewRole)
  .patch(rolesController.updateRole)
  .delete(rolesController.deleteRole);

module.exports = router;
