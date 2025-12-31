import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Project from "@/models/Project";
import { verifyAuth } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: Request, { params }: Props) {
  try {
    const auth = await verifyAuth();
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    await connectToDatabase();

    const oldProject = await Project.findById(id);
    if (!oldProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (body.imageUrl && body.imageUrl !== oldProject.imageUrl) {
      await deleteFromCloudinary(oldProject.imageUrl);
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );

    return NextResponse.json({
      message: "Project updated",
      project: updatedProject,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const auth = await verifyAuth();
    if (!auth)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await connectToDatabase();

    const projectToDelete = await Project.findById(id);

    if (!projectToDelete) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (projectToDelete.imageUrl) {
      await deleteFromCloudinary(projectToDelete.imageUrl);
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting project" },
      { status: 500 }
    );
  }
}
