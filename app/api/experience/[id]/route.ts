import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Experience from "@/models/Experience";
import { verifyAuth } from "@/lib/auth";

type Props = {
  params: Promise<{ id: string }>;
};

// PUT: Update Experience
export async function PUT(req: Request, { params }: Props) {
  try {
    const auth = await verifyAuth();
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();

    const updatedExperience = await Experience.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(updatedExperience);
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error updating Experience", error: message },
    { status: 500 }
  );
}
}

// DELETE: Remove Experience
export async function DELETE(req: Request, { params }: Props) {
  try {
    const auth = await verifyAuth();
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();

    await Experience.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error deleting experience", error: message },
    { status: 500 }
  );
}
}