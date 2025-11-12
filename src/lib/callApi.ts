import { JsonObject, JsonArray } from "@prisma/client/runtime/library";
import axios, { AxiosRequestHeaders } from "axios";

export default async function callApi(
  url: string,
  method: string,
  requestBody: string | number | true | JsonObject | JsonArray,
  headers: AxiosRequestHeaders
) {
  const requestDetails = {
    url,
    method: method.toUpperCase(),
    headers,
    body: requestBody,
  };

  try {
    // Validate URL before making any request
    new URL(url); // throws if invalid

    const config = {
      headers,
      validateStatus: () => true, // allow non-2xx responses
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
        // Unsupported HTTP method
        return {
          response: {
            status: 400,
            data: { error: `Unsupported HTTP method: ${method}` },
          },
          requestDetails,
        };
    }

    // ✅ Always return same structure
    return { response, requestDetails };

  } catch (error: any) {
    console.error("Error in callApi:", error.message);

    // Build safe fallback response (same shape as AxiosResponse)
    const response = {
      status: 0, // 0 indicates request never reached the server
      data: {
        error: "API call failed",
        message: error.message || "Unknown error",
      },
    };

    return { response, requestDetails };
  }
}
