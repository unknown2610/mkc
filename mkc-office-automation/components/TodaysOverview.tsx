"use client";

import { useState, useEffect } from "react";
import { Clock, FileText, CheckCircle2, Users } from "lucide-react";
import { getTodaysOverview } from "@/app/actions/partner-stats";

interface OverviewData {
    avgCheckInTime: string | null;
    reportsSubmitted: number;
    tasksCompleted: number;
    totalStaffCheckedIn: number;
    totalStaff: number;
}

export function TodaysOverview() {
    const [data, setData] = useState<OverviewData>({
        avgCheckInTime: null,
        reportsSubmitted: 0,
        tasksCompleted: 0,
        totalStaffCheckedIn: 0,
        totalStaff: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        // Refresh every 30 seconds for real-time updates
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        const overview = await getTodaysOverview();
        setData(overview);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Today's Overview</h3>
                <div className="text-center text-slate-500 py-4">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Today's Overview</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Auto-refreshing</span>
            </div>
            <div className="space-y-4">
                {/* Average Check-in Time */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>Avg. Check-in Time</span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                        {data.avgCheckInTime || '--:--'}
                    </span>
                </div>

                {/* Reports Submitted */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <FileText className="w-4 h-4" />
                        <span>Reports Submitted</span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                        {data.reportsSubmitted}
                    </span>
                </div>

                {/* Tasks Completed */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tasks Completed</span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                        {data.tasksCompleted}
                    </span>
                </div>

                {/* Staff Checked In */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>Staff Active</span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                        {data.totalStaffCheckedIn} / {data.totalStaff}
                    </span>
                </div>
            </div>
        </div>
    );
}
