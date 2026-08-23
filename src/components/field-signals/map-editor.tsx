"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useFieldSignals } from "@/components/field-signals/provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ZoneCoordinate } from "@/types/field-signals";

const starterColors = ["#D36B43", "#6E8B3D", "#3C7A89", "#B56576", "#8B5E3C"];

export function MapEditor() {
  const { state, addZone } = useFieldSignals();
  const [draftStart, setDraftStart] = useState<{ x: number; y: number } | null>(null);
  const [draftRect, setDraftRect] = useState<ZoneCoordinate | null>(null);
  const [zoneName, setZoneName] = useState("");
  const [cropType, setCropType] = useState("");
  const [acreage, setAcreage] = useState("");
  const [notes, setNotes] = useState("");
  const [color, setColor] = useState(starterColors[0]);

  const asset = state.farm?.mapFile;
  const isPdf = asset?.type === "application/pdf";

  const normalizedRect = useMemo(() => {
    if (!draftRect || draftRect.kind !== "rectangle") return null;
    return draftRect;
  }, [draftRect]);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    if (!draftStart) {
      setDraftStart({ x, y });
      setDraftRect(null);
      return;
    }

    const rect = {
      kind: "rectangle" as const,
      x: Math.min(draftStart.x, x),
      y: Math.min(draftStart.y, y),
      width: Math.abs(x - draftStart.x),
      height: Math.abs(y - draftStart.y),
    };
    setDraftRect(rect);
    setDraftStart(null);
  };

  const handleSaveZone = () => {
    if (!normalizedRect || !zoneName.trim()) return;
    addZone({
      name: zoneName.trim(),
      cropType: cropType.trim() || undefined,
      acreage: acreage ? Number(acreage) : undefined,
      color,
      notes: notes.trim() || undefined,
      coordinates: normalizedRect,
    });
    setZoneName("");
    setCropType("");
    setAcreage("");
    setNotes("");
    setDraftRect(null);
    setColor(starterColors[(starterColors.indexOf(color) + 1) % starterColors.length]);
  };

  if (!asset) {
    return (
      <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>Upload a farm map first</CardTitle>
          <CardDescription>Add an image or PDF in onboarding before placing zones on top of it.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>Zone overlay editor</CardTitle>
          <CardDescription>
            Click once to mark a zone corner and click again to finish a rectangular zone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-stone-200 bg-stone-100"
            onClick={handleMapClick}
          >
            {isPdf ? (
              <iframe src={asset.dataUrl} title={asset.name} className="h-full w-full" />
            ) : (
              <Image src={asset.dataUrl} alt={asset.name} fill className="object-cover" unoptimized />
            )}

            {state.zones.map((zone) =>
              zone.coordinates.kind === "rectangle" ? (
                <button
                  key={zone.id}
                  type="button"
                  className="absolute rounded-2xl border-2 p-2 text-left text-xs font-semibold text-white shadow-md"
                  style={{
                    left: `${zone.coordinates.x}%`,
                    top: `${zone.coordinates.y}%`,
                    width: `${zone.coordinates.width}%`,
                    height: `${zone.coordinates.height}%`,
                    backgroundColor: `${zone.color}66`,
                    borderColor: zone.color,
                  }}
                >
                  <span className="rounded-full bg-black/40 px-2 py-1">{zone.name}</span>
                </button>
              ) : null,
            )}

            {normalizedRect ? (
              <div
                className="absolute rounded-2xl border-2 border-dashed border-[#2F5D50] bg-[#2F5D50]/15"
                style={{
                  left: `${normalizedRect.x}%`,
                  top: `${normalizedRect.y}%`,
                  width: `${normalizedRect.width}%`,
                  height: `${normalizedRect.height}%`,
                }}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>New zone</CardTitle>
          <CardDescription>Name the highlighted area and capture farm context for later notes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Zone name</label>
            <Input value={zoneName} onChange={(event) => setZoneName(event.target.value)} placeholder="North Field" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Crop</label>
              <Input value={cropType} onChange={(event) => setCropType(event.target.value)} placeholder="Tomatoes" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Acreage</label>
              <Input value={acreage} onChange={(event) => setAcreage(event.target.value)} placeholder="4.2" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Notes</label>
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Pressure point, access notes, irrigation details..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Color</label>
            <div className="flex gap-2">
              {starterColors.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setColor(tone)}
                  className="h-9 w-9 rounded-full border-2"
                  style={{ backgroundColor: tone, borderColor: color === tone ? "#1c1917" : "transparent" }}
                />
              ))}
            </div>
          </div>
          <Button
            className="w-full rounded-2xl bg-[#2F5D50] text-white hover:bg-[#264B41]"
            onClick={handleSaveZone}
            disabled={!normalizedRect || !zoneName.trim()}
          >
            Save zone
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
