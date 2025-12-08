"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, FileText, CheckCircle2, Clock, Target, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/file-upload";
import { getAllStaffStatus, getUserInfo } from "@/app/actions/attendance";
import { logoutAction, changePasswordAction } from "@/app/actions/auth";
import { createTask, getStaffList } from "@/app/actions/tasks";
import TaskHistory from "@/components/TaskHistory";
import DailyReportsView from "@/components/DailyReportsView";
import { StaffDetailDialog } from "@/components/StaffDetailDialog";
import { QuickActionsPanel } from "@/components/QuickActionsPanel";
import { TodaysOverview } from "@/components/TodaysOverview";
import { CAOfficeMenu } from "@/components/CAOfficeMenu";

export default function PartnerDashboard() {
    const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'assign' | 'history' | 'profile'>('overview');
    const [userName, setUserName] = useState("");

    // Staff Detail Dialog state
    const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
    const [showStaffDetail, setShowStaffDetail] = useState(false);

    // Fetch Staff Data
    const fetchStaffData = async () => {
        try {
            const data = await getAllStaffStatus();
            setStaffList(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load staff data");
        }
    };

    // Poll for updates every 10 seconds
    useEffect(() => {
        if (activeTab === 'overview') {
            fetchStaffData();
            // Fetch user name from session
            (async () => {
                const userInfo = await getUserInfo();
                if (userInfo.name) setUserName(userInfo.name);
            })();
            const interval = setInterval(fetchStaffData, 10000);
            return () => clearInterval(interval);
        }
    }, [activeTab]);

    const handleLogout = async () => {
        await logoutAction();
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">Loading Partner Activity Center...</div>;

    const activeStaffCount = staffList.filter(s => s.status === 'online').length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{userName ? `${userName}'s Dashboard` : 'Partner Dashboard'}</h1>
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
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'history'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                            }`}
                    >
                        Task History
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
                    <button
                        onClick={() => setActiveTab('office')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'office'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                            }`}
                    >
                        Office
                    </button>
                </div>

                {/* Content Area */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                    {staffList.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500">No staff members found.</div>
                                    ) : (
                                        staffList.map((staff) => (
                                            <div
                                                key={staff.id}
                                                onClick={() => {
                                                    setSelectedStaffId(staff.id);
                                                    setShowStaffDetail(true);
                                                }}
                                                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group ${selectedStaff === staff.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="relative">
                                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium">
                                                                {staff.name.charAt(0)}
                                                            </div>
                                                            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white dark:border-slate-900 rounded-full ${staff.status === 'online' ? 'bg-green-500' : 'bg-slate-400'
                                                                }`}></div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                {staff.name}
                                                            </h4>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{staff.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-sm font-medium ${staff.status === 'online' ? 'text-green-600 dark:text-green-400' : 'text-slate-500'
                                                            }`}>
                                                            {staff.status === 'online' ? 'Online' : 'Offline'}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-1">
                                                            {staff.status === 'online'
                                                                ? `Since ${staff.lastUpdate ? new Date(staff.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}`
                                                                : `Last seen ${staff.lastUpdate ? new Date(staff.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}`
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Current Activity Preview */}
                                                <div className="mt-3 pl-14">
                                                    <div className="inline-flex items-center text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                                        <Target className="w-3.5 h-3.5 mr-2 text-blue-500" />
                                                        {staff.activity}
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
                            {/* Today's Overview */}
                            <TodaysOverview />
                        </div>
                    </div>
                )}

                {activeTab === 'assign' && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 max-w-2xl">
                        <h2 className="text-xl font-semibold mb-6">Assign New Task</h2>
                        <TaskAssignmentForm />
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                        <TaskHistory />
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 max-w-2xl">
                        <h2 className="text-xl font-semibold mb-6">My Profile</h2>
                        <ChangePasswordForm />
                    </div>
                )}

                {activeTab === 'reports' && (
                    <DailyReportsView />
                )}
            </div>

            {/* Staff Detail Dialog */}
            <StaffDetailDialog
                isOpen={showStaffDetail}
                onClose={() => setShowStaffDetail(false)}
                staffId={selectedStaffId}
            />
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
    const formRef = useState<HTMLFormElement | null>(null); // Actually let's use a simpler ref approach or reset form via key

    useEffect(() => {
        getStaffList().then(setStaff);
    }, []);

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setMsg("");
        setIsError(false);

        // Manual validation if needed, but required props handle mostly
        const result = await createTask(formData);

        if (result.success) {
            setMsg("Task assigned successfully!");
            // Reset form could be handled by key reset or other means. For now simpler message.
        } else {
            setMsg("Error: " + (result.error || "Unknown error"));
            setIsError(true);
        }
        setLoading(false);
    }

    return (
        <form action={onSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Task Title</label>
                <input name="title" type="text" required placeholder="e.g. Audit Report for Client X"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Assign To</label>
                    <select name="assignedTo" required
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">Select Staff</option>
                        {staff.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                        ))}
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
