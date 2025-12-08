"use client";

import { useState, useEffect } from "react";
import { X, Clock, Calendar, CheckCircle2, AlertCircle, Plus, Link as LinkIcon, User } from "lucide-react";
import { getStaffDetail, getStaffAttendanceHistory, getStaffActivityTimeline, getStaffActiveTasks } from "@/app/actions/staff-details";
import { createTask, getStaffList } from "@/app/actions/tasks";
import { FileUpload } from "./file-upload";

interface StaffDetailDialogProps {
    isOpen: boolean;
    onClose: () => void;
    staffId: number | null;
}

interface StaffDetail {
    id: number;
    name: string;
    email: string;
    role: string;
    todayCheckIn: Date | null;
    todayCheckOut: Date | null;
    isCheckedIn: boolean;
    lastActivity: string | null;
    lastActivityTime: Date | null;
}

export function StaffDetailDialog({ isOpen, onClose, staffId }: StaffDetailDialogProps) {
    const [staffDetail, setStaffDetail] = useState<StaffDetail | null>(null);
    const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
    const [activityTimeline, setActivityTimeline] = useState<any[]>([]);
    const [activeTasks, setActiveTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAssignTask, setShowAssignTask] = useState(false);

    // Task form state
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskPriority, setTaskPriority] = useState("normal");
    const [taskDueDate, setTaskDueDate] = useState("");
    const [taskFileUrl, setTaskFileUrl] = useState("");

    useEffect(() => {
        if (isOpen && staffId) {
            loadStaffData();
        }
    }, [isOpen, staffId]);

    const loadStaffData = async () => {
        if (!staffId) return;

        setLoading(true);
        try {
            const [detail, attendance, timeline, tasks] = await Promise.all([
                getStaffDetail(staffId),
                getStaffAttendanceHistory(staffId, 7),
                getStaffActivityTimeline(staffId),
                getStaffActiveTasks(staffId),
            ]);

            setStaffDetail(detail);
            setAttendanceHistory(attendance);
            setActivityTimeline(timeline);
            setActiveTasks(tasks);
        } catch (error) {
            console.error("Error loading staff data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!staffId) return;

        try {
            await createTask({
                title: taskTitle,
                description: taskDescription,
                priority: taskPriority,
                dueDate: taskDueDate,
                fileUrl: taskFileUrl,
                assignedTo: staffId,
            });

            // Reset form
            setTaskTitle("");
            setTaskDescription("");
            setTaskPriority("normal");
            setTaskDueDate("");
            setTaskFileUrl("");
            setShowAssignTask(false);

            // Reload tasks
            const tasks = await getStaffActiveTasks(staffId);
            setActiveTasks(tasks);
        } catch (error) {
            console.error("Error assigning task:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
                {loading ? (
                    <div className="p-12 text-center text-slate-500">Loading staff details...</div>
                ) : !staffDetail ? (
                    <div className="p-12 text-center text-slate-500">Staff not found</div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {staffDetail.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{staffDetail.name}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{staffDetail.role}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`w-2 h-2 rounded-full ${staffDetail.isCheckedIn ? 'bg-green-500' : 'bg-slate-400'}`} />
                                        <span className="text-xs text-slate-600 dark:text-slate-400">
                                            {staffDetail.isCheckedIn ? 'Currently Online' : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Today's Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-900/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm font-medium">Check-in Time</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {staffDetail.todayCheckIn
                                            ? new Date(staffDetail.todayCheckIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                                            : 'Not checked in'}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-900/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 mb-2">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm font-medium">Check-out Time</span>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {staffDetail.todayCheckOut
                                            ? new Date(staffDetail.todayCheckOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                                            : 'Not checked out'}
                                    </p>
                                </div>
                            </div>

                            {/* Last Activity */}
                            {staffDetail.lastActivity && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-2">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm font-medium">Latest Activity</span>
                                    </div>
                                    <p className="text-slate-900 dark:text-white font-medium">{staffDetail.lastActivity}</p>
                                    {staffDetail.lastActivityTime && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            {new Date(staffDetail.lastActivityTime).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Activity Timeline */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Today's Activity Timeline
                                </h3>
                                {activityTimeline.length === 0 ? (
                                    <p className="text-sm text-slate-500 text-center py-8">No activity recorded today</p>
                                ) : (
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {activityTimeline.map((activity, index) => (
                                            <div key={activity.id} className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                    {index < activityTimeline.length - 1 && (
                                                        <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-1" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.activity}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Attendance History */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Attendance History (Last 7 Days)</h3>
                                <div className="grid grid-cols-7 gap-2">
                                    {attendanceHistory.map((record) => (
                                        <div key={record.date} className="text-center">
                                            <div className={`aspect-square rounded-lg flex items-center justify-center ${record.checkIn
                                                ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-900/50'
                                                : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
                                                }`}>
                                                {record.checkIn ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                ) : (
                                                    <X className="w-5 h-5 text-slate-400" />
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                {new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Active Tasks */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Active Tasks ({activeTasks.length})</h3>
                                    <button
                                        onClick={() => setShowAssignTask(!showAssignTask)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Assign Task
                                    </button>
                                </div>

                                {/* Assign Task Form */}
                                {showAssignTask && (
                                    <form onSubmit={handleAssignTask} className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Task Title"
                                            value={taskTitle}
                                            onChange={(e) => setTaskTitle(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm"
                                            required
                                        />
                                        <textarea
                                            placeholder="Description"
                                            value={taskDescription}
                                            onChange={(e) => setTaskDescription(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm"
                                            rows={3}
                                        />
                                        <div className="flex gap-3">
                                            <select
                                                value={taskPriority}
                                                onChange={(e) => setTaskPriority(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm"
                                            >
                                                <option value="normal">Normal</option>
                                                <option value="high">High Priority</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                            <input
                                                type="date"
                                                value={taskDueDate}
                                                onChange={(e) => setTaskDueDate(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm"
                                            />
                                        </div>
                                        <FileUpload onUploadComplete={(url) => setTaskFileUrl(url)} />
                                        <button
                                            type="submit"
                                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Assign Task
                                        </button>
                                    </form>
                                )}

                                {/* Tasks List */}
                                {activeTasks.length === 0 ? (
                                    <p className="text-sm text-slate-500 text-center py-8">No active tasks</p>
                                ) : (
                                    <div className="space-y-2">
                                        {activeTasks.map((task) => (
                                            <div key={task.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-slate-900 dark:text-white">{task.title}</h4>
                                                        {task.description && (
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{task.description}</p>
                                                        )}
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${task.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                                                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                        }`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                    {task.dueDate && (
                                                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                                    )}
                                                    {task.priority && (
                                                        <span className="capitalize">Priority: {task.priority}</span>
                                                    )}
                                                    {task.fileUrl && (
                                                        <a href={task.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                                            <LinkIcon className="w-3 h-3" />
                                                            Attachment
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
