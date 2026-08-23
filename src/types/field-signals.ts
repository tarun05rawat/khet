export type ObservationCategory =
  | "irrigation"
  | "pest"
  | "fertilizer"
  | "weed pressure"
  | "harvest"
  | "labor"
  | "equipment"
  | "weather"
  | "general";

export type Severity = "low" | "medium" | "high";
export type ObservationStatus = "open" | "monitoring" | "resolved";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskSource = "manual" | "agent";

export type AssetRecord = {
  name: string;
  type: string;
  dataUrl: string;
};

export type FarmProfile = {
  id: string;
  userId: string;
  name: string;
  location: string;
  farmType?: string;
  notes?: string;
  mapFile?: AssetRecord;
  createdAt: string;
  updatedAt: string;
};

export type ZoneCoordinate =
  | {
      kind: "rectangle";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      kind: "polygon";
      points: { x: number; y: number }[];
    };

export type Zone = {
  id: string;
  farmId: string;
  name: string;
  cropType?: string;
  acreage?: number;
  color: string;
  notes?: string;
  coordinates: ZoneCoordinate;
  createdAt: string;
  updatedAt: string;
};

export type Observation = {
  id: string;
  farmId: string;
  zoneId: string;
  title: string;
  rawNote: string;
  category: ObservationCategory;
  severity: Severity;
  status: ObservationStatus;
  observedAt: string;
  image?: AssetRecord;
  createdAt: string;
  updatedAt: string;
};

export type Activity = {
  id: string;
  farmId: string;
  zoneId: string;
  activityType: string;
  notes: string;
  quantity?: number;
  units?: string;
  estimatedCost?: number;
  laborHours?: number;
  performedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  farmId: string;
  zoneId: string;
  observationId?: string;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  source: TaskSource;
  createdAt: string;
  updatedAt: string;
};

export type WeeklyReport = {
  id: string;
  farmId: string;
  weekStart: string;
  summary: string;
  topPriorities: string[];
  generatedAt: string;
};

export type AgentObservationDraft = {
  suggestedZoneId?: string;
  suggestedZoneName?: string;
  observationTitle: string;
  category: ObservationCategory;
  severity: Severity;
  followUpTask?: {
    title: string;
    priority: TaskPriority;
    dueDate?: string;
  };
  confidenceNote: string;
  missingInformation: string[];
};

export type WeeklyPlannerOutput = {
  summary: string;
  topPriorities: {
    zoneId: string;
    zoneName: string;
    reason: string;
    priority: TaskPriority;
  }[];
  dueSoonTasks: Task[];
  unresolvedIssues: Observation[];
  highRiskZones: string[];
};

export type GapAlert = {
  zoneId: string;
  zoneName: string;
  message: string;
  severity: Severity;
};

export type FieldSignalsState = {
  userId: string;
  farm?: FarmProfile;
  zones: Zone[];
  observations: Observation[];
  activities: Activity[];
  tasks: Task[];
  weeklyReports: WeeklyReport[];
};
