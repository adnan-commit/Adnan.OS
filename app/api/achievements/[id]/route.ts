import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Achievement from "@/models/Achievement";
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

    const oldAchievement = await Achievement.findById(id);
    if (
      oldAchievement &&
      body.imageUrl &&
      body.imageUrl !== oldAchievement.imageUrl
    ) {
      await deleteFromCloudinary(oldAchievement.imageUrl);
    }

    const updateAchievement = await Achievement.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(updateAchievement);
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error updating achievement", error: message },
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

    const achievementToDelete = await Achievement.findById(id);
    if (achievementToDelete?.imageUrl) {
      await deleteFromCloudinary(achievementToDelete.imageUrl);
    }

    await Achievement.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error deleting achievement", error: message },
    { status: 500 }
  );
}
}
