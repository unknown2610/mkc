"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, AlertCircle, Calendar, Link as LinkIcon } from "lucide-react";
import { getStaffTasks } from "@/app/actions/tasks";

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: string;
    priority: string | null;
    dueDate: Date | null;
    fileUrl: string | null;
    createdAt: Date;
}

export function StaffTaskHistory() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all");

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        const data = await getStaffTasks();
        setTasks(data);
        setLoading(false);
    };

    const filteredTasks = filter === "all"
        ? tasks
        : tasks.filter(t => t.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'in-progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
            case 'review': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
            default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
        }
    };

    const getPriorityColor = (priority: string | null) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-slate-500">Loading tasks...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header with Statistics */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Task History</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">View all assigned tasks and their status</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Tasks</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{tasks.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'pending').length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'in-progress').length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {['all', 'pending', 'in-progress', 'completed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl borderorder-slate-200 dark:border-slate-800 p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No {filter !== 'all' ? filter : ''} tasks found</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        {task.title}
                                    </h4>
                                    {task.description && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {task.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {task.priority && (
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    )}
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(task.status)}`}>
                                        {task.status === 'in-progress' ? 'In Progress' : task.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
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
                                        <LinkIcon className="w-4 h-4" />
                                        Attachment
                                    </a>
                                )}

                                <span className="text-xs ml-auto">
                                    Created {new Date(task.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
