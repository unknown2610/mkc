"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X, FileText } from "lucide-react";
import { getMyPendingReports } from "@/app/actions/reports";
import { DailyReportDialog } from "./DailyReportDialog";

export function PendingReportsAlert() {
    const [pendingDates, setPendingDates] = useState<string[]>([]);
    const [isDismissed, setIsDismissed] = useState(false);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>("");

    useEffect(() => {
        loadPendingReports();
    }, []);

    const loadPendingReports = async () => {
        const dates = await getMyPendingReports();
        setPendingDates(dates);
    };

    const handleReportForDate = (date: string) => {
        setSelectedDate(date);
        setShowReportDialog(true);
    };

    const handleReportSubmitted = () => {
        // Reload pending reports after submission
        loadPendingReports();
        setShowReportDialog(false);
    };

    if (isDismissed || pendingDates.length === 0) return null;

    return (
        <>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/30 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                                    Pending Daily Reports
                                </h3>
                                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                                    You have {pendingDates.length} day{pendingDates.length > 1 ? 's' : ''} with missing reports
                                </p>
                            </div>
                            <button
                                onClick={() => setIsDismissed(true)}
                                className="w-6 h-6 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/60 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {pendingDates.map((date) => (
                                <div
                                    key={date}
                                    className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-3 border border-orange-200 dark:border-orange-900/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleReportForDate(date)}
                                        className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg font-medium transition-colors"
                                    >
                                        Submit Report
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Dialog */}
            <DailyReportDialog
                isOpen={showReportDialog}
                onClose={() => setShowReportDialog(false)}
                onSubmit={handleReportSubmitted}
                defaultDate={selectedDate}
                allowOverride={false}
            />
        </>
    );
}
