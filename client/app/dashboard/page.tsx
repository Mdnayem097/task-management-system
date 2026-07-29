"use client";

import { useEffect, useState } from "react";
import TaskBoard from "@/components/tasks/TaskBoard";
import DeleteConfirmModal from "@/components/tasks/DeleteConfirmModal"; // 👈 Delete Modal Import
import { Task, TaskStatus } from "@/types";
import { Loader2 } from "lucide-react";
import API from "@/lib/axios";
import { toast } from "sonner";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔴 Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTaskToDelete, setSelectedTaskToDelete] = useState<Task | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await API.get("/tasks");
      const taskList: Task[] =
        response.data?.data?.tasks ||
        response.data?.tasks ||
        (Array.isArray(response.data) ? response.data : []);

      setTasks(taskList);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const response = await API.get("/tasks");
        const taskList: Task[] =
          response.data?.data?.tasks ||
          response.data?.tasks ||
          (Array.isArray(response.data) ? response.data : []);

        if (isMounted) setTasks(taskList);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast.error("Failed to load tasks!");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Create Task
  const handleTaskCreate = async (taskData: Partial<Task>) => {
    try {
      const response = await API.post("/tasks", taskData);
      const newTask: Task | undefined =
        response.data?.data?.task || response.data?.task || response.data?.data;

      if (newTask) {
        setTasks((prev) => [newTask, ...prev]);
        toast.success("Task created successfully!");
      } else {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Could not create task. Try again!");
    }
  };

  // 2. Update Task
  const handleTaskUpdate = async (id: string, taskData: Partial<Task>) => {
    try {
      const response = await API.patch(`/tasks/${id}`, taskData);
      const updatedTask: Task | undefined =
        response.data?.data?.task || response.data?.task || response.data?.data;

      if (updatedTask) {
        setTasks((prev) =>
          prev.map((t) => {
            const taskId = t._id || (t as Task & { id?: string }).id;
            return taskId === id ? updatedTask : t;
          }),
        );
        toast.success("Task updated successfully!");
      } else {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task!");
    }
  };

  // 3. Open Delete Confirmation Modal
  const handleOpenDeleteModal = async (id: string) => {
    const taskToDelete = tasks.find((t) => {
      const taskId = t._id || (t as Task & { id?: string }).id;
      return taskId === id;
    });

    if (taskToDelete) {
      setSelectedTaskToDelete(taskToDelete);
      setDeleteModalOpen(true);
    }
  };

  // 4. Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!selectedTaskToDelete) return;

    const id =
      selectedTaskToDelete._id ||
      (selectedTaskToDelete as Task & { id?: string }).id;

    if (!id) return;

    setIsDeleting(true);

    try {
      const response = await API.delete(`/tasks/${id}`);

      if (response.status === 200 || response.status === 204) {
        setTasks((prev) =>
          prev.filter((t) => {
            const taskId = t._id || (t as Task & { id?: string }).id;
            return taskId !== id;
          }),
        );
        toast.success("Task deleted successfully!");
      } else {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Could not delete task!");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedTaskToDelete(null);
    }
  };

  // 5. Status Change
  const handleTaskStatusChange = async (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        const taskId = t._id || (t as Task & { id?: string }).id;
        return taskId === id ? { ...t, status } : t;
      }),
    );

    try {
      await API.patch(`/tasks/${id}/status`, { status });
      toast.info(`Task status updated to ${status.replace("_", " ")}`);
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status!");
      fetchTasks();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage, reorder, and track your team projects efficiently.
        </p>
      </div>

      <TaskBoard
        key={tasks.length}
        initialTasks={tasks}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleOpenDeleteModal} // 👈 Modal Trigger
        onTaskStatusChange={handleTaskStatusChange}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={selectedTaskToDelete?.title}
      />
    </main>
  );
}
