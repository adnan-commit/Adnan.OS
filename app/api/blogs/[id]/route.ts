import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Blog from "@/models/Blog";
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

    const oldBlog = await Blog.findById(id);
    if (!oldBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    if (body.imageUrl && body.imageUrl !== oldBlog.imageUrl) {
      await deleteFromCloudinary(oldBlog.imageUrl);
    }

    const updateBlog = await Blog.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );

    return NextResponse.json({ message: "Blog updated", Blog: updateBlog });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating Blog" },
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

    const BlogToDelete = await Blog.findById(id);

    if (!BlogToDelete) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    if (BlogToDelete.imageUrl) {
      await deleteFromCloudinary(BlogToDelete.imageUrl);
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting Blog" },
      { status: 500 }
    );
  }
}
