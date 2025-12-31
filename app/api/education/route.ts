import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Education from "@/models/Education";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const education = await Education.find().sort({ createdAt: 1 });
    return NextResponse.json(education);
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error fetching Education", error: message },
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

    const newEducation = await Education.create(body);
    return NextResponse.json(newEducation, { status: 201 });
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error adding Education", error: message },
    { status: 500 }
  );
}
}
