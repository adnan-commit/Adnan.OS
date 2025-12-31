import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema, model, models } = pkg;
const EducationSchema = new Schema(
  {
    degree: { type: String, required: true },
    school: { type: String, required: true },
    year: { type: String, required: true },
    grade: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const Education = models.Education || model("Education", EducationSchema);

export default Education;
