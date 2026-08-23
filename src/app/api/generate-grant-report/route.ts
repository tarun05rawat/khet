// app/api/generate-grant-report/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { generateGrantReport } from "@/lib/generate_grant_report";

export async function POST() {
  try {
    // Generate the report — will return the full path
    const pdfPath = await generateGrantReport();

    // Read the generated PDF from /tmp/
    const pdfData = await fs.readFile(pdfPath);

    // Stream it back with PDF headers
    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="FourthAndHope_Q1-2025.pdf"',
      },
    });
  } catch (error) {
    console.error("API error generating report:", error);
    return new NextResponse(
      JSON.stringify({ error: "Report generation failed." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
