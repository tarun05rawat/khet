/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, ChevronLeft } from "lucide-react";
import NewRequestForm from "@/components/NewRequestForm";
import { SERVICES } from "@/types/enums";

type ServiceRow = {
  type: string;
  quantity: number;
  time: string;
  date: string;
  status: "In Queue" | "Completed";
};

type MedicationRow = {
  type: string;
  time: string;
  date: string;
  status: "Awaiting" | "Completed";
};

type ClientDoc = {
  name: string;
  ageGroup: string;
  gender?: string;
  ethnicity?: string;
  services: ServiceRow[];
  meds: MedicationRow[];
};

const MOCK_SERVICES: ServiceRow[] = [
  {
    type: "SHOWER",
    quantity: 6,
    time: "3:22 PM",
    date: "04/17/25",
    status: "In Queue",
  },
  {
    type: "LAUNDRY",
    quantity: 10,
    time: "9:05 AM",
    date: "03/29/25",
    status: "In Queue",
  },
  {
    type: "MNGMT",
    quantity: 4,
    time: "6:47 PM",
    date: "04/06/25",
    status: "In Queue",
  },
];

const MOCK_MEDICATIONS: MedicationRow[] = [
  { type: "Ibuprofen", time: "8:00 AM", date: "04/20/25", status: "Awaiting" },
  {
    type: "Paracetamol",
    time: "12:00 PM",
    date: "04/20/25",
    status: "Completed",
  },
  {
    type: "Amoxicillin",
    time: "6:00 PM",
    date: "04/20/25",
    status: "Awaiting",
  },
];

// const categoryColors: Record<string, string> = {
//   Housing: "bg-blue-100 text-blue-800",
//   Health: "bg-green-100 text-green-800",
//   Employment: "bg-purple-100 text-purple-800",
//   Food: "bg-amber-100 text-amber-800",
// };

// const statusColors: Record<string, string> = {
//   Active: "bg-emerald-100 text-emerald-800",
//   Pending: "bg-orange-100 text-orange-800",
//   Closed: "bg-gray-100 text-gray-800",
// };

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // Auth & data loading state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ClientDoc | null>(null);

  // Profile data
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [meds, setMeds] = useState<MedicationRow[]>([]);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  // Tabs state for medications
  // const [medTab, setMedTab] = useState<"today" | "history">("today");

  // 1) Check authentication
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        router.push("/login");
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, [router]);

  // 2) Fetch client data once authenticated
  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      (async () => {
        const snap = await getDoc(doc(db, "DataTable", id));
        if (!snap.exists()) {
          notFound();
          return;
        }
        const raw = snap.data() as any;
        setClient({
          name: raw.name,
          ageGroup: raw.ageGroup,
          gender: raw.gender,
          ethnicity: raw.ethnicity,
          services: MOCK_SERVICES,
          meds: MOCK_MEDICATIONS,
        });
        setServices(MOCK_SERVICES);
        setMeds(MOCK_MEDICATIONS);
        setLoading(false);
      })();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user, id]);

  // Status update handlers
  const updateServiceStatus = (
    type: string,
    status: "In Queue" | "Completed"
  ) =>
    setServices((prev) =>
      prev.map((s) => (s.type === type ? { ...s, status } : s))
    );

  const updateMedStatus = (type: string, status: "Awaiting" | "Completed") =>
    setMeds((prev) =>
      prev.map((m) => (m.type === type ? { ...m, status } : m))
    );

  // New service request
  const handleNewRequestSubmit = (serviceType: SERVICES) => {
    setServices((prev) => {
      const idx = prev.findIndex(
        (s) => s.type === serviceType && s.status === "In Queue"
      );
      if (idx > -1) {
        return prev.map((s, i) =>
          i === idx ? { ...s, quantity: s.quantity + 1 } : s
        );
      }
      return [
        {
          type: serviceType,
          quantity: 1,
          time: new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
          date: new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
          }),
          status: "In Queue",
        },
        ...prev,
      ];
    });
    setIsRequestFormOpen(false);
  };

  // Loading states
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-gray-500">
          Checking authentication...
        </p>
      </div>
    );
  }
  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-gray-500">Loading profile…</p>
      </div>
    );
  }
  if (!client) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f7e9] to-[#c8e6c9] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <Button
          variant="link"
          className="mb-4 px-0 text-gray-700 hover:text-gray-900"
          onClick={() => router.push("/dashboard")}
        >
          <ChevronLeft className="mr-1 h-5 w-5" />
          Go back to dashboard
        </Button>

        {/* Header */}
        <Card className="mb-6 bg-green-600 text-white rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{client.name}</CardTitle>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Demographics & Medications */}
          <div className="flex flex-col gap-6">
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="flex justify-between items-center pb-2">
                <CardTitle className="text-xl">Demographics</CardTitle>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <Demographic label="Age‑Group" value={client.ageGroup} />
                  <Demographic label="Gender" value={client.gender ?? "—"} />
                  <Demographic
                    label="Ethnicity"
                    value={client.ethnicity ?? "—"}
                  />
                </div>
              </CardContent>
            </Card>

            <MedicationsCard meds={meds} onStatusChange={updateMedStatus} />
          </div>

          {/* Right: Services */}
          <ServicesCard
            services={services}
            onStatusChange={updateServiceStatus}
            onNewRequestClick={() => setIsRequestFormOpen(true)}
          />
        </div>
      </div>

      <NewRequestForm
        open={isRequestFormOpen}
        onOpenChange={setIsRequestFormOpen}
        onSubmit={handleNewRequestSubmit}
      />
    </div>
  );
}

