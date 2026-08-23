"use client";

import { TaskCreateForm } from "@/components/field-signals/forms";
import { useFieldSignals } from "@/components/field-signals/provider";
import { ProtectedShell } from "@/components/field-signals/shell";
import { EmptyState, TaskTable } from "@/components/field-signals/shared";

export default function TasksPage() {
  const { state, updateTaskStatus, removeTask } = useFieldSignals();

  return (
    <ProtectedShell
      title="Task management"
      description="Review manual and agent-suggested work, update progress, and keep due dates visible by field zone."
    >
      <div className="space-y-4">
        <TaskCreateForm />
        {state.tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            body="Tasks created here or suggested from parsed observations will appear in this table."
          />
        ) : (
          <TaskTable
            tasks={[...state.tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate))}
            onStatusChange={updateTaskStatus}
            onDelete={removeTask}
          />
        )}
      </div>
    </ProtectedShell>
  );
}
