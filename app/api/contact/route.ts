import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Contact from "@/models/Contact";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  await connectToDatabase();
  const contacts = await Contact.find().sort({ createdAt: 1 });
  return NextResponse.json(contacts);
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectToDatabase();

    const newContact = await Contact.create(body);
    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating contact", error },
      { status: 500 }
    );
  }
}
