const express = require("express");
const { getActivities } = require("../controllers/activityController");
const authenticateUser = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", authenticateUser, isAdmin, getActivities);

module.exports = router;
