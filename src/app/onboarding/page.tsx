import { OnboardingForm } from "@/components/field-signals/forms";
import { ProtectedShell } from "@/components/field-signals/shell";

export default function OnboardingPage() {
  return (
    <ProtectedShell
      title="Farm setup"
      description="Create the farm profile, upload a field layout, and get khet ready for zone-based observations and weekly planning."
    >
      <OnboardingForm />
    </ProtectedShell>
  );
}
