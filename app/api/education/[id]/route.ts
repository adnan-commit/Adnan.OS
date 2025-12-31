import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Education from "@/models/Education";
import { verifyAuth } from "@/lib/auth";

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

    const updatedEducation = await Education.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(updatedEducation);
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error updating Education", error: message },
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

    await Education.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error deleting Education", error: message },
    { status: 500 }
  );
}
}
