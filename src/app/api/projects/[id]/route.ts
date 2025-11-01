import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const projectId = parseInt(id);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      apis: {
        include: { testCases: true },
      },
    },
  });

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const projectId = parseInt(id, 10);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const deletedProject = await prisma.project.delete({
      where: { id: projectId },
      include: {
        apis: {
          include: {
            testCases: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Project deleted successfully", deletedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const projectId = parseInt(id, 10);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }
    const { name, baseUrl } = await request.json();

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(name && { name }),
        ...(baseUrl && { baseUrl }),
      },
      include: {
        apis: {
          include: { testCases: true },
        },
      },
    });

    return NextResponse.json(
      { message: "Project updated successfully", updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

