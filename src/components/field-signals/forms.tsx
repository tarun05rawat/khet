"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFieldSignals } from "@/components/field-signals/provider";
import { EmptyState, SetupPrompt, TaskPriorityBadge } from "@/components/field-signals/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AssetRecord, ObservationCategory, Severity, TaskPriority } from "@/types/field-signals";

const onboardingSchema = z.object({
  name: z.string().min(2, "Farm name is required."),
  location: z.string().min(2, "Location is required."),
  farmType: z.string().optional(),
  notes: z.string().optional(),
});

const observationSchema = z.object({
  title: z.string().min(3, "Title is required."),
  rawNote: z.string().min(10, "Add a more descriptive field note."),
  zoneId: z.string().min(1, "Choose a zone."),
  category: z.enum([
    "irrigation",
    "pest",
    "fertilizer",
    "weed pressure",
    "harvest",
    "labor",
    "equipment",
    "weather",
    "general",
  ]),
  severity: z.enum(["low", "medium", "high"]),
  observedAt: z.string().min(1, "Observation date is required."),
  status: z.enum(["open", "monitoring", "resolved"]),
});

const activitySchema = z.object({
  zoneId: z.string().min(1, "Choose a zone."),
  activityType: z.string().min(3, "Activity type is required."),
  notes: z.string().min(8, "Add a useful work note."),
  quantity: z.string().optional(),
  units: z.string().optional(),
  estimatedCost: z.string().optional(),
  laborHours: z.string().optional(),
  performedAt: z.string().min(1, "Work date is required."),
});

const taskSchema = z.object({
  title: z.string().min(3, "Task title is required."),
  zoneId: z.string().min(1, "Choose a zone."),
  dueDate: z.string().min(1, "Due date is required."),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["todo", "in_progress", "done"]),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;
type ObservationValues = z.infer<typeof observationSchema>;
type ActivityValues = z.infer<typeof activitySchema>;
type TaskValues = z.infer<typeof taskSchema>;

async function fileToDataUrl(file: File): Promise<AssetRecord> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return {
    name: file.name,
    type: file.type,
    dataUrl,
  };
}

function FieldRow({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-700">{label}</label>
      {children}
      {error ? <p className="text-sm text-[#9C4121]">{error}</p> : null}
    </div>
  );
}

