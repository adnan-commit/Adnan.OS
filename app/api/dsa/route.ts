import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Dsa from "@/models/Dsa";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  await connectToDatabase();
  const stats = await Dsa.find();
  return NextResponse.json(stats);
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    await connectToDatabase();
    
    const newStat = await Dsa.create(body);
    return NextResponse.json(newStat, { status: 201 });
  } catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json(
    { message: "Error creating DSA", error: message },
    { status: 500 }
  );
}
}
