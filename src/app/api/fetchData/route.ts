/* eslint-disable @typescript-eslint/no-unused-vars */
import { collection, getDocs } from "firebase/firestore"; // Import collection and getDocs
import { db } from "@/firebase/config";
import { NextRequest, NextResponse } from "next/server";
import { DataTable as DataTableType } from "@/types/types";

// /api/fetchData/route.ts
export async function GET() {
  try {
    const snap = await getDocs(collection(db, "DataTable"));

    const payload = snap.docs.map((doc) => ({
      id: doc.id, // ← add this
      // uuid: doc.id,     // optional: keep legacy key
      ...doc.data(),
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    console.error("Error fetching data:", err);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