export function OnboardingForm() {
  const router = useRouter();
  const { state, saveFarm, saveMapAsset } = useFieldSignals();
  const [uploading, setUploading] = useState(false);
  const [uploadName, setUploadName] = useState(state.farm?.mapFile?.name || "");
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: state.farm?.name || "",
      location: state.farm?.location || "",
      farmType: state.farm?.farmType || "",
      notes: state.farm?.notes || "",
    },
  });

  const onSubmit = (values: OnboardingValues) => {
    saveFarm(values);
    router.push("/farm/map");
  };

  const handleMapUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const asset = await fileToDataUrl(file);
    saveMapAsset(asset);
    setUploadName(file.name);
    setUploading(false);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
      <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>Farm profile</CardTitle>
          <CardDescription>
            Capture the farm basics first so all logs, zones, and weekly reports stay scoped to one operation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldRow label="Farm name" error={form.formState.errors.name?.message}>
              <Input {...form.register("name")} placeholder="Khet Demo Farm" />
            </FieldRow>
            <FieldRow label="Location" error={form.formState.errors.location?.message}>
              <Input {...form.register("location")} placeholder="Woodland, California" />
            </FieldRow>
            <FieldRow label="Farm type">
              <Input {...form.register("farmType")} placeholder="Mixed vegetables and orchard" />
            </FieldRow>
            <FieldRow label="Notes">
              <Textarea {...form.register("notes")} placeholder="Crew rhythm, irrigation setup, access notes, or special handling." />
            </FieldRow>
            <Button type="submit" className="w-full rounded-2xl bg-[#2F5D50] text-white hover:bg-[#264B41]">
              Save farm profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>Farm map upload</CardTitle>
          <CardDescription>
            Upload a field layout image or PDF. The map becomes the anchor for zone-aware planning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
            <span className="text-base font-medium text-stone-900">Choose image or PDF</span>
            <span className="mt-2 text-sm text-stone-600">
              {uploadName ? `Uploaded: ${uploadName}` : "PNG, JPG, or PDF works well for this MVP."}
            </span>
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(event) => void handleMapUpload(event)} />
          </label>
          <div className="rounded-[28px] bg-[#F4EFE1] p-4 text-sm leading-6 text-stone-600">
            {uploading
              ? "Processing map file..."
              : "Map uploads are stored in the browser for this MVP so you can immediately draw zones and continue planning."}
          </div>
          {state.farm?.mapFile ? (
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-2xl border-stone-200"
              onClick={() => router.push("/farm/map")}
            >
              Continue to zone editor
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export function ObservationForm() {
  const router = useRouter();
  const { state, addObservation } = useFieldSignals();
  const [imageName, setImageName] = useState("");
  const [imageAsset, setImageAsset] = useState<AssetRecord | undefined>(undefined);

  const form = useForm<ObservationValues>({
    resolver: zodResolver(observationSchema),
    defaultValues: {
      title: "",
      rawNote: "",
      zoneId: state.zones[0]?.id || "",
      category: "general",
      severity: "medium",
      observedAt: "2026-08-23",
      status: "open",
    },
  });

  if (!state.farm) {
    return <SetupPrompt />;
  }

  const onSubmit = (values: ObservationValues) => {
    addObservation(
      {
        ...values,
        image: imageAsset,
      },
    );
    router.push("/dashboard");
  };

  const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageAsset(await fileToDataUrl(file));
    setImageName(file.name);
  };

  return (
    <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
      <CardHeader>
        <CardTitle>Log a field observation</CardTitle>
        <CardDescription>
          Capture what was seen, where it happened, and whether it still needs follow-up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 xl:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldRow label="Title" error={form.formState.errors.title?.message}>
            <Input {...form.register("title")} placeholder="Dry row ends after heat spike" />
          </FieldRow>
          <FieldRow label="Zone" error={form.formState.errors.zoneId?.message}>
            <select {...form.register("zoneId")} className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm">
              {state.zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </FieldRow>
          <div className="xl:col-span-2">
            <FieldRow label="Raw note" error={form.formState.errors.rawNote?.message}>
              <Textarea {...form.register("rawNote")} placeholder="What happened in the field, what changed, and what still needs attention?" className="min-h-32" />
            </FieldRow>
          </div>
          <FieldRow label="Category">
            <select {...form.register("category")} className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm">
              {[
                "irrigation",
                "pest",
                "fertilizer",
                "weed pressure",
                "harvest",
                "labor",
                "equipment",
                "weather",
                "general",
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FieldRow>
          <FieldRow label="Severity">
            <select {...form.register("severity")} className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm">
              {["low", "medium", "high"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FieldRow>
          <FieldRow label="Observed on">
            <Input type="date" {...form.register("observedAt")} />
          </FieldRow>
          <FieldRow label="Status">
            <select {...form.register("status")} className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm">
              {["open", "monitoring", "resolved"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FieldRow>
          <div className="xl:col-span-2 space-y-2">
            <label className="text-sm font-medium text-stone-700">Optional image</label>
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
              <span className="text-sm text-stone-600">{imageName || "Attach an observation photo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(event) => void handleImage(event)} />
              <span className="rounded-full bg-white px-3 py-1 text-sm font-medium">Choose file</span>
            </label>
          </div>
          <div className="xl:col-span-2 flex justify-end">
            <Button type="submit" className="rounded-2xl bg-[#2F5D50] text-white hover:bg-[#264B41]">
              Save observation
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function ActivityForm() {
  const router = useRouter();
  const { state, addActivity } = useFieldSignals();
  const form = useForm<ActivityValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      zoneId: state.zones[0]?.id || "",
      activityType: "",
      notes: "",
      quantity: "",
      units: "",
      estimatedCost: "",
      laborHours: "",
      performedAt: "2026-08-23",
    },
  });

  if (!state.farm) {
    return <SetupPrompt />;
  }

  const onSubmit = (values: ActivityValues) => {
    addActivity({
      zoneId: values.zoneId,
      activityType: values.activityType,
      notes: values.notes,
      quantity: values.quantity ? Number(values.quantity) : undefined,
      units: values.units || undefined,
      estimatedCost: values.estimatedCost ? Number(values.estimatedCost) : undefined,
      laborHours: values.laborHours ? Number(values.laborHours) : undefined,
      performedAt: values.performedAt,
    });
    router.push("/dashboard");
  };

  return (
    <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
      <CardHeader>
        <CardTitle>Log completed work</CardTitle>
        <CardDescription>Record what happened in the field so the weekly plan can separate open issues from finished work.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 xl:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldRow label="Zone" error={form.formState.errors.zoneId?.message}>
            <select {...form.register("zoneId")} className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm">
              {state.zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </FieldRow>
          <FieldRow label="Activity type" error={form.formState.errors.activityType?.message}>
            <Input {...form.register("activityType")} placeholder="Irrigation adjusted" />
          </FieldRow>
          <div className="xl:col-span-2">
            <FieldRow label="Notes" error={form.formState.errors.notes?.message}>
              <Textarea {...form.register("notes")} className="min-h-32" placeholder="What was completed, by whom, and what remains if anything?" />
            </FieldRow>
          </div>
          <FieldRow label="Quantity">
            <Input {...form.register("quantity")} placeholder="8" />
          </FieldRow>
          <FieldRow label="Units">
            <Input {...form.register("units")} placeholder="bags" />
          </FieldRow>
          <FieldRow label="Estimated cost">
            <Input {...form.register("estimatedCost")} placeholder="240" />
          </FieldRow>
          <FieldRow label="Labor hours">
            <Input {...form.register("laborHours")} placeholder="3.5" />
          </FieldRow>
          <FieldRow label="Performed on">
            <Input type="date" {...form.register("performedAt")} />
          </FieldRow>
          <div className="xl:col-span-2 flex justify-end">
            <Button type="submit" className="rounded-2xl bg-[#2F5D50] text-white hover:bg-[#264B41]">
              Save activity
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function TaskCreateForm() {
  const { state, addTask } = useFieldSignals();
  const form = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      zoneId: state.zones[0]?.id || "",
      dueDate: "2026-08-25",
      priority: "medium",
      status: "todo",
    },
  });

  if (!state.farm) {
    return <SetupPrompt />;
  }

  const onSubmit = (values: TaskValues) => {
    addTask({
      ...values,
      source: "manual",
    });
    form.reset({
      title: "",
      zoneId: state.zones[0]?.id || "",
      dueDate: "2026-08-25",
      priority: "medium",
      status: "todo",
    });
  };

  return (
    <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
      <CardHeader>
        <CardTitle>Create a task</CardTitle>
        <CardDescription>Use this for work that should be tracked even without a linked observation.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 xl:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="xl:col-span-2">
            <FieldRow label="Task title" error={form.formState.errors.title?.message}>
              <Input {...form.register("title")} placeholder="Finish east-row nitrogen pass" />
            </FieldRow>
          </div>
          <FieldRow label="Zone">
            <select {...form.register("zoneId")} className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm">
              {state.zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </FieldRow>
          <FieldRow label="Due date">
            <Input type="date" {...form.register("dueDate")} />
          </FieldRow>
          <FieldRow label="Priority">
            <select {...form.register("priority")} className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm">
              {["low", "medium", "high", "urgent"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FieldRow>
          <FieldRow label="Status">
            <select {...form.register("status")} className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm">
              {["todo", "in_progress", "done"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FieldRow>
          <div className="xl:col-span-2 flex items-center justify-between gap-4">
            <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
              New tasks default to manual source and immediately feed the weekly planner.
            </div>
            <Button type="submit" className="rounded-2xl bg-[#2F5D50] text-white hover:bg-[#264B41]">
              Add task
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function AgentParsePanel() {
  const { state, parseNote, addObservation } = useFieldSignals();
  const [rawNote, setRawNote] = useState(
    "north field looked dry again after the heat wave, need to recheck drip lines Monday",
  );
  const [draft, setDraft] = useState<ReturnType<typeof parseNote> | null>(null);
  const [saving, setSaving] = useState(false);

  if (!state.farm) {
    return <SetupPrompt />;
  }

  const handleParse = () => {
    setDraft(parseNote(rawNote));
  };

  const handleApprove = () => {
    if (!draft || !draft.suggestedZoneId) return;
    setSaving(true);
    addObservation(
      {
        title: draft.observationTitle,
        rawNote,
        zoneId: draft.suggestedZoneId,
        category: draft.category,
        severity: draft.severity,
        observedAt: "2026-08-23",
        status: "open",
      },
      draft.followUpTask
        ? {
            zoneId: draft.suggestedZoneId,
            title: draft.followUpTask.title,
            dueDate: draft.followUpTask.dueDate || "2026-08-25",
            priority: draft.followUpTask.priority,
            status: "todo",
            source: "agent",
          }
        : undefined,
    );
    setSaving(false);
    setDraft(null);
    setRawNote("");
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
      <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>Agent note parser</CardTitle>
          <CardDescription>
            Paste rough field notes and review the structured draft before anything gets saved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={rawNote} onChange={(event) => setRawNote(event.target.value)} className="min-h-52" />
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-2xl bg-[#2F5D50] text-white hover:bg-[#264B41]" onClick={handleParse}>
              Parse note into draft
            </Button>
            <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
              Input includes current farm zones and uses structured review output, not chat-only text.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>Review draft</CardTitle>
          <CardDescription>Approve, edit mentally, or reject before this becomes an actual record.</CardDescription>
        </CardHeader>
        <CardContent>
          {!draft ? (
            <EmptyState
              title="No draft yet"
              body="Run the parser to see a zone-aware observation draft, suggested task, and confidence notes."
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-[28px] bg-stone-50 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Suggested zone</p>
                <p className="mt-2 text-lg font-semibold">{draft.suggestedZoneName || "Needs assignment"}</p>
              </div>
              <div className="rounded-[28px] bg-stone-50 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Observation title</p>
                <p className="mt-2 text-lg font-semibold">{draft.observationTitle}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-sm">{draft.category}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-sm">{draft.severity}</span>
                </div>
              </div>
              {draft.followUpTask ? (
                <div className="rounded-[28px] bg-stone-50 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Suggested follow-up task</p>
                  <p className="mt-2 text-lg font-semibold">{draft.followUpTask.title}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <TaskPriorityBadge priority={draft.followUpTask.priority} />
                    <span className="text-sm text-stone-600">{draft.followUpTask.dueDate || "No due date inferred"}</span>
                  </div>
                </div>
              ) : null}
              <div className="rounded-[28px] bg-[#F4EFE1] p-5">
                <p className="text-sm font-medium text-stone-900">Confidence note</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">{draft.confidenceNote}</p>
                {draft.missingInformation.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {draft.missingInformation.map((item) => (
                      <p key={item} className="text-sm text-[#9C4121]">
                        {item}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
              <Button
                className="w-full rounded-2xl bg-[#2F5D50] text-white hover:bg-[#264B41]"
                disabled={!draft.suggestedZoneId || saving}
                onClick={handleApprove}
              >
                {saving ? "Saving..." : "Approve draft and save"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
