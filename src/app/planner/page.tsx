"use client";

import Link from "next/link";
import { useFieldSignals } from "@/components/field-signals/provider";
import { ProtectedShell } from "@/components/field-signals/shell";
import {
  EmptyState,
  ObservationList,
  SeverityBadge,
  TaskPriorityBadge,
  TaskTable,
} from "@/components/field-signals/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PlannerPage() {
  const { planner } = useFieldSignals();

  return (
    <ProtectedShell
      title="Weekly planner"
      description="Generate a zone-by-zone action plan from unresolved issues, active tasks, and recent work recorded across the farm."
      actions={
        <Button asChild variant="outline" className="rounded-2xl border-stone-200 bg-white">
          <Link href="/reports/weekly">Open printable report</Link>
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
            <CardHeader>
              <CardTitle>Weekly summary</CardTitle>
              <CardDescription>Generated from current observations, task statuses, and zone risk patterns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[28px] bg-[#F4EFE1] p-5 text-sm leading-7 text-stone-700">
                {planner.summary}
              </div>
              {planner.topPriorities.length === 0 ? (
                <EmptyState
                  title="No priorities yet"
                  body="Add observations or tasks and khet will turn them into a weekly queue."
                />
              ) : (
                planner.topPriorities.map((item) => (
                  <div key={item.zoneId} className="rounded-[28px] border border-stone-200 bg-stone-50/80 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-stone-900">{item.zoneName}</p>
                        <p className="mt-1 text-sm leading-6 text-stone-600">{item.reason}</p>
                      </div>
                      <TaskPriorityBadge priority={item.priority} />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
            <CardHeader>
              <CardTitle>High-risk zones</CardTitle>
              <CardDescription>Zones currently carrying the most unresolved operational pressure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {planner.highRiskZones.length === 0 ? (
                <EmptyState title="No high-risk zones" body="The planner is not seeing concentrated risk right now." />
              ) : (
                planner.highRiskZones.map((zoneName) => (
                  <div key={zoneName} className="flex items-center justify-between rounded-[24px] bg-stone-50 px-4 py-3">
                    <span className="font-medium">{zoneName}</span>
                    <SeverityBadge severity="high" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
            <CardHeader>
              <CardTitle>Due-soon tasks</CardTitle>
              <CardDescription>Work items that should shape the next crew week.</CardDescription>
            </CardHeader>
            <CardContent>
              {planner.dueSoonTasks.length === 0 ? (
                <EmptyState title="No due-soon tasks" body="Tasks with upcoming deadlines will appear here." />
              ) : (
                <TaskTable tasks={planner.dueSoonTasks} />
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
            <CardHeader>
              <CardTitle>Unresolved issues</CardTitle>
              <CardDescription>Open observations feeding this week&apos;s action list.</CardDescription>
            </CardHeader>
            <CardContent>
              {planner.unresolvedIssues.length === 0 ? (
                <EmptyState title="No unresolved issues" body="Open observations will appear here when they still need follow-up." />
              ) : (
                <ObservationList observations={planner.unresolvedIssues.slice(0, 6)} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedShell>
  );
}
