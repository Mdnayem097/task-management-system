"use client";

import { Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  Edit2,
  Trash2,
  GripVertical,
  AlertCircle,
} from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityConfig = {
  LOW: {
    label: "Low",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  MEDIUM: {
    label: "Medium",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  HIGH: { label: "High", bg: "bg-rose-50 text-rose-700 border-rose-200" },
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const taskId = task._id || (task as Task & { id?: string }).id || "";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskId,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityStyle = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(taskId); 
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all ${
        isDragging ? "opacity-40 ring-2 ring-indigo-500/30" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Title & Priority Badge */}
        <div className="flex-1 min-w-0">
          <span
            className={`inline-block px-2 py-0.5 text-[10px] font-semibold border rounded-md mb-2 ${priorityStyle.bg}`}
          >
            {priorityStyle.label}
          </span>
          <h4 className="font-semibold text-gray-800 text-sm leading-snug break-words">
            {task.title}
          </h4>
        </div>

        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-1 -mr-1 rounded"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer / Actions */}
      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
        {/* Due Date */}
        {task.dueDate ? (
          <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-gray-300 text-[11px]">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>No date</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="Edit Task"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Delete Task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}