"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ActivitySquare, ArrowRight, Clock3, Sprout } from "lucide-react";
import { useFieldSignals } from "@/components/field-signals/provider";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Observation, Task } from "@/types/field-signals";

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-stone-300 bg-stone-50/80 px-6 py-10 text-center">
      <p className="text-lg font-semibold text-stone-900">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string | number;
  caption: string;
}) {
  return (
    <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
      <CardHeader className="pb-2">
        <CardDescription className="text-xs uppercase tracking-[0.18em] text-stone-500">
          {label}
        </CardDescription>
        <CardTitle className="text-3xl font-semibold tracking-tight">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-stone-600">{caption}</p>
      </CardContent>
    </Card>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const tone =
    severity === "high"
      ? "bg-[#FBE4DE] text-[#9C4121]"
      : severity === "medium"
        ? "bg-[#F7EED5] text-[#8B6A16]"
        : "bg-[#E4F1E8] text-[#2D6A4F]";
  return <Badge className={cn("rounded-full px-3 py-1 font-medium", tone)}>{severity}</Badge>;
}

export function TaskPriorityBadge({ priority }: { priority: string }) {
  const tone =
    priority === "urgent"
      ? "bg-[#3D2B1F] text-white"
      : priority === "high"
        ? "bg-[#E8A87C] text-[#4A2F1B]"
        : priority === "medium"
          ? "bg-[#F4E7BF] text-[#5F4A12]"
          : "bg-[#E5EFE7] text-[#2F5D50]";
  return <Badge className={cn("rounded-full px-3 py-1 font-medium", tone)}>{priority}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "resolved" || status === "done"
      ? "bg-[#E4F1E8] text-[#2D6A4F]"
      : status === "monitoring" || status === "in_progress"
        ? "bg-[#F4E7BF] text-[#5F4A12]"
        : "bg-[#FBE4DE] text-[#9C4121]";
  return <Badge className={cn("rounded-full px-3 py-1 font-medium", tone)}>{status}</Badge>;
}

export function DashboardStats() {
  const { state, planner } = useFieldSignals();
  const openIssues = state.observations.filter((item) => item.status !== "resolved");
  const resolvedThisWeek = state.observations.filter(
    (item) => item.status === "resolved" && item.updatedAt >= "2026-08-17",
  );
  const tasksDue = state.tasks.filter((task) => task.status !== "done" && task.dueDate <= "2026-08-30");

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Zones"
        value={state.zones.length}
        caption="Named field blocks with map coordinates, crop notes, and local context."
      />
      <MetricCard
        label="Open issues"
        value={openIssues.length}
        caption="Unresolved observations still requiring field follow-up or monitoring."
      />
      <MetricCard
        label="Resolved this week"
        value={resolvedThisWeek.length}
        caption="Issues closed during the current planning window starting August 17, 2026."
      />
      <MetricCard
        label="Due this week"
        value={tasksDue.length}
        caption={`${planner.highRiskZones.length} zone${planner.highRiskZones.length === 1 ? "" : "s"} currently flagged as higher risk.`}
      />
    </div>
  );
}

