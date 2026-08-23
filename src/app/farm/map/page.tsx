import { MapEditor } from "@/components/field-signals/map-editor";
import { ProtectedShell } from "@/components/field-signals/shell";

export default function FarmMapPage() {
  return (
    <ProtectedShell
      title="Farm map and zone layer"
      description="Use the uploaded map as a lightweight spatial layer so every note, issue, and task belongs to a named field zone."
    >
      <MapEditor />
    </ProtectedShell>
  );
}
