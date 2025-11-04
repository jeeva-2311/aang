// /app/api/runner/route.ts
import prisma from "@/lib/prisma";
import { JsonObject, JsonArray } from "@prisma/client/runtime/library";
import axios, { AxiosRequestHeaders } from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    const testCase = await prisma.testCase.findUnique({
      where: { id },
      include: {
        api: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!testCase) {
      return new Response(JSON.stringify({ error: "Test case not found" }), { status: 404 });
    }

    const baseUrl = testCase.api.project.baseUrl;
    const apiUrl = testCase.api.url;
    const url = (testCase.url && typeof testCase.url === "string") ? testCase.url : `${baseUrl.replace(/\/$/, "")}/${apiUrl.replace(/^\//, "")}`;
    const method = testCase.api.method.toLowerCase();

    const requestBody = typeof testCase.requestBody === "object" && testCase.requestBody !== null ? (testCase.requestBody as Record<string, any>) : {};

    const headers = typeof testCase.headers === "object" && testCase.headers !== null ? (testCase.headers as Record<string, string>) : {};

    const { response, requestDetails } = await callApi(url, method, requestBody, headers as AxiosRequestHeaders);

    const passed = response.status === testCase.expectedStatus && JSON.stringify(response.data) === JSON.stringify(testCase.expectedBody);

    const updated = await prisma.testCase.update({
      where: { id },
      data: {
        lastRunAt: new Date(),
        result: passed ? "passed" : "failed",
      },
    });

    return new Response(
      JSON.stringify({
        status: passed ? "passed" : "failed",
        expectedStatus: testCase.expectedStatus,
        expectedBody: testCase.expectedBody,
        actualStatus: response.status,
        actualBody: response.data,
        request: requestDetails,
        testCase: updated,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to run testcase:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}


async function callApi(url: string, method: string, requestBody: string | number | true | JsonObject | JsonArray, headers: AxiosRequestHeaders) {
  try {

    const config = {
      headers,
      validateStatus: () => true,
    };

    const requestDetails = {
      url,
      method: method.toUpperCase(),
      headers,
      body: requestBody,
    };

    let response;

    switch (method.toLowerCase()) {
      case "get":
        response = await axios.get(url, config);
        break;
      case "post":
        response = await axios.post(url, requestBody, config);
        break;
      case "put":
        response = await axios.put(url, requestBody, config);
        break;
      case "delete":
        response = await axios.delete(url, config);
        break;
      case "patch":
        response = await axios.patch(url, requestBody, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return { response, requestDetails };
  } catch (error: any) {
    console.error("Error in callApi:", error.message);
    throw new Error(`API call failed: ${error.message}`);
  }
}
