"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, FileText, CheckCircle2, Clock, Target, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/file-upload";
import { getAllStaffStatus } from "@/app/actions/attendance";
import { logoutAction, changePasswordAction } from "@/app/actions/auth";

export default function PartnerDashboard() {
    const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'upload' | 'profile'>('overview');

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
                        onClick={() => setActiveTab('upload')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'upload'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                            }`}
                    >
                        File Upload
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
                                                onClick={() => setSelectedStaff(staff.id)}
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
                                                            {staff.status === 'online' ? `Since ${staff.lastUpdate}` : `Last seen ${staff.lastUpdate}`}
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
                                        <span className="text-slate-500">Avg. Check-in Time</span>
                                        <span className="font-medium text-slate-900 dark:text-white">10:14 AM</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Reports Submitted</span>
                                        <span className="font-medium text-slate-900 dark:text-white">12 / 18</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Tasks Completed</span>
                                        <span className="font-medium text-slate-900 dark:text-white">45</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'upload' && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                        <h2 className="text-xl font-semibold mb-6">Upload Documents</h2>
                        <FileUpload />
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 max-w-2xl">
                        <h2 className="text-xl font-semibold mb-6">My Profile</h2>
                        <ChangePasswordForm />
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center text-slate-500">
                        Reports module coming soon...
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
