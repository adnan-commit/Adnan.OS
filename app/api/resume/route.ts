import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Resume from "@/models/Resume";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const resumes = await Resume.find().sort({ createdAt: -1 });
    return NextResponse.json(resumes);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { message: "Error fetching Resume", error: message },
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

    // If this new resume is set to Active, turn off all others
    if (body.isActive) {
      await Resume.updateMany({}, { isActive: false });
    }

    const newResume = await Resume.create(body);
    return NextResponse.json(newResume, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { message: "Error creating Resume", error: message },
      { status: 500 }
    );
  }
}
