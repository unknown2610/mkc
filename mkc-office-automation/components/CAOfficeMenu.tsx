"use client";

import { useState } from "react";
import { Calendar, Users, DollarSign, FileText, Bell, ChevronRight } from "lucide-react";

interface MenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
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

    const categories: MenuCategory[] = [
        {
            id: "compliance",
            title: "Compliance & Deadlines",
            icon: <Calendar className="w-5 h-5" />,
            color: "from-red-500 to-orange-500",
            items: [
                { id: "statutory-deadlines", label: "Upcoming Statutory Deadlines", disabled: true },
                { id: "critical-today", label: "Critical Deadlines Today", disabled: true },
                { id: "compliance-calendar", label: "Compliance Calendar", disabled: true },
                { id: "filing-reminders", label: "Filing Reminders", disabled: true },
            ]
        },
        {
            id: "clients",
            title: "Client Management",
            icon: <Users className="w-5 h-5" />,
            color: "from-blue-500 to-cyan-500",
            items: [
                { id: "pending-work", label: "Pending Client Work", disabled: true },
                { id: "overdue-deliverables", label: "Overdue Client Deliverables", disabled: true },
                { id: "active-clients", label: "Active Client Count", disabled: true },
                { id: "client-queries", label: "Client Query Status", disabled: true },
            ]
        },
        {
            id: "revenue",
            title: "Revenue & Billing",
            icon: <DollarSign className="w-5 h-5" />,
            color: "from-green-500 to-emerald-500",
            items: [
                { id: "today-collections", label: "Today's Collections", disabled: true },
                { id: "monthly-tracker", label: "Monthly Revenue Tracker", disabled: true },
                { id: "pending-invoices", label: "Pending Invoices", disabled: true },
                { id: "billing-summary", label: "Billing Summary", disabled: true },
            ]
        },
        {
            id: "documents",
            title: "Document & Work Status",
            icon: <FileText className="w-5 h-5" />,
            color: "from-purple-500 to-pink-500",
            items: [
                { id: "pending-review", label: "Documents Pending Review", disabled: true },
                { id: "completed-today", label: "Work Completed Today", disabled: true },
                { id: "work-in-progress", label: "Work in Progress", disabled: true },
            ]
        },
        {
            id: "updates",
            title: "Updates & Notifications",
            icon: <Bell className="w-5 h-5" />,
            color: "from-yellow-500 to-orange-500",
            items: [
                { id: "tax-updates", label: "Latest Tax/Compliance Updates", disabled: true },
                { id: "regulatory-changes", label: "Regulatory Changes", disabled: true },
                { id: "important-alerts", label: "Important Alerts", disabled: true },
            ]
        },
    ];

    const handleItemClick = (categoryId: string, itemId: string) => {
        console.log(`Clicked: ${categoryId} -> ${itemId}`);
        // TODO: Handle item clicks (will be implemented one by one)
    };

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="font-semibold text-lg mb-1">CA Office Menu</h3>
            <p className="text-indigo-100 text-sm mb-6">Quick access to all features</p>

            <div className="space-y-2">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="relative"
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                    >
                        {/* Main Category Button */}
                        <button
                            className={`w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-all ${hoveredCategory === category.id ? 'bg-white/20' : ''
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {category.icon}
                                <span>{category.title}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform ${hoveredCategory === category.id ? 'rotate-90' : ''
                                }`} />
                        </button>

                        {/* Submenu - Shows on Hover */}
                        {hoveredCategory === category.id && (
                            <div className="absolute left-full ml-2 top-0 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in slide-in-from-left-2">
                                <div className={`px-4 py-2 font-semibold text-sm bg-gradient-to-r ${category.color} text-white rounded-t-lg mb-1`}>
                                    {category.title}
                                </div>
                                {category.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleItemClick(category.id, item.id)}
                                        disabled={item.disabled}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${item.disabled
                                                ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{item.label}</span>
                                            {item.disabled && (
                                                <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                                                    Soon
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 text-xs text-indigo-200 text-center">
                Hover over categories to see options
            </div>
        </div>
    );
}
