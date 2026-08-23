"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from "recharts";

const MOCK_DATA = {
  reportPeriod: "Q1 2025",
  dateGenerated: "April 19, 2025",
  kpis: {
    totalServed: 487,
    mealsServed: 3120,
    bedOccupancyRate: 0.92,
    permanentHousingTransitions: 18,
    programCompletions: 14,
    jobPlacements: 11,
    volunteerHours: 203,
    budgetAllocated: 60000,
    budgetSpent: 57240,
  },
  highlights: [
    "Expanded kitchen team to provide vegetarian meal options.",
    "4 program graduates returned as volunteer mentors.",
    "Launched 'Hope Garden' therapy initiative in partnership with local church.",
  ],
  goalsNextQuarter: [
    "Pilot new job training workshop for shelter residents.",
    "Increase bed capacity by 10%.",
    "Implement digital intake forms for faster check-ins.",
  ],
};

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Prepare data for charts
  const serviceMetrics = [
    { name: "Total Served", value: MOCK_DATA.kpis.totalServed },
    { name: "Meals Served", value: MOCK_DATA.kpis.mealsServed },
    { name: "Vol Hours", value: MOCK_DATA.kpis.volunteerHours },
  ];

  const financialMetrics = [
    { name: "Allocated", value: MOCK_DATA.kpis.budgetAllocated },
    { name: "Spent", value: MOCK_DATA.kpis.budgetSpent },
  ];

  const trendMetrics = serviceMetrics.map((item) => ({
    ...item,
    value: item.value,
  }));

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        "https://hopehub-flask-server.onrender.com/generate-report",
        {
          method: "POST",
        }
      );

      if (!res.ok) throw new Error(`Server ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FourthAndHope_${MOCK_DATA.reportPeriod}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Report generation failed:", error);
      alert("Error generating report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">Service Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={serviceMetrics}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Financial Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={financialMetrics}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="USD" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Service Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={trendMetrics}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Count"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Brush dataKey="name" height={30} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Button
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="px-8 py-4"
        >
          {isLoading ? "Generating Report…" : "Generate Grant Report"}
        </Button>
      </div>
    </div>
  );
}
