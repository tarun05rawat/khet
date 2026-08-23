'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SERVICES } from '@/types/enums'; // Assuming SERVICES enum is defined here

interface NewRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (serviceType: SERVICES, note: string) => void;
}

export default function NewRequestForm({ open, onOpenChange, onSubmit }: NewRequestFormProps) {
  // Default to the first service type or a specific one like Toiletries
  const defaultService = Object.values(SERVICES)[0]
  const [serviceType, setServiceType] = useState<SERVICES>(defaultService);
  const [note, setNote] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(serviceType, note);
    // Optionally reset state after submit if the dialog stays open for confirmation
    // setServiceType(defaultService);
    // setNote('');
    onOpenChange(false); // Close dialog on submit
  };

  const handleCancel = () => {
    // Reset state if needed when cancelling
    setServiceType(defaultService);
    setNote('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Service Request</DialogTitle>
          <DialogDescription>
            Select a service and add an optional note.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Service Select */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceType" className="text-right">
                Service
              </Label>
              {/* Using native select for simplicity, replace with shadcn Select if preferred */}
              <select
                id="serviceType"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as SERVICES)}
                className="col-span-3 border px-3 py-2 rounded-md h-10" // Added h-10 for consistent height
                required
              >
                {Object.values(SERVICES).map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Note Input */}
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Note
              </Label>
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="(Optional)"
                className="col-span-3"
              />
            </div> */}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            </DialogClose>
            {/* Add Tailwind classes for pastel green background and dark text */}
            <Button
              type="submit"
              className="bg-green-200 text-green-800 hover:bg-green-300"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}