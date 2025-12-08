"use client";

import { useState } from "react";
import { Calendar, Users, DollarSign, FileText, Bell, ChevronRight, X } from "lucide-react";

interface MenuItem {
    id: string;
    label: string;
}

interface MenuCategory {
    id: string;
    title: string;
    icon: React.ReactNode;
    color: string;
    items: MenuItem[];
}

export function CAOfficeMenu() {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [showDemo, setShowDemo] = useState(false);
    const [demoFeature, setDemoFeature] = useState<{ title: string; description: string } | null>(null);

    const categories: MenuCategory[] = [
        {
            id: "compliance",
            title: "Compliance & Deadlines",
            icon: <Calendar className="w-5 h-5" />,
            color: "from-red-500 to-orange-500",
            items: [
                { id: "statutory-deadlines", label: "Upcoming Statutory Deadlines" },
                { id: "critical-today", label: "Critical Deadlines Today" },
                { id: "compliance-calendar", label: "Compliance Calendar" },
                { id: "filing-reminders", label: "Filing Reminders" },
            ]
        },
        {
            id: "clients",
            title: "Client Management",
            icon: <Users className="w-5 h-5" />,
            color: "from-blue-500 to-cyan-500",
            items: [
                { id: "pending-work", label: "Pending Client Work" },
                { id: "overdue-deliverables", label: "Overdue Client Deliverables" },
                { id: "active-clients", label: "Active Client Count" },
                { id: "client-queries", label: "Client Query Status" },
            ]
        },
        {
            id: "revenue",
            title: "Revenue & Billing",
            icon: <DollarSign className="w-5 h-5" />,
            color: "from-green-500 to-emerald-500",
            items: [
                { id: "today-collections", label: "Today's Collections" },
                { id: "monthly-tracker", label: "Monthly Revenue Tracker" },
                { id: "pending-invoices", label: "Pending Invoices" },
                { id: "billing-summary", label: "Billing Summary" },
            ]
        },
        {
            id: "documents",
            title: "Document & Work Status",
            icon: <FileText className="w-5 h-5" />,
            color: "from-purple-500 to-pink-500",
            items: [
                { id: "pending-review", label: "Documents Pending Review" },
                { id: "completed-today", label: "Work Completed Today" },
                { id: "work-in-progress", label: "Work in Progress" },
            ]
        },
        {
            id: "updates",
            title: "Updates & Notifications",
            icon: <Bell className="w-5 h-5" />,
            color: "from-yellow-500 to-orange-500",
            items: [
                { id: "tax-updates", label: "Latest Tax/Compliance Updates" },
                { id: "regulatory-changes", label: "Regulatory Changes" },
                { id: "important-alerts", label: "Important Alerts" },
            ]
        },
    ];

    const handleItemClick = (itemLabel: string) => {
        setDemoFeature({
            title: itemLabel,
            description: "This feature is coming soon! We're working on bringing you comprehensive tools for " + itemLabel.toLowerCase() + "."
        });
        setShowDemo(true);
        setHoveredCategory(null);
    };

    return (
        <div className="space-y-3">
            <div className="mb-4">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Office Menu</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Quick access to all CA office features</p>
            </div>

            {categories.map((category) => (
                <div
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                >
                    {/* Main Category Button */}
                    <button
                        className={`w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r ${category.color} text-white rounded-lg shadow-md hover:shadow-lg transition-all ${hoveredCategory === category.id ? 'shadow-lg scale-[1.02]' : ''
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {category.icon}
                            <span className="font-medium">{category.title}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${hoveredCategory === category.id ? 'rotate-90' : ''
                            }`} />
                    </button>

                    {/* Submenu - Shows on Hover BELOW */}
                    {hoveredCategory === category.id && (
                        <div className="mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 animate-in slide-in-from-top-2 z-10">
                            {category.items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item.label)}
                                    className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                >
                                    <span>{item.label}</span>
                                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">
                                        Preview
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
                Hover over categories • Click items for preview
            </div>

            {/* Demo Modal */}
            {showDemo && demoFeature && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{demoFeature.title}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Feature Preview</p>
                            </div>
                            <button
                                onClick={() => setShowDemo(false)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 text-center">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Coming Soon!</h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
                                    {demoFeature.description}
                                </p>
                                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 inline-block">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        This feature will provide:
                                    </p>
                                    <ul className="mt-2 text-left text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                        <li>• Real-time data tracking</li>
                                        <li>• Automated notifications</li>
                                        <li>• Comprehensive reporting</li>
                                        <li>• Easy-to-use interface</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                            <button
                                onClick={() => setShowDemo(false)}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
