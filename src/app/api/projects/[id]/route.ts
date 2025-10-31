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

  if (!project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  return NextResponse.json(project);
}
