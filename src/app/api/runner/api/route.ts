import { prisma } from "@/lib/prisma";
import callApi from "@/lib/callApi";
import type { AxiosRequestHeaders } from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiId } = body;

    const api = await prisma.apiEndpoint.findUnique({
      where: { id: apiId },
      include: {
        project: true,
        testCases: true,
      },
    });

    if (!api) {
      return new Response(JSON.stringify({ error: "API not found" }), { status: 404 });
    }

    if (!api.testCases.length) {
      return new Response(JSON.stringify({ message: "No test cases found for this API" }), { status: 200 });
    }

    const baseUrl = api.project.baseUrl;
    const apiUrl = api.url;
    const method = api.method.toLowerCase();

    const results = [];

    for (const testCase of api.testCases) {
      try {
        const url = testCase.url && typeof testCase.url === "string" ? testCase.url : `${baseUrl.replace(/\/$/, "")}/${apiUrl.replace(/^\//, "")}`;
        const requestBody = typeof testCase.requestBody === "object" && testCase.requestBody !== null ? (testCase.requestBody as Record<string, any>) : {};
        const headers = typeof testCase.headers === "object" && testCase.headers !== null ? (testCase.headers as Record<string, string>) : {};

        const { response, requestDetails } = await callApi(url, method, requestBody, headers as AxiosRequestHeaders);

        const passed = response.status === testCase.expectedStatus && JSON.stringify(response.data) === JSON.stringify(testCase.expectedBody);

        const updated = await prisma.testCase.update({
          where: { id: testCase.id },
          data: {
            lastRunAt: new Date(),
            result: passed ? "passed" : "failed",
          },
        });

        results.push({
          id: testCase.id,
          name: testCase.name,
          status: passed ? "passed" : "failed",
          expectedStatus: testCase.expectedStatus,
          expectedBody: testCase.expectedBody,
          actualStatus: response.status,
          actualBody: response.data,
          request: requestDetails,
          testCase: updated,
        });
      } catch (err) {
        console.error(`Test case ${testCase.id} failed:`, err);
        results.push({
          id: testCase.id,
          name: testCase.name,
          status: "error",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return new Response(JSON.stringify({ apiId, apiUrl, results }), { status: 200 });
  } catch (error) {
    console.error("Failed to run API testcases:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
