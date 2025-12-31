import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ProfileImage from "@/models/ProfileImage";
import { verifyAuth } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: Request, { params }: Props) {
  try {
    const auth = await verifyAuth();
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();

    // Check if image changed to delete old one
    const oldPhoto = await ProfileImage.findById(id);
    if (oldPhoto && body.imageUrl && body.imageUrl !== oldPhoto.imageUrl) {
      await deleteFromCloudinary(oldPhoto.imageUrl);
    }

    const updatedPhoto = await ProfileImage.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(updatedPhoto);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating photo", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const auth = await verifyAuth();
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();

    const photoToDelete = await ProfileImage.findById(id);
    if (photoToDelete?.imageUrl) {
      await deleteFromCloudinary(photoToDelete.imageUrl);
    }

    await ProfileImage.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting photo", error },
      { status: 500 }
    );
  }
}
