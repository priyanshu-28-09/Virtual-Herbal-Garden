const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userName: {
      type: String,
      default: "",
    },
    targetType: {
      type: String,
      enum: ["herb", "user"],
      required: false,
    },
    targetId: {
      type: String,
      default: "",
    },
    targetName: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ createdAt: -1 });

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
