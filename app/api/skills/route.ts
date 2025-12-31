import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Skill from "@/models/Skill";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const skills = await Skill.find().sort({ category: 1 });
    return NextResponse.json(skills);
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error fetching Skills", error: message },
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

    const newSkill = await Skill.create(body);
    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error Creating Skill", error: message },
    { status: 500 }
  );
}
}
