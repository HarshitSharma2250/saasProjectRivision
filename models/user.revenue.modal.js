const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    source: { type: String, default: "manual" },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "success",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

revenueSchema.index({ createdAt: 1 });
revenueSchema.index({ userId: 1 });

module.exports = mongoose.model("Revenue", revenueSchema);
