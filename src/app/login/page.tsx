"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, MapPinned, ShieldCheck } from "lucide-react";
import { useFieldSignals } from "@/components/field-signals/provider";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { user, authReady, isDemoMode, signInWithGoogle, continueInDemoMode } = useFieldSignals();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authReady && user) {
      router.replace("/dashboard");
    }
  }, [authReady, router, user]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(230,239,219,0.95),_rgba(247,243,234,0.85)_48%,_#f8f4eb_100%)] px-5 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F5D50] text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">khet</p>
              <p className="text-sm text-stone-500">Farm operations planning for real weekly work</p>
            </div>
          </div>
          <h1 className="mt-8 text-5xl font-semibold tracking-tight text-stone-900">
            Sign in and start planning by field.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
            Upload a farm map, define zones, log issues and completed work, and build a practical action plan for the week of Sunday, August 23, 2026 and beyond.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] bg-white/80 p-5 shadow-sm">
              <MapPinned className="h-5 w-5 text-[#2F5D50]" />
              <p className="mt-4 font-semibold">Zone-aware operations</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Every observation, issue, and task stays attached to a named block on the farm map.
              </p>
            </div>
            <div className="rounded-[28px] bg-white/80 p-5 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-[#A14E24]" />
              <p className="mt-4 font-semibold">Reviewable AI assistance</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                The note parser proposes structure and follow-up work, but the grower stays in control.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-[0_30px_100px_rgba(100,88,67,0.15)] backdrop-blur">
          <h2 className="text-2xl font-semibold">Open the MVP</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Use Google sign-in when Firebase credentials are configured. Demo mode is also available so the product can be explored immediately.
          </p>
          {error ? (
            <p className="mt-4 rounded-2xl bg-[#FBE4DE] px-4 py-3 text-sm text-[#9C4121]">{error}</p>
          ) : null}
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading || !authReady}
              className="h-12 w-full rounded-2xl bg-[#2F5D50] text-white hover:bg-[#264B41]"
            >
              {loading ? "Signing in..." : "Sign in with Google"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                continueInDemoMode();
                router.push("/dashboard");
              }}
              className="h-12 w-full rounded-2xl border-stone-200 bg-white"
            >
              {isDemoMode ? "Continue in demo mode" : "Use demo farm data"}
            </Button>
          </div>
          <div className="mt-6 rounded-[28px] bg-[#F4EFE1] p-5 text-sm leading-6 text-stone-600">
            If Firebase is not configured, khet automatically falls back to demo mode so you can still walk through onboarding, mapping, logging, planning, and reporting.
          </div>
        </div>
      </div>
    </div>
  );
}
