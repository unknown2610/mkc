"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, FileText, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const STAFF_MEMBERS = [
    { id: 1, name: "Arjun Singh", role: "Senior Accountant", status: "online", activity: "Working on GST Return for Client A", lastUpdate: "2 mins ago" },
    { id: 2, name: "Priya Sharma", role: "Article Assistant", status: "away", activity: "Lunch Break", lastUpdate: "25 mins ago" },
    { id: 3, name: "Rahul Verma", role: "Audit Manager", status: "online", activity: "Reviewing Balance Sheet - XYZ Corp", lastUpdate: "Just now" },
    { id: 4, name: "Simran Kaur", role: "Junior Associate", status: "offline", activity: "Checked out", lastUpdate: "5:30 PM yesterday" },
];

export default function PartnerDashboard() {
    const [selectedStaff, setSelectedStaff] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Partner Dashboard</h1>
                    <p className="text-slate-500">MKC Overview Center</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-50">
                        <Filter className="w-4 h-4" /> Filter Views
                    </button>
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-900/20">
                        <Plus className="w-4 h-4" /> Assign New Task
                    </button>
                </div>
            </header>

            {/* Main Grid: Staff Overview */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                <div className="xl:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Live Staff Activity</h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {STAFF_MEMBERS.map((staff) => (
                            <div
                                key={staff.id}
                                className={cn(
                                    "bg-white dark:bg-slate-900 p-5 rounded-2xl border transition-all hover:shadow-md cursor-pointer group",
                                    staff.status === 'online' ? "border-l-4 border-l-emerald-500 border-y-slate-200 border-r-slate-200 dark:border-y-slate-800 dark:border-r-slate-800" :
                                        staff.status === 'away' ? "border-l-4 border-l-amber-500 border-y-slate-200 border-r-slate-200 dark:border-y-slate-800 dark:border-r-slate-800" :
                                            "border-l-4 border-l-slate-300 border-y-slate-200 border-r-slate-200 dark:border-y-slate-800 dark:border-r-slate-800 opacity-70"
                                )}
                                onClick={() => setSelectedStaff(staff.id)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 font-bold">
                                            {staff.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{staff.name}</h3>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{staff.role}</p>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-bold capitalize",
                                        staff.status === 'online' ? "bg-emerald-100 text-emerald-700" :
                                            staff.status === 'away' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                                    )}>
                                        {staff.status}
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800/50">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {staff.activity}
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated {staff.lastUpdate}</span>
                                    <button className="hover:text-blue-600">View History</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Recent Updates / Stats */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Daily Summaries</h2>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-2">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border-b border-dashed border-slate-100 dark:border-slate-800/50 last:border-0">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">Arjun Singh</span>
                                    <span className="text-xs text-slate-400">Yesterday</span>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2">
                                    Completed 3 GST filings and started the audit for ABC Logistics. Facing some issues with...
                                </p>
                            </div>
                        ))}
                        <button className="w-full py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-colors mt-2">
                            View All Reports
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10"><CheckCircle2 className="w-24 h-24" /></div>
                        <h3 className="text-lg font-bold mb-1">Tasks Completed</h3>
                        <div className="text-4xl font-bold mb-4">12 <span className="text-lg font-normal text-slate-400">/ 15</span></div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full mb-4 overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[80%]"></div>
                        </div>
                        <p className="text-sm text-slate-300">Team is performing 15% better than last week.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
