"use client";

import { useState, useEffect } from "react";

import { Play, Pause, Send, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Tasks
const MOCK_TASKS = [
    { id: 1, title: "Prepare GST Return for Client A", deadline: "2024-12-10", status: "pending", priority: "high" },
    { id: 2, title: "Audit Report Review", deadline: "2024-12-12", status: "in-progress", priority: "medium" },
];

export default function StaffDashboard() {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<Date | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activity, setActivity] = useState("");
    const [isActivitySaved, setIsActivitySaved] = useState(true);

    // Update clock
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleCheckIn = () => {
        setIsCheckedIn(!isCheckedIn);
        if (!isCheckedIn) {
            setCheckInTime(new Date());
        }
    };

    const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setActivity(e.target.value);
        setIsActivitySaved(false);
    };

    const saveActivity = () => {
        // API Call would go here
        setIsActivitySaved(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Good Afternoon, Arjun</h1>
                    <p className="text-slate-500">Staff Accountant</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-mono font-medium text-slate-700 dark:text-slate-300">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-sm text-slate-400">
                        {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Actions */}
                <div className="space-y-8">

                    {/* Attendance Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" /> Attendance
                        </h2>
                        <div className="flex flex-col items-center justify-center py-6">
                            <button
                                onClick={handleCheckIn}
                                className={cn(
                                    "w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all bg-gradient-to-b shadow-lg hover:scale-105 active:scale-95",
                                    isCheckedIn
                                        ? "from-red-500 to-red-600 text-white shadow-red-500/20"
                                        : "from-blue-600 to-blue-700 text-white shadow-blue-500/30"
                                )}
                            >
                                {isCheckedIn ? <Pause className="w-12 h-12 mb-2" /> : <Play className="w-12 h-12 mb-2 ml-1" />}
                                <span className="font-semibold text-lg">{isCheckedIn ? "Check Out" : "Check In"}</span>
                            </button>

                            {isCheckedIn && checkInTime && (
                                <p className="mt-6 text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-sm">
                                    Clocked in at {checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Activity Status */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Current Focus</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={activity}
                                onChange={handleActivityChange}
                                placeholder="What are you working on?"
                                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                            />
                            <button
                                onClick={saveActivity}
                                disabled={isActivitySaved}
                                className="bg-slate-900 text-white p-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <CheckCircle className="w-5 h-5" />
                            </button>
                        </div>
                        {!isActivitySaved && <p className="text-xs text-amber-600 mt-2 font-medium">Unsaved changes - click check to update partners.</p>}
                    </div>

                </div>

                {/* Middle Column: Tasks */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Task List */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-semibold mb-6 flex items-center justify-between">
                            <span>Assigned Tasks</span>
                            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">3 Pending</span>
                        </h2>

                        <div className="space-y-4">
                            {MOCK_TASKS.map(task => (
                                <div key={task.id} className="group flex items-start justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className={cn("w-2 h-2 rounded-full mt-2.5", task.priority === 'high' ? 'bg-red-500' : 'bg-amber-500')} />
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
                                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                                <AlertCircle className="w-3 h-3" /> Due {task.deadline}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* EOD Report */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-semibold mb-4">End of Day Report</h2>
                        <textarea
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Summarize your day..."
                        />
                        <div className="mt-4 flex justify-between items-center">
                            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
                                <Upload className="w-4 h-4" /> Attach Files
                            </button>
                            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors">
                                <Send className="w-4 h-4" /> Submit Report
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
