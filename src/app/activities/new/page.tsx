import { ActivityForm } from "@/components/field-signals/forms";
import { ProtectedShell } from "@/components/field-signals/shell";

export default function NewActivityPage() {
  return (
    <ProtectedShell
      title="Completed work log"
      description="Track finished work by zone so the weekly planner can distinguish open risk from work already handled by the crew."
    >
      <ActivityForm />
    </ProtectedShell>
  );
}
