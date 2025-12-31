import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema, model, models } = pkg;

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Frontend", "Backend", "Database", "Language", "Tool", "Other"],
    },
    badge: { type: String, required: true },
    experience: { type: String, required: true },
  },
  { timestamps: true }
);

const Skill = models.Skill || model("Skill", SkillSchema);

export default Skill;
