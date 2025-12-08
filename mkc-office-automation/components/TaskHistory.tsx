"use client";

import { useState, useEffect } from "react";
import { Trash2, Calendar, User, FileText, AlertCircle } from "lucide-react";
import { cancelTask, getPartnerTasks } from "@/app/actions/partner-tasks";

interface Task {
    id: number;
    title: string;
    description: string | null;
    dueDate: string | null;
    priority: string | null;
    status: string;
    fileUrl: string | null;
    createdAt: Date;
    assignedToUser?: {
        name: string;
        email: string;
        role: string;
    };
}

export default function TaskHistory() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch tasks
    const fetchTasks = async () => {
        setLoading(true);
        setError("");
        const result = await getPartnerTasks();
        if (result.success) {
            setTasks(result.tasks as Task[]);
        } else {
            setError(result.error || "Failed to load tasks");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Handle cancel task
    const handleCancelTask = async (taskId: number, taskTitle: string) => {
        if (!confirm(`Are you sure you want to cancel the task "${taskTitle}"? This cannot be undone.`)) {
            return;
        }

        const result = await cancelTask(taskId);
        if (result.success) {
            // Remove from UI
            setTasks(tasks.filter(t => t.id !== taskId));
        } else {
            alert(result.error || "Failed to cancel task");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">Loading task history...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-red-500 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No tasks assigned yet.</p>
                <p className="text-sm text-slate-400 mt-1">Tasks you assign will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Task History ({tasks.length})
                </h2>
            </div>

            <div className="space-y-3">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                                {/* Title and Priority */}
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                                        {task.title}
                                    </h3>
                                    {task.priority && (
                                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                                task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    )}
                                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                task.status === 'review' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {task.status === 'in-progress' ? 'In Progress' : task.status}
                                    </span>
                                </div>

                                {/* Description */}
                                {task.description && (
                                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                                        {task.description}
                                    </p>
                                )}

                                {/* Metadata */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                    {task.assignedToUser && (
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-4 h-4" />
                                            <span>{task.assignedToUser.name}</span>
                                        </div>
                                    )}
                                    {task.dueDate && (
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {task.fileUrl && (
                                        <a
                                            href={task.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            <FileText className="w-4 h-4" />
                                            View Attachment
                                        </a>
                                    )}
                                    <span className="text-xs">
                                        Created: {new Date(task.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Cancel Button */}
                            <button
                                onClick={() => handleCancelTask(task.id, task.title)}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Cancel Task"
                            >
                                <Trash2 className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