/* ─── Helper Components ───────────────────────────────────────────────── */

function Demographic({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-lg">{value}</span>
    </div>
  );
}

function StatusSelect<T extends string>({
  status,
  options,
  onChange,
}: {
  status: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as T)}
      className={`rounded-full px-3 py-1 text-sm font-medium appearance-none cursor-pointer border-0 pr-6 ${
        status === "Completed"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function ServicesCard({
  services,
  onStatusChange,
  onNewRequestClick,
}: {
  services: ServiceRow[];
  onStatusChange: (type: string, status: "In Queue" | "Completed") => void;
  onNewRequestClick: () => void;
}) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-xl">Services</CardTitle>
        <Button size="sm" variant="outline" onClick={onNewRequestClick}>
          <Plus className="mr-1 h-4 w-4" /> New Request
        </Button>
      </CardHeader>
      <CardContent>
        {services.length ? (
          <table className="w-full rounded-md border overflow-hidden">
            <thead className="bg-[#d6dce5]">
              <tr>
                {["Type", "Qty", "Time", "Date", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left text-sm font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.type} className="border-t">
                  <td className="px-4 py-2 text-sm">{s.type}</td>
                  <td className="px-4 py-2 text-sm">{s.quantity}</td>
                  <td className="px-4 py-2 text-sm">{s.time}</td>
                  <td className="px-4 py-2 text-sm">{s.date}</td>
                  <td className="px-4 py-2">
                    <StatusSelect
                      status={s.status}
                      options={["In Queue", "Completed"]}
                      onChange={(val) => onStatusChange(s.type, val)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty label="No active service requests." />
        )}
      </CardContent>
    </Card>
  );
}

function MedicationsCard({
  meds,
  onStatusChange,
}: {
  meds: MedicationRow[];
  onStatusChange: (type: string, status: "Awaiting" | "Completed") => void;
}) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-xl">Medications</CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="mr-1 h-4 w-4" /> New Medication
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today">
          <TabsList className="mb-4 grid w-full max-w-xs grid-cols-2 bg-gray-200">
            <TabsTrigger
              value="today"
              className="data-[state=active]:bg-green-200 data-[state=active]:text-green-800"
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-green-200 data-[state=active]:text-green-800"
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            {meds.length ? (
              <table className="w-full rounded-md border overflow-hidden">
                <thead className="bg-[#d6dce5]">
                  <tr>
                    {["Type", "Time", "Date", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2 text-left text-sm font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {meds.map((m) => (
                    <tr key={m.type} className="border-t">
                      <td className="px-4 py-2 text-sm">{m.type}</td>
                      <td className="px-4 py-2 text-sm">{m.time}</td>
                      <td className="px-4 py-2 text-sm">{m.date}</td>
                      <td className="px-4 py-2">
                        <StatusSelect
                          status={m.status}
                          options={["Awaiting", "Completed"]}
                          onChange={(val) => onStatusChange(m.type, val)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Empty label="No medications scheduled for today." />
            )}
          </TabsContent>

          <TabsContent value="history">
            <Empty label="Medication history will appear here." />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="p-6 text-center text-sm text-gray-500">{label}</div>;
}
