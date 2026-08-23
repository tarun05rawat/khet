import Link from "next/link";
import { ProtectedShell } from "@/components/field-signals/shell";
import {
  DashboardCharts,
  DashboardStats,
  RecentActivityPanels,
  ZoneSummaryGrid,
} from "@/components/field-signals/shared";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <ProtectedShell
      title="Farm operations dashboard"
      description="Monitor unresolved field issues, recent work, and weekly priorities across the entire farm from one calm, zone-aware view."
      actions={
        <>
          <Button asChild className="rounded-2xl bg-[#2F5D50] text-white hover:bg-[#264B41]">
            <Link href="/observations/new">New observation</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl border-stone-200 bg-white">
            <Link href="/planner">Open weekly planner</Link>
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <DashboardStats />
        <DashboardCharts />
        <RecentActivityPanels />
        <ZoneSummaryGrid />
      </div>
    </ProtectedShell>
  );
}
