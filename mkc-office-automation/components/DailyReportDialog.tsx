"use client";

import { useState, useEffect } from "react";
import { X, Calendar, FileText } from "lucide-react";
import { submitDailyReport } from "@/app/actions/reports";

interface DailyReportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onOverride?: () => void;
    defaultDate?: string; // For submitting late reports
    allowOverride?: boolean; // Show override button
}

export function DailyReportDialog({
    isOpen,
    onClose,
    onSubmit,
    onOverride,
    defaultDate,
    allowOverride = true,
}: DailyReportDialogProps) {
    const [reportDate, setReportDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
    const [summary, setSummary] = useState("");
    const [tasksCompleted, setTasksCompleted] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (defaultDate) {
            setReportDate(defaultDate);
        }
    }, [defaultDate]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!summary.trim()) {
            setError("Please provide a summary of your work");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await submitDailyReport(reportDate, summary, tasksCompleted);

            if (result.success) {
                setSummary("");
                setTasksCompleted(0);
                onSubmit();
                onClose();
            } else {
                setError(result.error || "Failed to submit report");
            }
        } catch (err) {
            setError("An error occurred while submitting");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOverride = () => {
        if (onOverride) {
            onOverride();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Work Report</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Summarize your work for the day</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Date Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Report Date
                        </label>
                        <input
                            type="date"
                            value={reportDate}
                            onChange={(e) => setReportDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        />
                    </div>

                    {/* Summary */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                            Work Summary <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={6}
                            placeholder="What did you work on today? List tasks completed, meetings attended, issues resolved, etc."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white resize-none"
                            required
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Be specific and detailed about your accomplishments
                        </p>
                    </div>

                    {/* Tasks Completed */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                            Tasks Completed
                        </label>
                        <input
                            type="number"
                            value={tasksCompleted}
                            onChange={(e) => setTasksCompleted(parseInt(e.target.value) || 0)}
                            min={0}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </button>

                        {allowOverride && onOverride && (
                            <button
                                type="button"
                                onClick={handleOverride}
                                className="px-6 py-3 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-xl font-medium transition-colors"
                            >
                                Skip & Checkout
                            </button>
                        )}
                    </div>

                    {allowOverride && onOverride && (
                        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                            Skipping will be tracked. You can submit your report later from the dashboard.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
