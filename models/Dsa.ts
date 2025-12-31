import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema, model, models } = pkg;

const DsaSchema = new Schema(
  {
    platform: { type: String, required: true },
    rating: { type: String },
    problemsSolved: { type: Number, required: true },
    profileLink: { type: String, required: true },
    badge: { type: String },
  },
  { timestamps: true }
);

const Dsa = models.Dsa || model("Dsa", DsaSchema);

export default Dsa;
