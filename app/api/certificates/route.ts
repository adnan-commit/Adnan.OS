import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Certificate from "@/models/Certificate";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    // Sort by issueDate descending (newest first)
    const certificates = await Certificate.find().sort({ issueDate: -1 });
    return NextResponse.json(certificates);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching certificates", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await connectToDatabase();

    const newCertificate = await Certificate.create(body);
    return NextResponse.json(newCertificate, { status: 201 });
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error creating certificate", error: message },
    { status: 500 }
  );
}
}
