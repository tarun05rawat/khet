"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AGEGROUP } from "@/types/enums";
import { SERVICES } from "@/types/enums";
import { handleAddProfile } from "@/lib/endpoint";

const genderOptions = [
  "Male",
  "Female",
  "Non-binary",
  "Other",
  "Prefer not to say",
];
const ethnicityOptions = [
  "Caucasian",
  "Hispanic",
  "Asian",
  "African American",
  "Native American",
  "Pacific Islander",
  "Other",
];

interface AddClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // Add onSuccess callback prop
}

export default function AddClientForm({
  open,
  onOpenChange,
  onSuccess,
}: AddClientFormProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [ageGroup, setAgeGroup] = useState<AGEGROUP | "">("");
  const [selectedBenefits, setSelectedBenefits] = useState<SERVICES[]>([]);
  const [isSubmittable, setIsSubmittable] = useState(false);

  useEffect(() => {
    setIsSubmittable(
      !!name &&
        !!gender &&
        !!ethnicity &&
        !!ageGroup &&
        selectedBenefits.length > 0
    );
  }, [name, gender, ethnicity, ageGroup, selectedBenefits]);

  const resetForm = () => {
    setName("");
    setGender("");
    setEthnicity("");
    setAgeGroup("");
    setSelectedBenefits([]);
    setIsSubmittable(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isSubmittable) return;

    console.log("Submitting:", {
      name,
      gender,
      ethnicity,
      ageGroup,
      selectedBenefits,
    });
    const benefitsPayload = selectedBenefits.map((service) => ({
      name: service,
      value: 1,
    }));

    try {
      const result = await handleAddProfile(
        name,
        ethnicity,
        gender,
        ageGroup,
        benefitsPayload
      );

      if (result.success) {
        console.log("Profile added successfully:", result.data);
        resetForm();
        onOpenChange(false);
        onSuccess?.(); // Call the onSuccess callback if provided
      } else {
        console.error("Failed to add profile:", result.error);
        // TODO: Show error to user
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // TODO: Show error to user
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new client profile. All fields
            are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Gender
              </Label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ethnicity" className="text-right">
                Ethnicity
              </Label>
              <Select value={ethnicity} onValueChange={setEthnicity} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  {ethnicityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ageGroup" className="text-right">
                Age Group
              </Label>
              <Select
                value={ageGroup}
                onValueChange={(value) => setAgeGroup(value as AGEGROUP)}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AGEGROUP).map((group) => (
                    <SelectItem key={group} value={group}>
                      {group.charAt(0).toUpperCase() + group.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Benefits</Label>
              <div className="col-span-3 space-y-2">
                {Object.values(SERVICES).map((service) => (
                  <div key={service} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`benefit-${service}`}
                      value={service}
                      checked={selectedBenefits.includes(service)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedBenefits((prev) =>
                          checked
                            ? [...prev, service]
                            : prev.filter((s) => s !== service)
                        );
                      }}
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor={`benefit-${service}`}
                      className="font-normal"
                    >
                      {service}
                    </Label>
                  </div>
                ))}
                {selectedBenefits.length === 0 && (
                  <p className="text-xs text-destructive">
                    At least one benefit must be selected.
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="bg-[#07A950] hover:bg-[#057a3a]"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!isSubmittable}>
              Add Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
