import mongoose from "mongoose";
import pkg from "mongoose";
const {Schema, model, models} = pkg;

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  repoLink: { type: String },
  liveLink: { type: String },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

const Project = models.Project || model("Project", ProjectSchema);

export default Project;