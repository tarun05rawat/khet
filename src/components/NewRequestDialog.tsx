// components/NewRequestDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function NewRequestDialog({
  onSubmit,
}: {
  onSubmit: (type: string, note: string) => void;
}) {
  const [serviceType, setServiceType] = useState("Toiletries");
  const [note, setNote] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#8bbd45] text-white hover:bg-[#7aa93e]">
          + New Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Request</DialogTitle>
          <DialogDescription>Services: New Request Form</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Select a Service
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="Toiletries">Toiletries</option>
              <option value="Shower">Shower</option>
              <option value="Meal">Meal</option>
              <option value="Laundry">Laundry</option>
              <option value="MNGMT">MNGMT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Add a Note (Optional)
            </label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., toothbrush, tampons, deodorant"
            />
          </div>

          <Button
            className="mt-2 bg-[#8bbd45] hover:bg-[#7aa93e]"
            onClick={() => onSubmit(serviceType, note)}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
