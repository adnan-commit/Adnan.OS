import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema, model, models } = pkg;

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Blog = models.Blog || model("Blog", BlogSchema);

export default Blog;
