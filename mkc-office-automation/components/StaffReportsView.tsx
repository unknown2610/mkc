"use client";

import { useState, useEffect } from "react";
import { Calendar, FileText, AlertTriangle, CheckCircle2, Plus } from "lucide-react";
import { getMyReports, getMyPendingReports } from "@/app/actions/reports";
import { DailyReportDialog } from "./DailyReportDialog";

interface Report {
    id: number;
    reportDate: string;
    summary: string;
    tasksCompleted: number;
    overridden: boolean;
    overriddenAt: Date | null;
    submittedAt: Date;
    updatedAt: Date;
}

export function StaffReportsView() {
    const [reports, setReports] = useState<Report[]>([]);
    const [pendingDates, setPendingDates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [reportsData, pendingData] = await Promise.all([
            getMyReports(),
            getMyPendingReports()
        ]);
        setReports(reportsData);
        setPendingDates(pendingData);
        setLoading(false);
    };

    const handleNewReport = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
        setShowReportDialog(true);
    };

    const handleReportForDate = (date: string) => {
        setSelectedDate(date);
        setShowReportDialog(true);
    };

    const handleReportSubmitted = () => {
        loadData(); // Reload data after submission
    };

    if (loading) {
        return <div className="text-center py-12 text-slate-500">Loading reports...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header with New Report Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">My Reports</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View and submit your daily work reports</p>
                </div>
                <button
                    onClick={handleNewReport}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Report
                </button>
            </div>

            {/* Pending Reports Alert */}
            {pendingDates.length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                                {pendingDates.length} Pending Report{pendingDates.length > 1 ? 's' : ''}
                            </h4>
                            <div className="space-y-2">
                                {pendingDates.map((date) => (
                                    <div key={date} className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-2 border border-orange-200 dark:border-orange-900/30">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <button
                                            onClick={() => handleReportForDate(date)}
                                            className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg font-medium transition-colors"
                                        >
                                            Submit Report
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Total Reports</p>
                            <p className="text-2xl font-bold mt-1">{reports.length}</p>
                        </div>
                        <FileText className="w-8 h-8 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">On Time</p>
                            <p className="text-2xl font-bold mt-1">
                                {reports.filter(r => !r.overridden).length}
                            </p>
                        </div>
                        <CheckCircle2 className="w-8 h-8 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Late Submissions</p>
                            <p className="text-2xl font-bold mt-1">
                                {reports.filter(r => r.overridden).length}
                            </p>
                        </div>
                        <AlertTriangle className="w-8 h-8 opacity-80" />
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 dark:text-white">Report History</h4>
                {reports.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No reports submitted yet</p>
                        <button
                            onClick={handleNewReport}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Submit Your First Report
                        </button>
                    </div>
                ) : (
                    reports.map((report) => (
                        <div
                            key={report.id}
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-slate-900 dark:text-white">
                                            {new Date(report.reportDate + 'T00:00:00').toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </h5>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Submitted {new Date(report.submittedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </p>
                                    </div>
                                </div>
                                {report.overridden && (
                                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">
                                        Late Submission
                                    </span>
                                )}
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-2">
                                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {report.summary}
                                </p>
                            </div>

                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                <strong className="text-slate-900 dark:text-white">{report.tasksCompleted}</strong> tasks completed
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Report Dialog */}
            <DailyReportDialog
                isOpen={showReportDialog}
                onClose={() => setShowReportDialog(false)}
                onSubmit={handleReportSubmitted}
                defaultDate={selectedDate}
                allowOverride={false}
            />
        </div>
    );
}
