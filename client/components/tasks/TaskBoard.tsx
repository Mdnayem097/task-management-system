"use client";

import { useState } from "react";
import { Task, TaskStatus, TaskPriority } from "@/types";
import KanbanColumn from "./KanbanColumn";
import TaskModal from "./TaskModal";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { Plus, Search, Filter } from "lucide-react";

interface TaskBoardProps {
  initialTasks: Task[];
  onTaskCreate: (task: Partial<Task>) => Promise<void>;
  onTaskUpdate: (id: string, task: Partial<Task>) => Promise<void>;
  onTaskDelete: (id: string) => Promise<void>;
  onTaskStatusChange: (id: string, status: TaskStatus) => Promise<void>;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "COMPLETED", title: "Completed" },
];

export default function TaskBoard({
  initialTasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTaskStatusChange,
}: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === "ALL" || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Handle Drag Start
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id);
    if (task) setActiveTask(task);
  };

  // Handle Drag End
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropped over a column
    let newStatus: TaskStatus | null = null;

    if (["TODO", "IN_PROGRESS", "COMPLETED"].includes(overId)) {
      newStatus = overId as TaskStatus;
    } else {
      // Dropped over another task
      const overTask = tasks.find((t) => t._id === overId);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus) {
      const currentTask = tasks.find((t) => t._id === taskId);
      if (currentTask && currentTask.status !== newStatus) {
        // Optimistic UI Update
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId ? { ...t, status: newStatus! } : t,
          ),
        );
        await onTaskStatusChange(taskId, newStatus);
      }
    }
  };

  // Modal Handlers
  const handleOpenCreateModal = (defaultStatus?: TaskStatus) => {
    setEditingTask(defaultStatus ? ({ status: defaultStatus } as Task) : null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData: Partial<Task>) => {
    setIsSubmitting(true);
    try {
      if (editingTask?._id) {
        await onTaskUpdate(editingTask._id, formData);
        setTasks((prev) =>
          prev.map((t) =>
            t._id === editingTask._id ? { ...t, ...formData } : t,
          ),
        );
      } else {
        await onTaskCreate(formData);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      await onTaskDelete(taskId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>

        {/* Priority Filter & Create Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-700 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <button
            onClick={() => handleOpenCreateModal()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Drag and Drop Context / Kanban Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={filteredTasks.filter((t) => t.status === col.id)}
              onAddTask={handleOpenCreateModal}
              onEditTask={handleOpenEditModal}
              onDeleteTask={handleDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Create / Edit Modal */}
      <TaskModal
        key={editingTask?._id || "new-task"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTask}
        isLoading={isSubmitting}
      />
    </div>
  );
}
