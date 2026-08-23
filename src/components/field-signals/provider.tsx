"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/firebase/config";
import { demoFieldSignalsState, demoUser, makeId } from "@/lib/field-signals-demo";
import {
  Activity,
  AgentObservationDraft,
  AssetRecord,
  FieldSignalsState,
  FarmProfile,
  Observation,
  ObservationStatus,
  Task,
  TaskStatus,
  WeeklyPlannerOutput,
  Zone,
} from "@/types/field-signals";
import {
  detectZoneGaps,
  generateWeeklyPlanner,
  parseOperationalNote,
} from "@/lib/field-signals-agent";

const STORAGE_KEY = "khet-state-v1";

type DemoUser = typeof demoUser;

type FieldSignalsContextValue = {
  user: User | DemoUser | null;
  authReady: boolean;
  isDemoMode: boolean;
  state: FieldSignalsState;
  planner: WeeklyPlannerOutput;
  gapAlerts: ReturnType<typeof detectZoneGaps>;
  signInWithGoogle: () => Promise<void>;
  continueInDemoMode: () => void;
  logout: () => Promise<void>;
  saveFarm: (farm: Omit<FarmProfile, "id" | "userId" | "createdAt" | "updatedAt">) => void;
  saveMapAsset: (mapFile: AssetRecord) => void;
  addZone: (zone: Omit<Zone, "id" | "farmId" | "createdAt" | "updatedAt">) => void;
  addObservation: (
    observation: Omit<Observation, "id" | "farmId" | "createdAt" | "updatedAt">,
    task?: Omit<Task, "id" | "farmId" | "createdAt" | "updatedAt">,
  ) => void;
  addActivity: (activity: Omit<Activity, "id" | "farmId" | "createdAt" | "updatedAt">) => void;
  addTask: (task: Omit<Task, "id" | "farmId" | "createdAt" | "updatedAt">) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  removeTask: (taskId: string) => void;
  updateObservationStatus: (observationId: string, status: ObservationStatus) => void;
  parseNote: (rawNote: string) => AgentObservationDraft;
  getZoneById: (zoneId?: string) => Zone | undefined;
};

const FieldSignalsContext = createContext<FieldSignalsContextValue | null>(null);

function hasFirebaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_PROJECTID &&
      process.env.NEXT_PUBLIC_APP_ID,
  );
}

function nowIso() {
  return new Date().toISOString();
}

function cloneDemoState(): FieldSignalsState {
  return JSON.parse(JSON.stringify(demoFieldSignalsState)) as FieldSignalsState;
}

export function FieldSignalsProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | DemoUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [state, setState] = useState<FieldSignalsState>(cloneDemoState());

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setState(JSON.parse(stored) as FieldSignalsState);
    } else {
      setState(cloneDemoState());
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!hasFirebaseConfig()) {
      setUser(demoUser);
      setIsDemoMode(true);
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsDemoMode(false);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const planner = useMemo(
    () => generateWeeklyPlanner(state.zones, state.observations, state.tasks),
    [state],
  );
  const gapAlerts = useMemo(
    () => detectZoneGaps(state.zones, state.observations, state.tasks),
    [state],
  );

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const continueInDemoMode = () => {
    setUser(demoUser);
    setIsDemoMode(true);
    setAuthReady(true);
  };

  const logout = async () => {
    if (isDemoMode || !hasFirebaseConfig()) {
      setUser(null);
      setIsDemoMode(false);
      return;
    }
    await signOut(auth);
  };

  const updateState = (updater: (current: FieldSignalsState) => FieldSignalsState) => {
    setState((current) => updater(current));
  };

  const saveFarm = (farm: Omit<FarmProfile, "id" | "userId" | "createdAt" | "updatedAt">) => {
    updateState((current) => {
      const timestamp = nowIso();
      return {
        ...current,
        farm: {
          id: current.farm?.id || makeId("farm"),
          userId: (user?.uid as string) || demoUser.uid,
          createdAt: current.farm?.createdAt || timestamp,
          updatedAt: timestamp,
          ...farm,
        },
      };
    });
  };

  const saveMapAsset = (mapFile: AssetRecord) => {
    updateState((current) => {
      if (!current.farm) return current;
      return {
        ...current,
        farm: {
          ...current.farm,
          mapFile,
          updatedAt: nowIso(),
        },
      };
    });
  };

  const addZone = (zone: Omit<Zone, "id" | "farmId" | "createdAt" | "updatedAt">) => {
    updateState((current) => {
      if (!current.farm) return current;
      const timestamp = nowIso();
      return {
        ...current,
        zones: [
          {
            ...zone,
            id: makeId("zone"),
            farmId: current.farm.id,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          ...current.zones,
        ],
      };
    });
  };

  const addObservation = (
    observation: Omit<Observation, "id" | "farmId" | "createdAt" | "updatedAt">,
    task?: Omit<Task, "id" | "farmId" | "createdAt" | "updatedAt">,
  ) => {
    updateState((current) => {
      if (!current.farm) return current;
      const timestamp = nowIso();
      const observationId = makeId("obs");
      return {
        ...current,
        observations: [
          {
            ...observation,
            id: observationId,
            farmId: current.farm.id,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          ...current.observations,
        ],
        tasks: task
          ? [
              {
                ...task,
                id: makeId("task"),
                farmId: current.farm.id,
                observationId,
                createdAt: timestamp,
                updatedAt: timestamp,
              },
              ...current.tasks,
            ]
          : current.tasks,
      };
    });
  };

  const addActivity = (activity: Omit<Activity, "id" | "farmId" | "createdAt" | "updatedAt">) => {
    updateState((current) => {
      if (!current.farm) return current;
      const timestamp = nowIso();
      return {
        ...current,
        activities: [
          {
            ...activity,
            id: makeId("act"),
            farmId: current.farm.id,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          ...current.activities,
        ],
      };
    });
  };

  const addTask = (task: Omit<Task, "id" | "farmId" | "createdAt" | "updatedAt">) => {
    updateState((current) => {
      if (!current.farm) return current;
      const timestamp = nowIso();
      return {
        ...current,
        tasks: [
          {
            ...task,
            id: makeId("task"),
            farmId: current.farm.id,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          ...current.tasks,
        ],
      };
    });
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    updateState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId ? { ...task, status, updatedAt: nowIso() } : task,
      ),
    }));
  };

  const removeTask = (taskId: string) => {
    updateState((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== taskId),
    }));
  };

  const updateObservationStatus = (observationId: string, status: ObservationStatus) => {
    updateState((current) => ({
      ...current,
      observations: current.observations.map((item) =>
        item.id === observationId ? { ...item, status, updatedAt: nowIso() } : item,
      ),
    }));
  };

  const parseNote = (rawNote: string) => parseOperationalNote(rawNote, state.zones);
  const getZoneById = (zoneId?: string) => state.zones.find((zone) => zone.id === zoneId);

  const value = {
    user,
    authReady,
    isDemoMode,
    state,
    planner,
    gapAlerts,
    signInWithGoogle,
    continueInDemoMode,
    logout,
    saveFarm,
    saveMapAsset,
    addZone,
    addObservation,
    addActivity,
    addTask,
    updateTaskStatus,
    removeTask,
    updateObservationStatus,
    parseNote,
    getZoneById,
  } satisfies FieldSignalsContextValue;

  return <FieldSignalsContext.Provider value={value}>{children}</FieldSignalsContext.Provider>;
}

export function useFieldSignals() {
  const context = useContext(FieldSignalsContext);
  if (!context) {
    throw new Error("useFieldSignals must be used within FieldSignalsProvider");
  }
  return context;
}
