"use client";

import { useState, useEffect } from 'react';
import { Calendar, Bell, AlertCircle, Clock } from 'lucide-react';
import { getStaffCompliances } from '@/app/actions/compliance';

interface ComplianceItem {
    id: number;
    particular: string;
    nextFilingDate: string | null;
    daysUntilDue: number | null;
    category: string;
}

export function StaffComplianceOverview() {
    const [compliances, setCompliances] = useState<ComplianceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCompliances();
    }, []);

    const loadCompliances = async () => {
        setLoading(true);
        const result = await getStaffCompliances();
        if (result.success && result.data) {
            setCompliances(result.data);
        }
        setLoading(false);
    };

    const getUrgencyColor = (days: number | null) => {
        if (!days) return 'text-slate-500';
        if (days <= 7) return 'text-red-600 dark:text-red-400';
        if (days <= 15) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-blue-600 dark:text-blue-400';
    };

    const getUrgencyBg = (days: number | null) => {
        if (!days) return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
        if (days <= 7) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        if (days <= 15) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    };

    const getUrgencyIcon = (days: number | null) => {
        if (!days) return <Calendar className="w-4 h-4" />;
        if (days <= 7) return <AlertCircle className="w-4 h-4" />;
        if (days <= 15) return <Bell className="w-4 h-4" />;
        return <Clock className="w-4 h-4" />;
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'TBD';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Compliance Deadlines</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (compliances.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Compliance Deadlines</h3>
                </div>
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No upcoming compliance deadlines</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Compliance Deadlines</h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{compliances.length} deadlines</span>
            </div>

            <div className="space-y-3">
                {compliances.map((item) => (
                    <div
                        key={item.id}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getUrgencyBg(item.daysUntilDue)}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                                <div className={`mt-0.5 ${getUrgencyColor(item.daysUntilDue)}`}>
                                    {getUrgencyIcon(item.daysUntilDue)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-slate-900 dark:text-white text-sm mb-1">
                                        {item.particular}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDate(item.nextFilingDate)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-sm font-semibold ${getUrgencyColor(item.daysUntilDue)}`}>
                                    {item.daysUntilDue !== null ? `${item.daysUntilDue} ${item.daysUntilDue === 1 ? 'day' : 'days'}` : 'TBD'}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {item.category === 'DIRECT_TAX' ? 'Direct Tax' : 'GST'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {compliances.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span>≤7 days</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <span>8-15 days</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span>16+ days</span>
                            </div>
                        </div>
                        <button
                            onClick={loadCompliances}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
