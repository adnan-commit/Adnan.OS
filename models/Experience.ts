import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema, model, models } = pkg;

const ExperienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, required: true },
    location: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const Experience = models.Experience || model("Experience", ExperienceSchema);

export default Experience;
