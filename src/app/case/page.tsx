"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Menu, Search, ArrowLeft } from "lucide-react";

interface Case {
  id: string;
  clientName: string;
  caseTitle: string;
  daysIntake: number;
  category: string;
  status: string;
}

const allCases: Case[] = [
  {
    id: "1",
    clientName: "Maria Lopez",
    caseTitle: "Emergency Shelter Placement",
    daysIntake: 3,
    category: "Housing",
    status: "Active",
  },
  {
    id: "2",
    clientName: "John Thompson",
    caseTitle: "Mental Health Evaluation Referral",
    daysIntake: 12,
    category: "Health",
    status: "Pending",
  },
  {
    id: "3",
    clientName: "Emily Smith",
    caseTitle: "Job Readiness Coaching",
    daysIntake: 8,
    category: "Employment",
    status: "Active",
  },
  {
    id: "4",
    clientName: "Michael Lee",
    caseTitle: "Nutrition Assistance Program",
    daysIntake: 5,
    category: "Food",
    status: "Active",
  },
  {
    id: "5",
    clientName: "John Doe",
    caseTitle: "Substance Recovery Support",
    daysIntake: 15,
    category: "Health",
    status: "Active",
  },
  {
    id: "6",
    clientName: "Ana Garcia",
    caseTitle: "Transitional Housing Assistance",
    daysIntake: 2,
    category: "Housing",
    status: "Pending",
  },
];

const categoryColors: Record<string, string> = {
  Housing: "bg-blue-100 text-blue-800",
  Health: "bg-green-100 text-green-800",
  Employment: "bg-purple-100 text-purple-800",
  Food: "bg-amber-100 text-amber-800",
};

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Pending: "bg-orange-100 text-orange-800",
  Closed: "bg-gray-100 text-gray-800",
};

export default function CaseManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter as user types
  const filtered = allCases.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.clientName.toLowerCase().includes(q) ||
      c.caseTitle.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5 text-green-600" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-green-800">My Cases</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cases..."
              className="pl-10"
            />
          </div>

          {/* Avatar & Menu */}
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="Admin" />
            <AvatarFallback>FH</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6 text-gray-600" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">
            No cases match your search.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => router.push(`/case/${item.id}`)}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-white border-b border-green-100 p-4">
                    <CardTitle className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-green-800">
                          {item.clientName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.caseTitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Days since intake
                        </p>
                        <p className="mt-1 text-xl font-semibold text-green-800">
                          {item.daysIntake}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-2 bg-white p-4">
                    <Badge className={categoryColors[item.category] || ""}>
                      {item.category}
                    </Badge>
                    <Badge className={statusColors[item.status] || ""}>
                      {item.status}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
