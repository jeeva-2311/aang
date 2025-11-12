import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data } = body || {};

    if (!data) {
      return NextResponse.json(
        { status: "error", message: "No data provided" },
        { status: 400 }
      );
    }

    // --- API metadata header rows ---
    const headerRows = [
      ["API Name:", data.name || ""],
      ["URL:", data.url || ""],
      ["Method:", data.method || ""],
      [], // Blank row before test case table
    ];

    // --- Table header row ---
    const tableHeader = [
      "TestCase Name",
      "Request",
      "Expected Status",
      "Expected Body",
      "Actual Status",
      "Actual Body",
      "Status",
      "Last Run At",
    ];

    // --- Table content rows ---
    const tableRows =
      data.testCases?.map((t: any) => {
        const result = t.result || {};
        return [
          t.name || "",
          JSON.stringify(result.request) || "",
          t.expectedStatus ?? "",
          JSON.stringify(t.expectedBody) || "",
          result.actualStatus ?? "",
          JSON.stringify(result.actualBody) || "",
          result.status || "",
          t.lastRunAt || "",
        ];
      }) || [];

    // --- Combine all rows ---
    const sheetData = [...headerRows, tableHeader, ...tableRows];

    // --- Build the worksheet and workbook ---
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "API Test Cases");

    // --- Convert to Excel buffer ---
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    // --- Return downloadable response ---
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="api_export_${data.id}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Failed while exporting:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Something went wrong during export",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
