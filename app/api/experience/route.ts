import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Experience from "@/models/Experience";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    // Sort by creation desc (newest added first)
    const experiences = await Experience.find().sort({ createdAt: -1 });
    return NextResponse.json(experiences);
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error fetching Experience", error: message },
    { status: 500 }
  );
}
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectToDatabase();

    const newExperience = await Experience.create(body);
    return NextResponse.json(newExperience, { status: 201 });
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error adding Experience", error: message },
    { status: 500 }
  );
}
}