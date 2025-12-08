"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, FileText, CheckCircle2, Clock, Target, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/file-upload";
import { getAllStaffStatus } from "@/app/actions/attendance";
import { logoutAction, changePasswordAction } from "@/app/actions/auth";
import { createTask, getStaffList } from "@/app/actions/tasks";
import { getLiveOverview } from "@/app/actions/overview";
import { getAllReports } from "@/app/actions/reports";

export default function PartnerDashboard() {
    const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'assign' | 'profile'>('overview');

    // Data State
    const [overviewData, setOverviewData] = useState<any>(null);
    const [reportsData, setReportsData] = useState<any[]>([]);

    // Fetch Data Functions
    const fetchOverview = async () => {
        try {
            const data = await getLiveOverview();
            if (data) {
                setOverviewData(data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Failed to load overview data");
            setLoading(false);
        }
    };
    const fetchReports = async () => {
        try {
            const data = await getAllReports();
            setReportsData(data);
        } catch (error) {
            console.error("Failed to load reports");
        }
    };

    // Effect for polling and initial load
    useEffect(() => {
        if (activeTab === 'overview') {
            fetchOverview();
            const interval = setInterval(fetchOverview, 10000);
            return () => clearInterval(interval);
        } else if (activeTab === 'reports') {
            fetchReports();
            // Optional: Poll reports? Maybe less frequent or just on mount
        }
    }, [activeTab]);

    const handleLogout = async () => {
        await logoutAction();
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">Loading Partner Activity Center...</div>;

    const activeStaffCount = overviewData?.stats?.presentCount || 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Partner Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time overview of office activity</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeStaffCount > 0 ? 'bg-green-400' : 'bg-slate-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${activeStaffCount > 0 ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                            </span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {activeStaffCount} Active & Online
                            </span>
                        </div>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                            }`}
                    >
                        Live Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'reports'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                            }`}
                    >
                        Daily Reports
                    </button>
                    <button
                        onClick={() => setActiveTab('assign')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'assign'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                            }`}
                    >
                        Assign Task
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'profile'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                            }`}
                    >
                        My Profile
                    </button>
                </div>

                {/* Content Area */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Staff List */}
                        {/* Staff List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Staff Activity</h3>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                        Auto-refreshing
                                    </span>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {(!overviewData?.staffStatus || overviewData.staffStatus.length === 0) ? (
                                        <div className="p-8 text-center text-slate-500">No staff activity found.</div>
                                    ) : (
                                        overviewData.staffStatus.map((staff: any) => (
                                            <div
                                                key={staff.id}
                                                // onClick={() => setSelectedStaff(staff.id)} // Optional: detailed view later
                                                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${staff.isCheckedIn ? "bg-green-50/10" : ""}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="relative">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${staff.isCheckedIn ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                                                                }`}>
                                                                {staff.name.charAt(0)}
                                                            </div>
                                                            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white dark:border-slate-900 rounded-full ${staff.isCheckedIn ? 'bg-green-500' : 'bg-slate-400'
                                                                }`}></div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-slate-900 dark:text-white">
                                                                {staff.name}
                                                            </h4>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{staff.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-sm font-medium ${staff.isCheckedIn ? 'text-green-600 dark:text-green-400' : 'text-slate-500'
                                                            }`}>
                                                            {staff.isCheckedIn ? 'Online' : 'Offline'}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-1">
                                                            {staff.checkInTime
                                                                ? `In: ${new Date(staff.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                                : 'Not checked in'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Current Activity Preview */}
                                                <div className="mt-3 pl-14">
                                                    <div className="inline-flex items-center text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                                        <Target className="w-3.5 h-3.5 mr-2 text-blue-500" />
                                                        {staff.lastActivity}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Detail View / Stats Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                                <h3 className="font-semibold text-lg mb-1">Quick Actions</h3>
                                <p className="text-indigo-100 text-sm mb-6">Manage office operations</p>

                                <div className="space-y-3">
                                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors text-left px-4 flex items-center">
                                        <FileText className="w-4 h-4 mr-3" />
                                        Request All Reports
                                    </button>
                                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors text-left px-4 flex items-center">
                                        <Bell className="w-4 h-4 mr-3" />
                                        Send Announcement
                                    </button>
                                </div>
                            </div>

                            {/* Today's Stats */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Today's Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Staff Present</span>
                                        <span className="font-medium text-green-600 dark:text-green-400">{overviewData?.stats?.presentCount || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Reports Submitted</span>
                                        <span className="font-medium text-slate-900 dark:text-white">{overviewData?.stats?.reportsSubmittedCount || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Tasks Completed</span>
                                        <span className="font-medium text-slate-900 dark:text-white">{overviewData?.stats?.tasksCompletedToday || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'assign' && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 max-w-2xl">
                        <h2 className="text-xl font-semibold mb-6">Assign New Task</h2>
                        <TaskAssignmentForm />
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 max-w-2xl">
                        <h2 className="text-xl font-semibold mb-6">My Profile</h2>
                        <ChangePasswordForm />
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Daily Activity Reports</h2>
                        <div className="grid gap-4">
                            {reportsData.length === 0 ? (
                                <p className="text-slate-500">No reports found.</p>
                            ) : (
                                reportsData.map((report) => (
                                    <div key={report.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{report.userName}</h4>
                                                <p className="text-xs text-slate-500">Date: {new Date(report.date).toLocaleDateString()}</p>
                                            </div>
                                            <span className="text-xs font-mono text-slate-400">
                                                {new Date(report.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                            {report.summary}
                                        </div>
                                        {report.tasksCompleted > 0 && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                                                    {report.tasksCompleted} Tasks Completed
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ChangePasswordForm() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [isError, setIsError] = useState(false);

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setMsg("");
        setIsError(false);

        const result = await changePasswordAction(formData);

        if (result.success) {
            setMsg("Password updated successfully!");
        } else {
            setMsg("Error: " + (result.error || "Unknown error"));
            setIsError(true);
        }
        setLoading(false);
    }

    return (
        <form action={onSubmit} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input type="password" name="current" className="w-full p-2 border rounded" required />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input type="password" name="new" className="w-full p-2 border rounded" required />
            </div>
            <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                {loading ? "Updating..." : "Update Password"}
            </button>
            {msg && <p className={`text-sm mt-2 ${isError ? "text-red-500" : "text-green-500"}`}>{msg}</p>}
        </form>
    )
}

function TaskAssignmentForm() {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        getStaffList()
            .then(data => {
                console.log("Fetched staff:", data);
                setStaff(data);
            })
            .catch(err => {
                console.error("Failed to fetch staff:", err);
                setMsg("Failed to load staff list.");
                setIsError(true);
            });
    }, []);

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setMsg("");
        setIsError(false);

        const assignedTo = formData.get("assignedTo");
        if (!assignedTo || assignedTo.toString() === "") {
            setMsg("Please select a staff member to assign the task to.");
            setIsError(true);
            setLoading(false);
            return;
        }

        try {
            const result = await createTask(formData);

            if (result.success) {
                setMsg("Task assigned successfully!");
                // Reset the form manually
                const form = document.getElementById("assign-task-form") as HTMLFormElement;
                if (form) form.reset();
            } else {
                setMsg("Error: " + (result.error || "Unknown error"));
                setIsError(true);
            }
        } catch (e) {
            console.error("Task Submit Error:", e);
            setMsg("An unexpected error occurred.");
            setIsError(true);
        }
        setLoading(false);
    }

    return (
        <form id="assign-task-form" action={onSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Task Title</label>
                <input name="title" type="text" required placeholder="e.g. Audit Report for Client X"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Assign To</label>
                    <select name="assignedTo" required defaultValue=""
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="" disabled>Select Staff</option>
                        {staff.length === 0 ? (
                            <option value="" disabled>No staff found</option>
                        ) : (
                            staff.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                            ))
                        )}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Deadline</label>
                    <input name="deadline" type="date"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Description (Optional)</label>
                <textarea name="description" rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Attach File (Optional)</label>
                <input type="file" name="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400" />
            </div>

            <button disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                {loading ? "Assigning..." : "Assign Task"}
            </button>

            {msg && (
                <div className={`p-3 rounded-lg text-sm ${isError ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"}`}>
                    {msg}
                </div>
            )}
        </form>
    );
}