export function DashboardCharts() {
  const { state, getZoneById } = useFieldSignals();

  const issuesByCategory = Object.entries(
    state.observations.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const issuesByZone = state.zones.map((zone) => ({
    name: zone.name,
    open: state.observations.filter((item) => item.zoneId === zone.id && item.status !== "resolved").length,
  }));

  const activityTrend = ["2026-08-19", "2026-08-20", "2026-08-21", "2026-08-22", "2026-08-23"].map((date) => ({
    date: date.slice(5),
    activities: state.activities.filter((item) => item.performedAt === date).length,
  }));

  const issueStatus = [
    { name: "Open", value: state.observations.filter((item) => item.status === "open").length },
    { name: "Monitoring", value: state.observations.filter((item) => item.status === "monitoring").length },
    { name: "Resolved", value: state.observations.filter((item) => item.status === "resolved").length },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>Issues by category</CardTitle>
          <CardDescription>Where this week&apos;s friction is showing up.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={issuesByCategory}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2F5D50" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>Open issues by zone</CardTitle>
          <CardDescription>Which field areas need attention first.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={issuesByZone} layout="vertical">
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
              <YAxis type="category" width={120} dataKey="name" tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="open" fill="#D36B43" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>Activity count over time</CardTitle>
          <CardDescription>Completed work captured each day this week.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityTrend}>
              <defs>
                <linearGradient id="activityFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#6E8B3D" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#6E8B3D" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="activities" stroke="#6E8B3D" fill="url(#activityFill)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>Open vs resolved</CardTitle>
          <CardDescription>Current issue status mix across the farm.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={issueStatus} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={6}>
                {issueStatus.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={["#D36B43", "#E0B14C", "#2F5D50"][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export function RecentActivityPanels() {
  const { state, gapAlerts, getZoneById } = useFieldSignals();
  const recentObservations = [...state.observations].sort((a, b) => b.observedAt.localeCompare(a.observedAt)).slice(0, 4);
  const recentActivities = [...state.activities].sort((a, b) => b.performedAt.localeCompare(a.performedAt)).slice(0, 4);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>Recent observations</CardTitle>
          <CardDescription>Open notes, monitoring signals, and status at a glance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentObservations.map((item) => (
            <div key={item.id} className="rounded-3xl border border-stone-200 bg-stone-50/80 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-stone-900">{item.title}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    {getZoneById(item.zoneId)?.name} · {item.observedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={item.severity} />
                  <StatusBadge status={item.status} />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">{item.rawNote}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
          <CardHeader>
            <CardTitle>Recent activities</CardTitle>
            <CardDescription>Completed work across the farm this week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-3xl border border-stone-200 bg-stone-50/80 p-4">
                <div className="mt-1 rounded-full bg-[#E4F1E8] p-2 text-[#2F5D50]">
                  <ActivitySquare className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium">{item.activityType}</p>
                  <p className="text-sm text-stone-600">
                    {getZoneById(item.zoneId)?.name} · {item.performedAt}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">{item.notes}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
          <CardHeader>
            <CardTitle>Coverage gaps</CardTitle>
            <CardDescription>Zones that may need a fresh check-in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {gapAlerts.length === 0 ? (
              <EmptyState title="No obvious gaps" body="Every zone has either recent observation coverage or no overdue tasks right now." />
            ) : (
              gapAlerts.slice(0, 4).map((alert) => (
                <div key={`${alert.zoneId}-${alert.message}`} className="rounded-3xl border border-stone-200 bg-stone-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-[#FFF1E8] p-2 text-[#A14E24]">
                        <Clock3 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{alert.zoneName}</p>
                        <p className="text-sm text-stone-600">{alert.message}</p>
                      </div>
                    </div>
                    <SeverityBadge severity={alert.severity} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ZoneSummaryGrid() {
  const { state } = useFieldSignals();
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {state.zones.map((zone) => {
        const openIssues = state.observations.filter(
          (item) => item.zoneId === zone.id && item.status !== "resolved",
        ).length;
        const activeTasks = state.tasks.filter((task) => task.zoneId === zone.id && task.status !== "done").length;
        return (
          <Card key={zone.id} className="rounded-[28px] border-white/80 bg-white/85 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>{zone.name}</CardTitle>
                  <CardDescription>
                    {zone.cropType || "Crop not set"} · {zone.acreage || "?"} acres
                  </CardDescription>
                </div>
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: zone.color }} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-stone-50 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Open issues</p>
                  <p className="mt-2 text-2xl font-semibold">{openIssues}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Active tasks</p>
                  <p className="mt-2 text-2xl font-semibold">{activeTasks}</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-stone-600">{zone.notes || "No extra notes yet."}</p>
              <Link
                href={`/zones/${zone.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#2F5D50]"
              >
                Open zone detail
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function TaskTable({
  tasks,
  onStatusChange,
  onDelete,
}: {
  tasks: Task[];
  onStatusChange?: (taskId: string, status: Task["status"]) => void;
  onDelete?: (taskId: string) => void;
}) {
  const { getZoneById } = useFieldSignals();
  return (
    <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white/85">
      <div className="grid grid-cols-[1.5fr_1fr_0.7fr_0.8fr_0.9fr] gap-3 border-b border-stone-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
        <span>Task</span>
        <span>Zone</span>
        <span>Priority</span>
        <span>Due</span>
        <span>Status</span>
      </div>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="grid grid-cols-[1.5fr_1fr_0.7fr_0.8fr_0.9fr] items-center gap-3 border-b border-stone-100 px-5 py-4 text-sm last:border-b-0"
        >
          <div>
            <p className="font-medium text-stone-900">{task.title}</p>
            <p className="text-stone-500">{task.source === "agent" ? "Agent suggested" : "Manual task"}</p>
          </div>
          <span>{getZoneById(task.zoneId)?.name}</span>
          <TaskPriorityBadge priority={task.priority} />
          <span>{task.dueDate}</span>
          <div className="flex flex-wrap items-center gap-2">
            {onStatusChange ? (
              <select
                value={task.status}
                onChange={(event) => onStatusChange(task.id, event.target.value as Task["status"])}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
              >
                <option value="todo">todo</option>
                <option value="in_progress">in progress</option>
                <option value="done">done</option>
              </select>
            ) : (
              <StatusBadge status={task.status} />
            )}
            {onDelete ? (
              <button className="text-xs font-medium text-stone-500 hover:text-stone-900" onClick={() => onDelete(task.id)}>
                Remove
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ObservationList({
  observations,
  onStatusChange,
}: {
  observations: Observation[];
  onStatusChange?: (observationId: string, status: Observation["status"]) => void;
}) {
  const { getZoneById } = useFieldSignals();
  return (
    <div className="space-y-3">
      {observations.map((item) => (
        <div key={item.id} className="rounded-[28px] border border-stone-200 bg-white/85 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-stone-900">{item.title}</p>
              <p className="text-sm text-stone-500">
                {getZoneById(item.zoneId)?.name} · {item.observedAt}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <SeverityBadge severity={item.severity} />
              {onStatusChange ? (
                <select
                  value={item.status}
                  onChange={(event) =>
                    onStatusChange(item.id, event.target.value as Observation["status"])
                  }
                  className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="open">open</option>
                  <option value="monitoring">monitoring</option>
                  <option value="resolved">resolved</option>
                </select>
              ) : (
                <StatusBadge status={item.status} />
              )}
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-stone-600">{item.rawNote}</p>
        </div>
      ))}
    </div>
  );
}

export function SetupPrompt() {
  return (
    <EmptyState
      title="Finish farm setup first"
      body="Create your farm profile and upload a map before logging new observations, activities, or tasks."
      action={
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-full bg-[#2F5D50] px-5 py-3 text-sm font-medium text-white"
        >
          Start onboarding
          <Sprout className="h-4 w-4" />
        </Link>
      }
    />
  );
}
