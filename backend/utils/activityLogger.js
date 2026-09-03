const Activity = require("../models/activityModel");

const logActivity = async (action, req, extra = {}) => {
  try {
    const user = req.user || {};
    const record = {
      action,
      user: user._id || req.userId || null,
      userName: user.username || (extra.userName ? extra.userName : "Unknown"),
      targetType: extra.targetType || null,
      targetId: extra.targetId || "",
      targetName: extra.targetName || "",
    };
    await Activity.create(record);
  } catch (error) {
    console.error("❌ Failed to log activity:", error.message);
  }
};

module.exports = { logActivity };
