"use client";

import { Task, TaskStatus } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const statusBadgeColor: Record<TaskStatus, string> = {
  TODO: "bg-slate-200 text-slate-700",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

export default function KanbanColumn({
  id,
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col bg-gray-50/80 rounded-2xl border border-gray-200/80 p-4 h-full min-h-[500px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-sm tracking-wide">
            {title}
          </h3>
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadgeColor[id]}`}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(id)}
          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Add new task to this column"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Task List / Droppable Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-3 transition-colors rounded-xl p-1 ${
          isOver ? "bg-indigo-50/40 ring-2 ring-indigo-300 ring-dashed" : ""
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400">
            <p className="text-xs font-medium">No tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
