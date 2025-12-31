import mongoose from "mongoose";
import pkg from "mongoose";
const { Schema, model, models } = pkg;

const CertificateSchema = new Schema(
  {
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    issueDate: { type: String, required: true },
    certificateLink: { type: String },
    imageUrl: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Certificate =
  models.Certificate || model("Certificate", CertificateSchema);

export default Certificate;
