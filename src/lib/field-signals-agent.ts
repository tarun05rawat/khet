import {
  AgentObservationDraft,
  GapAlert,
  Observation,
  ObservationCategory,
  Severity,
  Task,
  TaskPriority,
  WeeklyPlannerOutput,
  Zone,
} from "@/types/field-signals";

function inferCategory(note: string): ObservationCategory {
  if (/drip|irrigat|dry|water/i.test(note)) return "irrigation";
  if (/pest|bug|damage|aphid|beetle/i.test(note)) return "pest";
  if (/fertiliz|nitrogen|compost/i.test(note)) return "fertilizer";
  if (/weed/i.test(note)) return "weed pressure";
  if (/harvest|pick/i.test(note)) return "harvest";
  if (/crew|labor/i.test(note)) return "labor";
  if (/pump|tractor|repair|equipment/i.test(note)) return "equipment";
  if (/weather|wind|heat|storm/i.test(note)) return "weather";
  return "general";
}

function inferSeverity(note: string): Severity {
  if (/urgent|again|damage|dry|blocked|fail|severe/i.test(note)) return "high";
  if (/watch|follow-up|incomplete|monitor/i.test(note)) return "medium";
  return "low";
}

function inferPriority(severity: Severity): TaskPriority {
  if (severity === "high") return "urgent";
  if (severity === "medium") return "high";
  return "medium";
}

function inferDueDate(note: string, currentDate: string) {
  const current = new Date(`${currentDate}T00:00:00`);
  const lower = note.toLowerCase();
  if (lower.includes("tomorrow")) {
    current.setDate(current.getDate() + 1);
  } else if (lower.includes("monday")) {
    const day = current.getDay();
    const delta = day === 1 ? 7 : ((8 - day) % 7 || 7);
    current.setDate(current.getDate() + delta);
  } else if (/(today|now)/.test(lower)) {
    return currentDate;
  } else {
    current.setDate(current.getDate() + 2);
  }
  return current.toISOString().slice(0, 10);
}

export function parseOperationalNote(
  rawNote: string,
  zones: Zone[],
  currentDate = "2026-08-23",
): AgentObservationDraft {
  const matchedZone = zones.find((zone) =>
    rawNote.toLowerCase().includes(zone.name.toLowerCase()),
  );
  const category = inferCategory(rawNote);
  const severity = inferSeverity(rawNote);
  const missingInformation: string[] = [];

  if (!matchedZone) {
    missingInformation.push("No exact zone match was found in the current farm layout.");
  }
  if (!/\b\d+\b/.test(rawNote) && /applied|bags|rows|hours/i.test(rawNote)) {
    missingInformation.push("Quantity details may need confirmation before saving.");
  }

  const zoneLabel = matchedZone?.name || "Unassigned zone";
  const observationTitle = `${zoneLabel}: ${category
    .replace(/\b\w/g, (letter) => letter.toUpperCase())} follow-up`;
  const dueDate = inferDueDate(rawNote, currentDate);

  return {
    suggestedZoneId: matchedZone?.id,
    suggestedZoneName: matchedZone?.name,
    observationTitle,
    category,
    severity,
    followUpTask: {
      title:
        category === "pest"
          ? `Scout ${zoneLabel} for expanded pest pressure`
          : category === "irrigation"
            ? `Recheck water delivery in ${zoneLabel}`
            : `Follow up on ${category} note in ${zoneLabel}`,
      priority: inferPriority(severity),
      dueDate,
    },
    confidenceNote: matchedZone
      ? "Zone matched from the farm layout and note language."
      : "Draft inferred from note language only. Review zone assignment before saving.",
    missingInformation,
  };
}

export function generateWeeklyPlanner(
  zones: Zone[],
  observations: Observation[],
  tasks: Task[],
): WeeklyPlannerOutput {
  const unresolvedIssues = observations.filter((item) => item.status !== "resolved");
  const dueSoonTasks = tasks
    .filter((task) => task.status !== "done")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);

  const zoneScores = zones.map((zone) => {
    const zoneIssues = unresolvedIssues.filter((item) => item.zoneId === zone.id);
    const zoneTasks = tasks.filter((task) => task.zoneId === zone.id && task.status !== "done");
    const score =
      zoneIssues.reduce(
        (sum, item) => sum + (item.severity === "high" ? 3 : item.severity === "medium" ? 2 : 1),
        0,
      ) +
      zoneTasks.reduce(
        (sum, task) => sum + (task.priority === "urgent" ? 3 : task.priority === "high" ? 2 : 1),
        0,
      );

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      score,
      priority: (score >= 5 ? "urgent" : score >= 3 ? "high" : "medium") as TaskPriority,
      reason:
        zoneIssues.length > 0
          ? `${zoneIssues.length} unresolved issue${zoneIssues.length > 1 ? "s" : ""} and ${zoneTasks.length} active task${zoneTasks.length === 1 ? "" : "s"}.`
          : `${zoneTasks.length} active task${zoneTasks.length === 1 ? "" : "s"} with no new issues logged.`,
    };
  });

  const rankedZones = zoneScores.filter((zone) => zone.score > 0).sort((a, b) => b.score - a.score);
  const highRiskZones = rankedZones.filter((zone) => zone.score >= 4).map((zone) => zone.zoneName);

  return {
    summary:
      rankedZones.length > 0
        ? `${rankedZones[0].zoneName} leads this week's workload, with ${highRiskZones.length > 1 ? "multiple zones also carrying elevated risk" : "the rest of the farm relatively stable"}.`
        : "The farm looks stable this week, with no unresolved issues or overdue task clusters.",
    topPriorities: rankedZones.slice(0, 5).map((zone) => ({
      zoneId: zone.zoneId,
      zoneName: zone.zoneName,
      reason: zone.reason,
      priority: zone.priority,
    })),
    dueSoonTasks,
    unresolvedIssues,
    highRiskZones,
  };
}

export function detectZoneGaps(
  zones: Zone[],
  observations: Observation[],
  tasks: Task[],
): GapAlert[] {
  return zones
    .flatMap((zone) => {
      const zoneObservations = observations.filter((item) => item.zoneId === zone.id);
      const zoneTasks = tasks.filter((item) => item.zoneId === zone.id);
      const hasRecentObservation = zoneObservations.some((item) => item.observedAt >= "2026-08-20");
      const overdueTask = zoneTasks.find((item) => item.status !== "done" && item.dueDate < "2026-08-23");

      const alerts: GapAlert[] = [];
      if (!hasRecentObservation) {
        alerts.push({
          zoneId: zone.id,
          zoneName: zone.name,
          message: "No recent field observation has been logged in the last three days.",
          severity: "medium",
        });
      }
      if (overdueTask) {
        alerts.push({
          zoneId: zone.id,
          zoneName: zone.name,
          message: `Task overdue: ${overdueTask.title}.`,
          severity: overdueTask.priority === "urgent" ? "high" : "medium",
        });
      }
      return alerts;
    })
    .sort((a, b) => (a.severity === "high" ? -1 : 1) - (b.severity === "high" ? -1 : 1));
}
