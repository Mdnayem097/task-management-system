"use client";

import { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types";
import { X, Calendar, Flag, AlignLeft, Type, Loader2 } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  initialData?: Task | null;
  isLoading?: boolean;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: TaskModalProps) {
  // 1. ALL Hooks must be called unconditionally at the top
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialData?.priority || "MEDIUM",
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialData?.status || "TODO",
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : "",
  );

  // 2. Early return AFTER all hooks have been called
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-base font-bold text-gray-900">
            {initialData ? "Edit Task" : "Create New Task"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Task Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Design Landing Page Wireframes"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this task..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <div className="relative">
                <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all appearance-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {isLoading && <Loader2 className="animate-spin h-3.5 w-3.5" />}
              {initialData ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
