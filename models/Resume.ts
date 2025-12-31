import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema, model, models } = pkg;

const ResumeSchema = new Schema(
  {
    name: { type: String, required: true },
    fileUrl: { type: String, required: true },
    driveLink: { type: String },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Resume = models.Resume || model("Resume", ResumeSchema);

export default Resume;
