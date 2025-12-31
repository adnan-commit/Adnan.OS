import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Dsa from "@/models/Dsa";
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

    const oldDsa = await Dsa.findById(id);
    if (oldDsa && body.imageUrl && body.imageUrl !== oldDsa.imageUrl) {
      await deleteFromCloudinary(oldDsa.imageUrl);
    }

    const updatedDsa = await Dsa.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedDsa);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { message: "Error updating DSA", error: message },
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

    const dsaToDelete = await Dsa.findById(id);
    if (dsaToDelete?.imageUrl) {
      await deleteFromCloudinary(dsaToDelete.imageUrl);
    }

    await Dsa.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error deleting DSA", error: message },
    { status: 500 }
  );
}
}
