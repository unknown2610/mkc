"use client";

import { useState, useEffect } from "react";
import { Calendar, Users, Filter, SortAsc, Download, AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import { getDailyReports, getStaffListForFilters } from "@/app/actions/reports";

interface Report {
    id: number;
    userId: number;
    userName: string;
    userRole: string;
    reportDate: string;
    summary: string;
    tasksCompleted: number | null;
    overridden: boolean;
    overriddenAt: Date | null;
    submittedAt: Date;
    updatedAt: Date;
}

interface StaffMember {
    id: number;
    name: string;
    role: string;
}

export default function DailyReportsView() {
    const [reports, setReports] = useState<Report[]>([]);
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
    const [showOnlyOverridden, setShowOnlyOverridden] = useState(false);
    const [sortBy, setSortBy] = useState<"date" | "name">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        loadReports();
    }, [dateFrom, dateTo, selectedStaff, showOnlyOverridden]);

    const loadInitialData = async () => {
        const staff = await getStaffListForFilters();
        setStaffList(staff);
        await loadReports();
    };

    const loadReports = async () => {
        setLoading(true);
        const filters: any = {};

        if (dateFrom) filters.dateFrom = dateFrom;
        if (dateTo) filters.dateTo = dateTo;
        if (selectedStaff.length > 0) filters.userIds = selectedStaff;
        if (showOnlyOverridden) filters.showOnlyOverridden = true;

        const data = await getDailyReports(filters);
        setReports(data);
        setLoading(false);
    };

    const toggleStaffSelection = (staffId: number) => {
        setSelectedStaff(prev =>
            prev.includes(staffId)
                ? prev.filter(id => id !== staffId)
                : [...prev, staffId]
        );
    };

    const getSortedReports = () => {
        const sorted = [...reports];

        sorted.sort((a, b) => {
            let comparison = 0;

            if (sortBy === "date") {
                comparison = a.reportDate.localeCompare(b.reportDate);
            } else if (sortBy === "name") {
                comparison = a.userName.localeCompare(b.userName);
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

        return sorted;
    };

    const sortedReports = getSortedReports();

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Reports</p>
                            <p className="text-3xl font-bold mt-1">{reports.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">On Time</p>
                            <p className="text-3xl font-bold mt-1">
                                {reports.filter(r => !r.overridden).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Overridden</p>
                            <p className="text-3xl font-bold mt-1">
                                {reports.filter(r => r.overridden).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Filters & Sorting</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Date From */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-600 dark:text-slate-400">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Date To */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-600 dark:text-slate-400">
                            To Date
                        </label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Sort By */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-600 dark:text-slate-400">
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "date" | "name")}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="date">Date</option>
                            <option value="name">Staff Name</option>
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-600 dark:text-slate-400">
                            Order
                        </label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Staff Filter */}
                <div className="mt-4">
                    <label className="block text-xs font-medium mb-2 text-slate-600 dark:text-slate-400">
                        Filter by Staff
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {staffList.map((staff) => (
                            <button
                                key={staff.id}
                                onClick={() => toggleStaffSelection(staff.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedStaff.includes(staff.id)
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    }`}
                            >
                                {staff.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Show Only Overridden */}
                <div className="mt-4 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="showOverridden"
                        checked={showOnlyOverridden}
                        onChange={(e) => setShowOnlyOverridden(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="showOverridden" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Show only overridden reports
                    </label>
                </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-slate-500">Loading reports...</div>
                ) : sortedReports.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No reports found matching your filters</p>
                    </div>
                ) : (
                    sortedReports.map((report) => (
                        <div
                            key={report.id}
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <span className="text-lg font-bold text-slate-600 dark:text-slate-300">
                                            {report.userName.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">
                                            {report.userName}
                                        </h4>
                                        <p className="text-sm text-slate-500 capitalize">{report.userRole}</p>
                                    </div>
                                </div>

                                <div className="text-right flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(report.reportDate + 'T00:00:00').toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    {report.overridden && (
                                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            Overridden
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-3">
                                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {report.summary}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        <strong className="text-slate-900 dark:text-white">{report.tasksCompleted}</strong> tasks completed
                                    </span>
                                    {report.overridden && report.overriddenAt && (
                                        <span className="text-orange-600 dark:text-orange-400 text-xs">
                                            Overridden on {new Date(report.overriddenAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-500">
                                    Submitted {new Date(report.submittedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
