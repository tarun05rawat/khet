import { AgentParsePanel, ObservationForm } from "@/components/field-signals/forms";
import { ProtectedShell } from "@/components/field-signals/shell";

export default function NewObservationPage() {
  return (
    <ProtectedShell
      title="Observation logging"
      description="Log scouting notes directly or run them through the review-first parser before saving them into the farm record."
    >
      <div className="space-y-4">
        <AgentParsePanel />
        <ObservationForm />
      </div>
    </ProtectedShell>
  );
}
