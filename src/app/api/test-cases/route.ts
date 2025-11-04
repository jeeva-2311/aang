import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const testcases = await prisma.testCase.findMany({
      include: {
        api: {
          select: {
            id: true,
            name: true,
            url: true,
            method: true,
          },
        },
      },
    });

    return NextResponse.json({ testcases });
  } catch (error) {
    console.error("GET /api/testcases error:", error);
    return NextResponse.json(
      { error: "Failed to fetch test cases" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      name,
      apiId,
      requestBody,
      headers,
      expectedStatus,
      expectedBody,
    } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!apiId) {
      return NextResponse.json({ error: "apiId is required" }, { status: 400 });
    }

    const newTestCase = await prisma.testCase.create({
      data: {
        name: name.trim(),
        api: { connect: { id: apiId } },
        requestBody,
        headers,
        expectedStatus,
        expectedBody,
      },
    });

    return NextResponse.json(newTestCase, { status: 201 });
  } catch (error) {
    console.error("POST /api/testcases error:", error);
    return NextResponse.json(
      { error: "Failed to create test case" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const {
      id,
      name,
      requestBody,
      headers,
      expectedStatus,
      expectedBody,
      result,
      lastRunAt,
    } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Test case ID is required" }, { status: 400 });
    }

    const updated = await prisma.testCase.update({
      where: { id },
      data: {
        name: name?.trim(),
        requestBody,
        headers,
        expectedStatus,
        expectedBody,
        result,
        lastRunAt,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/testcases error:", error);
    return NextResponse.json(
      { error: "Failed to update test case" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Test case ID is required" }, { status: 400 });
    }

    await prisma.testCase.delete({ where: { id } });

    return NextResponse.json({ message: "Test case deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/testcases error:", error);
    return NextResponse.json(
      { error: "Failed to delete test case" },
      { status: 500 }
    );
  }
}
