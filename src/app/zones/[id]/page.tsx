"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useFieldSignals } from "@/components/field-signals/provider";
import { ProtectedShell } from "@/components/field-signals/shell";
import { EmptyState, ObservationList, TaskTable } from "@/components/field-signals/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ZoneDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, getZoneById, updateObservationStatus } = useFieldSignals();
  const zone = getZoneById(params.id);

  if (!zone) {
    return (
      <ProtectedShell
        title="Zone not found"
        description="This zone could not be found in the current farm record."
      >
        <EmptyState
          title="Missing zone"
          body="Return to the map and create or select a valid zone."
          action={
            <Button asChild className="rounded-2xl bg-[#2F5D50] text-white hover:bg-[#264B41]">
              <Link href="/farm/map">Back to map</Link>
            </Button>
          }
        />
      </ProtectedShell>
    );
  }

  const observations = state.observations.filter((item) => item.zoneId === zone.id);
  const activities = state.activities.filter((item) => item.zoneId === zone.id);
  const tasks = state.tasks.filter((item) => item.zoneId === zone.id);
  const openIssues = observations.filter((item) => item.status !== "resolved");

  return (
    <ProtectedShell
      title={zone.name}
      description="Zone-level detail for observations, completed work, open issues, and next actions tied to this part of the farm."
      actions={
        <Button asChild className="rounded-2xl bg-[#2F5D50] text-white hover:bg-[#264B41]">
          <Link href="/observations/new">Add observation</Link>
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
            <CardHeader>
              <CardTitle>Zone summary</CardTitle>
              <CardDescription>
                {zone.cropType || "Crop not set"} · {zone.acreage || "?"} acres
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[24px] bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Open issues</p>
                  <p className="mt-2 text-3xl font-semibold">{openIssues.length}</p>
                </div>
                <div className="rounded-[24px] bg-stone-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Recent tasks</p>
                  <p className="mt-2 text-3xl font-semibold">{tasks.length}</p>
                </div>
              </div>
              <div className="rounded-[24px] bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                {zone.notes || "No notes have been added for this zone yet."}
              </div>
              <div className="rounded-[24px] bg-[#F4EFE1] p-4 text-sm leading-6 text-stone-700">
                Mini trend summary:{" "}
                {openIssues.length > 1
                  ? `${zone.name} still has stacked follow-up work, so it should stay near the top of the crew plan.`
                  : `${zone.name} looks relatively stable, with lighter active follow-up.`}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
            <CardHeader>
              <CardTitle>Recent work</CardTitle>
              <CardDescription>Completed activities recorded for this zone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.length === 0 ? (
                <EmptyState title="No activities yet" body="Completed work logged for this zone will appear here." />
              ) : (
                activities.map((item) => (
                  <div key={item.id} className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-4">
                    <p className="font-semibold text-stone-900">{item.activityType}</p>
                    <p className="text-sm text-stone-500">{item.performedAt}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.notes}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
            <CardHeader>
              <CardTitle>Open issues and observations</CardTitle>
              <CardDescription>Update issue status as field conditions change.</CardDescription>
            </CardHeader>
            <CardContent>
              {observations.length === 0 ? (
                <EmptyState
                  title="No observations yet"
                  body="Zone-specific scouting notes will appear here once they are logged."
                />
              ) : (
                <ObservationList observations={observations} onStatusChange={updateObservationStatus} />
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Upcoming and agent-suggested work tied to this zone.</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <EmptyState
                  title="No tasks yet"
                  body="Zone-linked tasks will show up here as you log work or approve parsed notes."
                />
              ) : (
                <TaskTable tasks={tasks} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedShell>
  );
}
