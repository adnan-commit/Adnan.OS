import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Resume from "@/models/Resume";
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

    // If setting to active, deactivate others first
    if (body.isActive) {
      await Resume.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    const oldResume = await Resume.findById(id);
    if (oldResume && body.fileUrl && body.fileUrl !== oldResume.fileUrl) {
      await deleteFromCloudinary(oldResume.fileUrl);
    }

    const updatedResume = await Resume.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(updatedResume);
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error updating Resume", error: message },
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

    const resumeToDelete = await Resume.findById(id);
    if (resumeToDelete?.fileUrl) {
      await deleteFromCloudinary(resumeToDelete.fileUrl);
    }

    await Resume.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error deleting resume", error: message },
    { status: 500 }
  );
}
}
