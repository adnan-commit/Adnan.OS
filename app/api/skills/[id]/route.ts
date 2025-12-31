import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Skill from "@/models/Skill";
import { verifyAuth } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

type Props = {
  params: Promise<{ id: string }>;
};

// PUT: Update Skill
export async function PUT(req: Request, { params }: Props) {
  try {
    const auth = await verifyAuth();
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();

    // 1. Check if image changed
    const oldSkill = await Skill.findById(id);
    if (oldSkill && body.badge && body.badge !== oldSkill.badge) {
      await deleteFromCloudinary(oldSkill.badge);
    }

    const updatedSkill = await Skill.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedSkill);
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error updating Skill", error: message },
    { status: 500 }
  );
}
}

// DELETE: Remove Skill
export async function DELETE(req: Request, { params }: Props) {
  try {
    const auth = await verifyAuth();
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();

    const skillToDelete = await Skill.findById(id);
    if (skillToDelete?.badge) {
      await deleteFromCloudinary(skillToDelete.badge);
    }

    await Skill.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error deleting Skill", error: message },
    { status: 500 }
  );
}
}
