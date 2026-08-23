"use client";

import { useFieldSignals } from "@/components/field-signals/provider";
import { ProtectedShell } from "@/components/field-signals/shell";
import { ObservationList, TaskTable } from "@/components/field-signals/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WeeklyReportPage() {
  const { planner, state, getZoneById } = useFieldSignals();

  return (
    <ProtectedShell
      title="Weekly report"
      description="A printable operations summary covering open issues, zone priorities, completed work, and suggested next actions for the week ahead."
      actions={
        <Button
          variant="outline"
          className="rounded-2xl border-stone-200 bg-white"
          onClick={() => window.print()}
        >
          Print report
        </Button>
      }
    >
      <div className="space-y-4 print:space-y-6">
        <Card className="rounded-[28px] border-white/80 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Weekly summary</CardTitle>
            <CardDescription>Generated on Sunday, August 23, 2026 from current farm records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-stone-700">
            <div className="rounded-[28px] bg-[#F4EFE1] p-5">{planner.summary}</div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Open issues</p>
                <p className="mt-2 text-3xl font-semibold">{planner.unresolvedIssues.length}</p>
              </div>
              <div className="rounded-[24px] bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">High-risk zones</p>
                <p className="mt-2 text-3xl font-semibold">{planner.highRiskZones.length}</p>
              </div>
              <div className="rounded-[24px] bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Completed work</p>
                <p className="mt-2 text-3xl font-semibold">{state.activities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-white/80 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Zone-by-zone priorities</CardTitle>
            <CardDescription>Highest-priority operational follow-up by field area.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {planner.topPriorities.map((item) => (
              <div key={item.zoneId} className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-4">
                <p className="font-semibold text-stone-900">{item.zoneName}</p>
                <p className="mt-1 text-sm leading-6 text-stone-600">{item.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-white/80 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Suggested next actions</CardTitle>
            <CardDescription>Upcoming tasks with due dates and field context.</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskTable tasks={planner.dueSoonTasks} />
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="rounded-[28px] border-white/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Open issues</CardTitle>
              <CardDescription>Issues still unresolved as of Sunday, August 23, 2026.</CardDescription>
            </CardHeader>
            <CardContent>
              <ObservationList observations={planner.unresolvedIssues} />
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-white/80 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Completed work</CardTitle>
              <CardDescription>Recent activities already logged into the farm record.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {state.activities.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-4">
                  <p className="font-semibold text-stone-900">{item.activityType}</p>
                  <p className="text-sm text-stone-500">
                    {getZoneById(item.zoneId)?.name} · {item.performedAt}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.notes}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedShell>
  );
}
