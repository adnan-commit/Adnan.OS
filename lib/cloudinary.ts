import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteFromCloudinary = async (imageUrl: string) => {
  try {
    const parts = imageUrl.split("/");
    const filename = parts[parts.length - 1];
    const folder = parts[parts.length - 2];

    const publicIdWithExtension = `${folder}/${filename}`;
    const publicId = publicIdWithExtension.split(".")[0];

    const regex = /\/v\d+\/([^/]+)\.[^.]+$/;
    const match = imageUrl.match(regex);

    const splitted = imageUrl.split("portfolio-projects/");
    if (splitted.length < 2) return;

    const idPart = splitted[1].split(".")[0];
    const finalPublicId = `portfolio-projects/${idPart}`;

    await cloudinary.uploader.destroy(finalPublicId);
    console.log(` Deleted image from Cloudinary: ${finalPublicId}`);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};
