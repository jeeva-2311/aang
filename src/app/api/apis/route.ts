import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const apis = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ apis });
  } catch (error) {
    console.error("GET /api/apis error:", error);
    return NextResponse.json(
      { error: "Failed to fetch apis" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, projectId, url, method, } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newApi = await prisma.apiEndpoint.create({
      data: {
        name: name.trim(),
        url,
        method,
        project: {
          connect: { id: projectId },
        },
      },
    });
    

    return NextResponse.json(newApi, { status: 201 });
  } catch (error) {
    console.error("POST /api/apis error:", error);
    return NextResponse.json(
      { error: "Failed to create api" },
      { status: 500 }
    );
  }
}
