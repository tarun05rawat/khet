// src/app/api/putQueue/route.ts

import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

// ▲ Named export — Next will wire this up to PUT /api/putQueue
export async function PUT(req: NextRequest) {
  try {
    const { type, name, uuid, createdAt } = await req.json();

    // write a document under collection "BaseQueue" and doc ID = `type`
    const docRef = doc(db, "BaseQueue", type);
    await setDoc(docRef, { name, uuid, createdAt });

    return NextResponse.json(
      { message: "Queue updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating queue:", error);
    return NextResponse.json(
      { error: "Failed to update queue" },
      { status: 500 }
    );
  }
}
