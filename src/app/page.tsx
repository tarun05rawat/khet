import Link from "next/link";
import { ArrowRight, Leaf, MapPinned, NotebookPen, Radar } from "lucide-react";

export default function Home() {
  return (
    <main className="fieldsignals-grid min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(230,239,219,0.95),_rgba(247,243,234,0.85)_48%,_#f8f4eb_100%)] px-5 py-8 text-stone-900 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2F5D50] text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">khet</p>
              <p className="text-sm text-stone-500">Agent-assisted farm operations planner</p>
            </div>
          </div>
          <Link
            href="/login"
            className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-medium shadow-sm"
          >
            Open app
          </Link>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full bg-[#E7F3EC] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2F5D50]">
              Built for small growers
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-stone-900 lg:text-7xl">
              Turn rough field notes into clear weekly action.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
              khet helps growers organize zone-based observations, log completed work, flag unresolved issues, and produce calm, practical weekly plans from real farm operations data.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-[#2F5D50] px-6 py-4 text-sm font-medium text-white shadow-sm"
              >
                Launch the MVP
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-4 text-sm font-medium shadow-sm"
              >
                Jump to farm setup
              </Link>
            </div>
          </div>

          <div className="rounded-[36px] border border-white/70 bg-white/85 p-6 shadow-[0_30px_100px_rgba(100,88,67,0.15)] backdrop-blur">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] bg-[#F4EFE1] p-5">
                <MapPinned className="h-5 w-5 text-[#2F5D50]" />
                <p className="mt-4 text-lg font-semibold">Map-aware zones</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Overlay named fields on top of a farm map and keep every issue tied to a real place.
                </p>
              </div>
              <div className="rounded-[28px] bg-[#F9EEDF] p-5">
                <NotebookPen className="h-5 w-5 text-[#A14E24]" />
                <p className="mt-4 text-lg font-semibold">Review-first note parser</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Paste messy scouting notes and approve structured drafts before they become records.
                </p>
              </div>
              <div className="rounded-[28px] bg-[#E8F0E7] p-5 md:col-span-2">
                <Radar className="h-5 w-5 text-[#2F5D50]" />
                <p className="mt-4 text-lg font-semibold">Weekly planning that feels operational</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  See top priorities by zone, overdue work, high-risk areas, and a printable weekly report grounded in stored farm data.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
