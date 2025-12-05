"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Send, CheckCircle, Clock, AlertCircle, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/file-upload";
import { getStaffState, toggleCheckIn, updateActivity } from "@/app/actions/attendance";
import { logoutAction, changePasswordAction } from "@/app/actions/auth";

export default function StaffDashboard() {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);
    const [lastActivity, setLastActivity] = useState("");
    const [activity, setActivity] = useState(""); // Input field state
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState<'daily' | 'tasks' | 'reports' | 'profile'>('daily');
    const [loading, setLoading] = useState(true);

    // Fetch initial state
    useEffect(() => {
        async function init() {
            try {
                const state = await getStaffState();
                setIsCheckedIn(state.isCheckedIn);
                setCheckInTime(state.checkInTime ? new Date(state.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null);
                setLastActivity(state.lastActivity);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    async function handleCheckIn() {
        setIsUpdating(true);
        try {
            const result = await toggleCheckIn();
            if (result.success) {
                setIsCheckedIn(!!result.isCheckedIn);
                setCheckInTime(result.checkInTime ? new Date(result.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null);
            }
        } catch (e) {
            console.error(e);
        }
        setIsUpdating(false);
    }

    async function handleStatusUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (!activity.trim()) return;

        setIsUpdating(true);
        try {
            const result = await updateActivity(activity);
            if (result.success) {
                setLastActivity(activity);
                setActivity("");
            }
        } catch (e) {
            console.error(e);
        }
        setIsUpdating(false);
    }

    const handleLogout = async () => {
        await logoutAction();
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Staff Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your day efficiently</p>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                        Logout
                    </button>
                </div>

                {/* Status Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${isCheckedIn ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                            <Clock className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {isCheckedIn ? "You are Checked In" : "You are Checked Out"}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                {isCheckedIn ? `Since ${checkInTime}` : "Start your day by checking in"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckIn}
                        disabled={isUpdating}
                        className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 ${isCheckedIn
                            ? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
                            : "bg-green-500 hover:bg-green-600 shadow-green-500/30"
                            }`}
                    >
                        {isCheckedIn ? "Check Out" : "Check In Now"}
                    </button>
                </div>

                {isCheckedIn && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-1 bg-slate-100 dark:bg-slate-800 m-2 rounded-xl flex">
                            <button
                                onClick={() => setActiveTab('daily')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'daily' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Current Activity
                            </button>
                            <button
                                onClick={() => setActiveTab('tasks')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'tasks' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                My Tasks
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Profile
                            </button>
                        </div>

                        <div className="p-8">
                            {activeTab === 'daily' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">What are you working on?</h3>
                                        <form onSubmit={handleStatusUpdate} className="flex gap-3">
                                            <input
                                                type="text"
                                                value={activity}
                                                onChange={(e) => setActivity(e.target.value)}
                                                placeholder="E.g., Working on GST Reconciliation..."
                                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!activity || isUpdating}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50"
                                            >
                                                Update
                                            </button>
                                        </form>
                                    </div>

                                    {lastActivity && (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
                                            <Coffee className="w-5 h-5 text-blue-600 mt-1" />
                                            <div>
                                                <p className="font-medium text-blue-900 dark:text-blue-100">Current Status</p>
                                                <p className="text-blue-700 dark:text-blue-300">{lastActivity}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'tasks' && (
                                <div className="text-center py-10 text-slate-500">
                                    Task list integration coming soon.
                                </div>
                            )}

                            {activeTab === 'profile' && (
                                <div className="max-w-md">
                                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                                    <ChangePasswordForm />
                                </div>
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
        <form action={onSubmit} className="space-y-4">
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
