import {
  Activity,
  FieldSignalsState,
  Observation,
  Task,
  WeeklyReport,
  Zone,
} from "@/types/field-signals";

const baseDate = "2026-08-23";

export const demoUser = {
  uid: "demo-grower",
  displayName: "Rosa Mendoza",
  email: "rosa@khet.demo",
};

const zones: Zone[] = [
  {
    id: "zone-north-field",
    farmId: "farm-sage-creek",
    name: "North Field",
    cropType: "Tomatoes",
    acreage: 4.2,
    color: "#D36B43",
    notes: "Drip irrigation and frequent heat stress after noon.",
    coordinates: { kind: "rectangle", x: 8, y: 10, width: 34, height: 28 },
    createdAt: `${baseDate}T06:00:00.000Z`,
    updatedAt: `${baseDate}T06:00:00.000Z`,
  },
  {
    id: "zone-orchard-a",
    farmId: "farm-sage-creek",
    name: "Orchard Block A",
    cropType: "Peaches",
    acreage: 2.8,
    color: "#6E8B3D",
    notes: "Nitrogen program running behind on east rows.",
    coordinates: { kind: "rectangle", x: 48, y: 18, width: 26, height: 30 },
    createdAt: `${baseDate}T06:00:00.000Z`,
    updatedAt: `${baseDate}T06:00:00.000Z`,
  },
  {
    id: "zone-greenhouse-edge",
    farmId: "farm-sage-creek",
    name: "Greenhouse Edge",
    cropType: "Seedlings",
    acreage: 0.6,
    color: "#3C7A89",
    notes: "Known hotspot for pest pressure and edge dryness.",
    coordinates: { kind: "rectangle", x: 20, y: 50, width: 20, height: 18 },
    createdAt: `${baseDate}T06:00:00.000Z`,
    updatedAt: `${baseDate}T06:00:00.000Z`,
  },
];

const observations: Observation[] = [
  {
    id: "obs-1",
    farmId: "farm-sage-creek",
    zoneId: "zone-north-field",
    title: "Dry row ends after heat spike",
    rawNote: "North field looked dry again after the heat wave. Recheck drip lines Monday.",
    category: "irrigation",
    severity: "high",
    status: "open",
    observedAt: "2026-08-22",
    createdAt: `${baseDate}T07:00:00.000Z`,
    updatedAt: `${baseDate}T07:00:00.000Z`,
  },
  {
    id: "obs-2",
    farmId: "farm-sage-creek",
    zoneId: "zone-orchard-a",
    title: "Nitrogen pass incomplete",
    rawNote: "Applied nitrogen to Orchard Block A, crew finished half the row.",
    category: "fertilizer",
    severity: "medium",
    status: "monitoring",
    observedAt: "2026-08-21",
    createdAt: `${baseDate}T07:30:00.000Z`,
    updatedAt: `${baseDate}T07:30:00.000Z`,
  },
  {
    id: "obs-3",
    farmId: "farm-sage-creek",
    zoneId: "zone-greenhouse-edge",
    title: "Possible pest damage near perimeter",
    rawNote: "Saw pest damage near greenhouse edge, might need follow-up tomorrow.",
    category: "pest",
    severity: "high",
    status: "open",
    observedAt: "2026-08-23",
    createdAt: `${baseDate}T08:00:00.000Z`,
    updatedAt: `${baseDate}T08:00:00.000Z`,
  },
];

const activities: Activity[] = [
  {
    id: "act-1",
    farmId: "farm-sage-creek",
    zoneId: "zone-orchard-a",
    activityType: "Fertilizer applied",
    notes: "Applied 8 bags of nitrogen on the west half.",
    quantity: 8,
    units: "bags",
    laborHours: 3.5,
    estimatedCost: 240,
    performedAt: "2026-08-21",
    createdAt: `${baseDate}T08:15:00.000Z`,
    updatedAt: `${baseDate}T08:15:00.000Z`,
  },
  {
    id: "act-2",
    farmId: "farm-sage-creek",
    zoneId: "zone-north-field",
    activityType: "Scouting completed",
    notes: "Confirmed heat stress at row ends and checked emitter pressure.",
    laborHours: 1.5,
    performedAt: "2026-08-22",
    createdAt: `${baseDate}T08:30:00.000Z`,
    updatedAt: `${baseDate}T08:30:00.000Z`,
  },
];

const tasks: Task[] = [
  {
    id: "task-1",
    farmId: "farm-sage-creek",
    zoneId: "zone-north-field",
    observationId: "obs-1",
    title: "Inspect drip lines on north edge",
    priority: "urgent",
    dueDate: "2026-08-24",
    status: "todo",
    source: "agent",
    createdAt: `${baseDate}T08:45:00.000Z`,
    updatedAt: `${baseDate}T08:45:00.000Z`,
  },
  {
    id: "task-2",
    farmId: "farm-sage-creek",
    zoneId: "zone-greenhouse-edge",
    observationId: "obs-3",
    title: "Scout perimeter for pest spread",
    priority: "high",
    dueDate: "2026-08-24",
    status: "in_progress",
    source: "agent",
    createdAt: `${baseDate}T09:00:00.000Z`,
    updatedAt: `${baseDate}T09:00:00.000Z`,
  },
  {
    id: "task-3",
    farmId: "farm-sage-creek",
    zoneId: "zone-orchard-a",
    title: "Finish east-row nitrogen pass",
    priority: "medium",
    dueDate: "2026-08-26",
    status: "todo",
    source: "manual",
    createdAt: `${baseDate}T09:15:00.000Z`,
    updatedAt: `${baseDate}T09:15:00.000Z`,
  },
];

const weeklyReports: WeeklyReport[] = [
  {
    id: "report-1",
    farmId: "farm-sage-creek",
    weekStart: "2026-08-17",
    summary:
      "North Field and Greenhouse Edge need the most attention this week because irrigation reliability and pest pressure are both unresolved. Orchard Block A is stable, but fertilizer coverage is incomplete.",
    topPriorities: [
      "Inspect drip lines on North Field",
      "Scout greenhouse perimeter for additional pest damage",
      "Complete nitrogen pass in Orchard Block A",
    ],
    generatedAt: `${baseDate}T10:00:00.000Z`,
  },
];

export const demoFieldSignalsState: FieldSignalsState = {
  userId: demoUser.uid,
  farm: {
    id: "farm-sage-creek",
    userId: demoUser.uid,
    name: "Sage Creek Farm",
    location: "Woodland, California",
    farmType: "Mixed vegetables and orchard",
    notes:
      "Weekly planning is coordinated every Sunday evening before irrigation checks.",
    createdAt: `${baseDate}T06:00:00.000Z`,
    updatedAt: `${baseDate}T06:00:00.000Z`,
  },
  zones,
  observations,
  activities,
  tasks,
  weeklyReports,
};

export function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function sortByDateDesc<T extends { createdAt?: string; observedAt?: string; performedAt?: string; dueDate?: string }>(
  items: T[],
) {
  return [...items].sort((a, b) => {
    const left = a.createdAt || a.observedAt || a.performedAt || a.dueDate || "";
    const right = b.createdAt || b.observedAt || b.performedAt || b.dueDate || "";
    return right.localeCompare(left);
  });
}
