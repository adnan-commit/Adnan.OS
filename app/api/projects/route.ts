import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Project from "@/models/Project";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find().sort({ createdAt: -1 }); // Newest first
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching projects", error },
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
    const { title, description, techStack, repoLink, liveLink, imageUrl } =
      body;

    if (!title || !description || !imageUrl) {
      return NextResponse.json(
        { message: "Title, Description, and Image URL are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newProject = await Project.create({
      title,
      description,
      techStack,
      repoLink,
      liveLink,
      imageUrl,
    });

    return NextResponse.json(
      { message: "Project created successfully", project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { message: "Error creating project" },
      { status: 500 }
    );
  }
}
