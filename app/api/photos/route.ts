import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ProfileImage from "@/models/ProfileImage";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  await connectToDatabase();
  const photos = await ProfileImage.find().sort({ createdAt: -1 });
  return NextResponse.json(photos);
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectToDatabase();

    // Check if name already exists (we want unique names for easy fetching)
    const existing = await ProfileImage.findOne({ name: body.name });
    if (existing) {
      return NextResponse.json(
        {
          message:
            "Image with this name already exists. Please delete or update it.",
        },
        { status: 400 }
      );
    }

    const newPhoto = await ProfileImage.create(body);
    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating photo", error },
      { status: 500 }
    );
  }
}
