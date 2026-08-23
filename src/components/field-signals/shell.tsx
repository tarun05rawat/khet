"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ClipboardList,
  Leaf,
  LogOut,
  Map,
  NotebookPen,
  Radar,
  Rows3,
  Tractor,
} from "lucide-react";
import { ReactNode, useEffect } from "react";
import { useFieldSignals } from "@/components/field-signals/provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: Rows3 },
  { href: "/farm/map", label: "Farm map", icon: Map },
  { href: "/observations/new", label: "Observations", icon: NotebookPen },
  { href: "/activities/new", label: "Activities", icon: Tractor },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/planner", label: "Planner", icon: Radar },
  { href: "/reports/weekly", label: "Weekly report", icon: Leaf },
];

export function ProtectedShell({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, authReady, isDemoMode, logout, state, planner } = useFieldSignals();

  useEffect(() => {
    if (authReady && !user) {
      router.replace("/login");
    }
  }, [authReady, router, user]);

  if (!authReady || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(228,238,220,0.9),_rgba(245,240,230,0.85)_45%,_#f7f3ea_100%)]">
          <div className="rounded-full border border-white/60 bg-white/75 px-5 py-3 text-sm text-stone-600 shadow-sm backdrop-blur">
          Loading khet...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(228,238,220,0.9),_rgba(245,240,230,0.85)_45%,_#f7f3ea_100%)] text-stone-900">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-5 lg:grid-cols-[280px_1fr] lg:px-6">
        <aside className="space-y-4">
          <Card className="gap-0 overflow-hidden border-white/70 bg-white/80 p-0 shadow-[0_20px_80px_rgba(98,93,74,0.10)] backdrop-blur">
            <div className="border-b border-stone-200/70 px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2F5D50] text-white shadow-sm">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold tracking-tight">khet</p>
                  <p className="text-sm text-stone-500">Agent-assisted farm ops</p>
                </div>
              </div>
            </div>
            <div className="space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active
                        ? "bg-[#2F5D50] text-white shadow-sm"
                        : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-900",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-stone-200/70 px-5 py-4">
              <div className="rounded-2xl bg-[#F4EFE1] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Weekly focus
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">{planner.summary}</p>
              </div>
            </div>
          </Card>
        </aside>

        <main className="space-y-6">
          <Card className="border-white/70 bg-white/80 shadow-[0_20px_80px_rgba(98,93,74,0.10)] backdrop-blur">
            <div className="flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {isDemoMode ? (
                    <span className="rounded-full bg-[#E7F3EC] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2F5D50]">
                      Demo mode
                    </span>
                  ) : null}
                  {!state.farm ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF1E8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#A14E24]">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Setup needed
                    </span>
                  ) : null}
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{title}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {actions}
                <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Signed in</p>
                  <p className="font-medium">{user.displayName || user.email}</p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-2xl border-stone-200 bg-white"
                  onClick={() => void logout()}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          </Card>
          {children}
        </main>
      </div>
    </div>
  );
}
