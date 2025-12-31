import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema, model, models } = pkg;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
