"use client";

import { useEffect, useState } from "react";
import TaskBoard from "@/components/tasks/TaskBoard";
import { Task, TaskStatus } from "@/types";
import { Loader2 } from "lucide-react";
import API from "@/lib/axios";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // ১. Reusable Fetch Function (Effect-এর ভেতর থেকে ও বাইরে থেকে নিরাপদে কল করার জন্য)
  const fetchTasks = async () => {
    try {
      const response = await API.get("/tasks");

      // Safe Response Extraction
      const taskList: Task[] =
        response.data?.data?.tasks ||
        response.data?.tasks ||
        (Array.isArray(response.data) ? response.data : []);

      setTasks(taskList);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch tasks on initial render safely
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const response = await API.get("/tasks");
        const taskList: Task[] =
          response.data?.data?.tasks ||
          response.data?.tasks ||
          (Array.isArray(response.data) ? response.data : []);

        if (isMounted) {
          setTasks(taskList);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Create Task Handler
  const handleTaskCreate = async (taskData: Partial<Task>) => {
    try {
      const response = await API.post("/tasks", taskData);

      const newTask: Task | undefined =
        response.data?.data?.task || response.data?.task || response.data?.data;

      if (newTask) {
        setTasks((prev) => [newTask, ...prev]);
      } else {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  // 4. Update Task Handler
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
      } else {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // 5. Delete Task Handler
  const handleTaskDelete = async (id: string) => {
    try {
      const response = await API.delete(`/tasks/${id}`);

      if (response.status === 200 || response.status === 204) {
        setTasks((prev) =>
          prev.filter((t) => {
            const taskId = t._id || (t as Task & { id?: string }).id;
            return taskId !== id;
          }),
        );
      } else {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // 6. Status Change Handler (Optimistic Drag and Drop)
  const handleTaskStatusChange = async (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        const taskId = t._id || (t as Task & { id?: string }).id;
        return taskId === id ? { ...t, status } : t;
      }),
    );

    try {
      await API.patch(`/tasks/${id}/status`, { status });
    } catch (error) {
      console.error("Failed to update task status:", error);
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
        onTaskDelete={handleTaskDelete}
        onTaskStatusChange={handleTaskStatusChange}
      />
    </main>
  );
}
