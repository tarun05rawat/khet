// File: src/app/case/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const categoryColors = {
  Housing: "bg-blue-100 text-blue-800",
  Health: "bg-green-100 text-green-800",
  Employment: "bg-purple-100 text-purple-800",
  Food: "bg-amber-100 text-amber-800",
} as const;

const statusColors = {
  Active: "bg-emerald-100 text-emerald-800",
  Pending: "bg-orange-100 text-orange-800",
  Closed: "bg-gray-100 text-gray-800",
} as const;

interface CaseData {
  clientName: string;
  caseTitle: string;
  category: keyof typeof categoryColors;
  status: keyof typeof statusColors;
  startDate: string;
  lastActivityDate: string;
  actionItems: string[];
  notes: string;
}

const mockCases: Record<string, CaseData> = {
  "1": {
    clientName: "Maria Lopez",
    caseTitle: "Emergency Shelter Placement",
    category: "Housing",
    status: "Active",
    startDate: "2025-04-01",
    lastActivityDate: "2025-04-18",
    actionItems: ["Confirm shelter availability", "Schedule intake meeting"],
    notes: "Client has requested a shelter close to downtown.",
  },
  "2": {
    clientName: "John Thompson",
    caseTitle: "Mental Health Evaluation Referral",
    category: "Health",
    status: "Pending",
    startDate: "2025-03-29",
    lastActivityDate: "2025-04-17",
    actionItems: ["Follow up with clinic", "Send paperwork"],
    notes: "Awaiting confirmation from referred clinic.",
  },
  "3": {
    clientName: "Emily Smith",
    caseTitle: "Job Readiness Coaching",
    category: "Employment",
    status: "Active",
    startDate: "2025-04-10",
    lastActivityDate: "2025-04-15",
    actionItems: ["Schedule coaching session", "Prepare resume"],
    notes: "Client is eager to start job search.",
  },
  "4": {
    clientName: "Michael Lee",
    caseTitle: "Nutrition Assistance Program",
    category: "Food",
    status: "Active",
    startDate: "2025-04-12",
    lastActivityDate: "2025-04-18",
    actionItems: ["Distribute grocery vouchers", "Follow up enrollment"],
    notes: "Client needs nutritional counseling.",
  },
  "5": {
    clientName: "John Doe",
    caseTitle: "Substance Recovery Support",
    category: "Health",
    status: "Active",
    startDate: "2025-03-25",
    lastActivityDate: "2025-04-17",
    actionItems: ["Coordinate with counselor", "Arrange support group"],
    notes: "Client reports steady progress.",
  },
  "6": {
    clientName: "Ana Garcia",
    caseTitle: "Transitional Housing Assistance",
    category: "Housing",
    status: "Pending",
    startDate: "2025-04-19",
    lastActivityDate: "2025-04-19",
    actionItems: ["Verify housing availability", "Collect ID documents"],
    notes: "Pending final approval from housing board.",
  },
};

export default function CaseDetailsPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const data = id ? mockCases[id] : undefined;

  // Client‑side state for action items & notes
  const [items, setItems] = useState(
    () => data?.actionItems.map((text) => ({ text, done: false })) ?? []
  );
  const [notes, setNotes] = useState(data?.notes ?? "");
  const [editingNotes, setEditingNotes] = useState(false);

  // If routerless render or missing id
  if (!id) {
    return <p className="p-6">No case ID provided.</p>;
  }

  if (!data) {
    return <p className="p-6">Case not found.</p>;
  }

  const toggleDone = (idx: number) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, done: !it.done } : it))
    );

  const deleteItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const addItem = () => {
    const text = prompt("New action item:");
    if (text?.trim()) {
      setItems((prev) => [...prev, { text: text.trim(), done: false }]);
    }
  };

  return (
    <main className="container mx-auto max-w-xl space-y-6 p-6 bg-green-50 rounded-lg">
      <Link href="/case" className="text-blue-600 hover:underline">
        ← Back to My Cases
      </Link>

      <section>
        <h1 className="text-2xl font-bold text-green-800">{data.clientName}</h1>
        <p className="text-gray-700">{data.caseTitle}</p>
        <div className="mt-2 flex gap-2">
          <Badge className={categoryColors[data.category]}>
            {data.category}
          </Badge>
          <Badge className={statusColors[data.status]}>{data.status}</Badge>
        </div>
      </section>

      <section className="space-y-1 text-gray-800">
        <p>
          <span className="font-semibold">Date Started:</span> {data.startDate}
        </p>
        <p>
          <span className="font-semibold">Most Recent Activity Date:</span>{" "}
          {data.lastActivityDate}
        </p>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Action Items:</p>
          <Button size="sm" onClick={addItem}>
            Add
          </Button>
        </div>
        <ul className="space-y-2">
          {items.map((it, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between rounded bg-white px-4 py-2 shadow-sm"
            >
              <span
                onClick={() => toggleDone(idx)}
                className={`flex-1 cursor-pointer ${
                  it.done ? "line-through text-gray-400" : ""
                }`}
              >
                {it.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteItem(idx)}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Notes:</p>
          <Button size="sm" onClick={() => setEditingNotes((f) => !f)}>
            {editingNotes ? "Save" : "Edit"}
          </Button>
        </div>
        {editingNotes ? (
          <textarea
            className="w-full rounded bg-white p-3 shadow-inner"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        ) : (
          <div className="rounded bg-white p-4 shadow-sm text-gray-700">
            {notes}
          </div>
        )}
      </section>

      <section>
        <p className="font-semibold">Documents:</p>
        <p className="text-gray-500">No documents attached yet.</p>
      </section>
    </main>
  );
}
