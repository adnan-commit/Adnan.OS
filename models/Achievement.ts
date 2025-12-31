import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema, model, models } = pkg;

const AchievementSchema = new Schema(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    proofLink: { type: String },
  },
  { timestamps: true }
);

const Achievement =
  models.Achievement || model("Achievement", AchievementSchema);

export default Achievement;
