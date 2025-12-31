import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Certificate from "@/models/Certificate";
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

    const oldCert = await Certificate.findById(id);
    if (oldCert && body.imageUrl && body.imageUrl !== oldCert.imageUrl) {
      await deleteFromCloudinary(oldCert.imageUrl);
    }

    const updatedCert = await Certificate.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(updatedCert);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating certificate", error },
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

    const certToDelete = await Certificate.findById(id);
    if (certToDelete?.imageUrl) {
      await deleteFromCloudinary(certToDelete.imageUrl);
    }

    await Certificate.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting certificate", error },
      { status: 500 }
    );
  }
}
