const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);
router.post("/", registerController.handleNewUser);

module.exports = router;
