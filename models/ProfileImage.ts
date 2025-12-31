import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema, model, models } = pkg;

const ProfileImageSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const ProfileImage =
  models.ProfileImage || model("ProfileImage", ProfileImageSchema);

export default ProfileImage;
