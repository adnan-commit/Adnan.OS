import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Achievement from "@/models/Achievement";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  await connectToDatabase();
  const achievements = await Achievement.find().sort({ createdAt: -1 });
  return NextResponse.json(achievements);
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectToDatabase();

    const newAchievement = await Achievement.create(body);
    return NextResponse.json(newAchievement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
