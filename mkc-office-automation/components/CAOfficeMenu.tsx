"use client";

import { useState } from 'react';
import {
    Calendar,
    FileCheck,
    Users,
    DollarSign,
    FileText,
    Bell,
    Clock,
    AlertCircle,
    TrendingUp,
    CheckCircle,
    Activity
} from 'lucide-react';

interface SubItem {
    name: string;
    icon: any;
    description: string;
    benefits: string[];
}

interface Category {
    name: string;
    items: SubItem[];
    color: string;
}

const categories: Category[] = [
    {
        name: 'Compliance & Deadlines',
        color: 'from-blue-500 to-blue-600',
        items: [
            { name: 'Upcoming Statutory Deadlines', icon: Calendar, description: 'Track all upcoming compliance deadlines', benefits: ['Never miss a deadline', 'Automated reminders', 'Calendar integration'] },
            { name: 'Critical Deadlines Today', icon: AlertCircle, description: 'Today\'s urgent compliance tasks', benefits: ['Real-time alerts', 'Priority sorting', 'Quick actions'] },
            { name: 'Compliance Calendar', icon: Clock, description: 'Complete compliance schedule', benefits: ['Month view', 'Year planning', 'Export options'] },
            { name: 'Filing Reminders', icon: Bell, description: 'Automated filing notifications', benefits: ['Smart reminders', 'Multi-channel alerts', 'Customizable'] }
        ]
    },
    {
        name: 'Client Management',
        color: 'from-purple-500 to-purple-600',
        items: [
            { name: 'Pending Client Work', icon: Users, description: 'Active client tasks overview', benefits: ['Work tracking', 'Status updates', 'Team collaboration'] },
            { name: 'Overdue Client Deliverables', icon: AlertCircle, description: 'Delayed project tracking', benefits: ['Overdue alerts', 'Client notifications', 'Recovery plans'] },
            { name: 'Active Client Count', icon: Activity, description: 'Real-time client metrics', benefits: ['Live dashboard', 'Growth tracking', 'Analytics'] },
            { name: 'Client Query Status', icon: FileText, description: 'Query management system', benefits: ['Query tracking', 'Response time', 'Satisfaction scores'] }
        ]
    },
    {
        name: 'Revenue & Billing',
        color: 'from-green-500 to-green-600',
        items: [
            { name: 'Today\'s Collections', icon: DollarSign, description: 'Daily revenue tracking', benefits: ['Real-time updates', 'Payment tracking', 'Cash flow'] },
            { name: 'Monthly Revenue Tracker', icon: TrendingUp, description: 'Monthly financial overview', benefits: ['Revenue trends', 'Forecasting', 'Comparisons'] },
            { name: 'Pending Invoices', icon: FileText, description: 'Outstanding invoice management', benefits: ['Auto reminders', 'Aging reports', 'Payment links'] },
            { name: 'Billing Summary', icon: FileCheck, description: 'Comprehensive billing analytics', benefits: ['Detailed reports', 'Client breakdown', 'Export data'] }
        ]
    },
    {
        name: 'Document & Work Status',
        color: 'from-orange-500 to-orange-600',
        items: [
            { name: 'Documents Pending Review', icon: FileText, description: 'Document approval queue', benefits: ['Quick review', 'Batch processing', 'Approval flow'] },
            { name: 'Work Completed Today', icon: CheckCircle, description: 'Daily completion tracker', benefits: ['Team productivity', 'Task completion', 'Time tracking'] },
            { name: 'Work in Progress', icon: Activity, description: 'Active work monitoring', benefits: ['Live status', 'Resource allocation', 'Bottleneck detection'] }
        ]
    },
    {
        name: 'Updates & Notifications',
        color: 'from-red-500 to-red-600',
        items: [
            { name: 'Latest Tax/Compliance Updates', icon: Bell, description: 'Regulatory change tracker', benefits: ['Real-time updates', 'Impact analysis', 'Action items'] },
            { name: 'Regulatory Changes', icon: AlertCircle, description: 'Law and rule updates', benefits: ['Change alerts', 'Compliance impact', 'Implementation guides'] },
            { name: 'Important Alerts', icon: Bell, description: 'Critical notifications', benefits: ['Priority alerts', 'Multi-channel', 'Acknowledgment tracking'] }
        ]
    }
];

export function CAOfficeMenu() {
    const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<SubItem | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Office</h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">18 Features Available</span>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, idx) => (
                    <div
                        key={idx}
                        className="relative"
                        onMouseEnter={() => setHoveredCategory(idx)}
                        onMouseLeave={() => {
                            setHoveredCategory(null);
                            setHoveredItem(null);
                        }}
                    >
                        {/* Category Button */}
                        <button
                            className={`w-full p-6 rounded-xl bg-gradient-to-br ${category.color} text-white font-semibold text-lg 
                                shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105
                                ${hoveredCategory === idx ? 'ring-4 ring-white/50' : ''}`}
                        >
                            {category.name}
                            <div className="text-sm font-normal mt-2 opacity-90">
                                {category.items.length} features
                            </div>
                        </button>

                        {/* Submenu - Appears below with smooth animation */}
                        <div
                            className={`absolute top-full left-0 right-0 mt-2 z-10 transition-all duration-300 ease-in-out
                                ${hoveredCategory === idx
                                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                                    : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                        >
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                {category.items.map((item, itemIdx) => (
                                    <div
                                        key={itemIdx}
                                        className="relative"
                                        onMouseEnter={() => setHoveredItem(item.name)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        <button
                                            onClick={() => setSelectedItem(item)}
                                            className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 
                                                transition-all duration-200 ease-in-out flex items-center gap-3 group
                                                border-b border-slate-100 dark:border-slate-700 last:border-0"
                                        >
                                            <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors duration-200" />
                                            <div className="flex-1">
                                                <div className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                                    {item.name}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {item.description}
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                                                Preview
                                            </span>
                                        </button>

                                        {/* Hover Preview Tooltip */}
                                        {hoveredItem === item.name && (
                                            <div className="absolute left-full top-0 ml-2 w-72 bg-white dark:bg-slate-800 
                                                rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-20
                                                animate-in fade-in slide-in-from-left-2 duration-200">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                                                        <item.icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Key Benefits:</p>
                                                    {item.benefits.map((benefit, i) => (
                                                        <div key={i} className="flex items-start gap-2">
                                                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-xs text-slate-600 dark:text-slate-400">{benefit}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        Click to see full demo interface
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Demo Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSelectedItem(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start gap-4 mb-6">
                            <div className={`p-4 rounded-xl bg-gradient-to-br ${categories.find(c => c.items.includes(selectedItem))?.color || 'from-blue-500 to-blue-600'}`}>
                                <selectedItem.icon className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {selectedItem.name}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {selectedItem.description}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 rounded-xl p-6 mb-6">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                What this will provide:
                            </h4>
                            <ul className="space-y-3">
                                {selectedItem.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-yellow-900 dark:text-yellow-200 text-sm">Coming Soon!</p>
                                    <p className="text-yellow-800 dark:text-yellow-300 text-sm mt-1">
                                        This feature is currently under development. It will be available soon with full functionality.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedItem(null)}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                                text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
