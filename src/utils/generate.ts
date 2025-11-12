export default function generateTestCases(url: string, method: string) {
  if (!url) return []

  const testCases: any[] = []

  // ✅ Valid case
  testCases.push({
    name: "Should return success for valid URL",
    method,
    url,
    requestBody: method === "POST" ? { sample: "data" } : undefined,
    expectedStatus: 200,
    expectedBody: { success: true },
  })

  // ❌ Invalid case
  const gibberishUrl = `${url}/xyz-invalid-${Math.random().toString(36).slice(2, 6)}`
  testCases.push({
    name: "Should fail for invalid or malformed URL",
    method,
    url: gibberishUrl,
    requestBody: method === "POST" ? { sample: "data" } : undefined,
    expectedStatus: 404,
    expectedBody: { error: "Not Found" },
  })

  return testCases
}