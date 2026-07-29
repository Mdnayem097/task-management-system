"use client";

import { useEffect, useState } from "react";
import TaskBoard from "@/components/tasks/TaskBoard";
import { Task, TaskStatus } from "@/types";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all tasks from API on page load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          setTasks(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 2. Create Task Handler
  const handleTaskCreate = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify(taskData),
        },
      );
      const data = await response.json();
      if (data.success) {
        setTasks((prev) => [data.data, ...prev]);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  // 3. Update Task Handler
  const handleTaskUpdate = async (id: string, taskData: Partial<Task>) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(taskData),
      });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // 4. Delete Task Handler
  const handleTaskDelete = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // 5. Status Change Handler (Drag & Drop)
  const handleTaskStatusChange = async (id: string, status: TaskStatus) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
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
        initialTasks={tasks}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskStatusChange={handleTaskStatusChange}
      />
    </main>
  );
}
