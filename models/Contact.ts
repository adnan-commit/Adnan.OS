import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema, model, models } = pkg;

const ContactSchema = new Schema(
  {
    platform: { type: String, required: true },
    value: { type: String, required: true },
    link: { type: String, required: true },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Contact = models.Contact || model("Contact", ContactSchema);

export default Contact;
