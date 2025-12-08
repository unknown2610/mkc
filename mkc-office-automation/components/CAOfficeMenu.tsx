"use client";

import React, { useState } from 'react';
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
    Activity,
    ArrowRight,
    ExternalLink,
    Download,
    X
} from 'lucide-react';

interface SubItem {
    name: string;
    icon: any;
    description: string;
    benefits: string[];
    demoComponent: () => React.ReactElement;
}

interface Category {
    name: string;
    items: SubItem[];
    color: string;
}

// Demo data
const upcomingDeadlines = [
    { client: 'ABC Pvt Ltd', type: 'GST Return', date: '2025-01-10', daysLeft: 1, status: 'urgent' },
    { client: 'XYZ Industries', type: 'TDS Return', date: '2025-01-15', daysLeft: 6, status: 'warning' },
    { client: 'PQR Enterprises', type: 'Income Tax Filing', date: '2025-01-20', daysLeft: 11, status: 'normal' },
    { client: 'LMN Solutions', type: 'ROC Filing', date: '2025-01-25', daysLeft: 16, status: 'normal' },
];

const todayCollections = [
    { client: 'ABC Pvt Ltd', amount: 25000, service: 'Annual Audit', time: '10:30 AM', method: 'UPI' },
    { client: 'XYZ Industries', amount: 15000, service: 'GST Consultation', time: '02:15 PM', method: 'Bank Transfer' },
    { client: 'PQR Enterprises', amount: 8500, service: 'Tax Planning', time: '04:45 PM', method: 'Cash' },
];

const pendingWork = [
    { client: 'ABC Pvt Ltd', work: 'Quarterly Financial Review', assignedTo: 'Rahul Sharma', deadline: '2025-01-12', priority: 'high' },
    { client: 'XYZ Industries', work: 'GST Reconciliation', assignedTo: 'Priya Patel', deadline: '2025-01-15', priority: 'medium' },
    { client: 'LMN Solutions', work: 'Tax Audit Documentation', assignedTo: 'Amit Kumar', deadline: '2025-01-18', priority: 'high' },
    { client: 'PQR Enterprises', work: 'Payroll Processing', assignedTo: 'Neha Singh', deadline: '2025-01-20', priority: 'low' },
];

const pendingDocuments = [
    { title: 'Financial Statement - ABC Pvt Ltd', submittedBy: 'Rahul Sharma', date: '2025-01-08', pages: 45 },
    { title: 'Tax Return - XYZ Industries', submittedBy: 'Priya Patel', date: '2025-01-08', pages: 12 },
    { title: 'Audit Report - LMN Solutions', submittedBy: 'Amit Kumar', date: '2025-01-07', pages: 78 },
];

const recentUpdates = [
    { title: 'New GST Rule for E-commerce', category: 'GST', date: '2025-01-08', impact: 'High' },
    { title: 'Income Tax Slab Changes for FY 2025-26', category: 'Income Tax', date: '2025-01-07', impact: 'Medium' },
    { title: 'TDS Rate Revision Notice', category: 'TDS', date: '2025-01-06', impact: 'High' },
];

const DemoUpcomingDeadlines = () => (
    <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-lg">Upcoming Statutory Deadlines</h4>
            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Download className="w-4 h-4" /> Export
            </button>
        </div>
        <div className="space-y-3">
            {upcomingDeadlines.map((item, i) => (
                <div key={i} className={`p-4 rounded-lg border-l-4 bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 
                    ${item.status === 'urgent' ? 'border-red-500' : item.status === 'warning' ? 'border-yellow-500' : 'border-blue-500'}`}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-900 dark:text-white">{item.client}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    item.status === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                    {item.daysLeft} days left
                                </span>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{item.type}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {item.date}
                            </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const DemoTodayCollections = () => {
    const total = todayCollections.reduce((sum, item) => sum + item.amount, 0);
    return (
        <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 mb-4">
                <div className="text-sm opacity-90 mb-1">Today's Total Collections</div>
                <div className="text-4xl font-bold">₹{total.toLocaleString('en-IN')}</div>
                <div className="text-sm opacity-75 mt-2">{todayCollections.length} transactions</div>
            </div>
            <h4 className="font-semibold text-lg mb-3">Payment Details</h4>
            <div className="space-y-3">
                {todayCollections.map((item, i) => (
                    <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <div className="font-semibold text-slate-900 dark:text-white">{item.client}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{item.service}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-green-600 dark:text-green-400">₹{item.amount.toLocaleString('en-IN')}</div>
                                <div className="text-xs text-slate-500">{item.time}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400rounded">
                                {item.method}
                            </span>
                            <CheckCircle className="w-3 h-3 text-green-500 ml-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DemoPendingWork = () => (
    <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-lg">Pending Client Work</h4>
            <div className="text-sm text-slate-500">{pendingWork.length} items</div>
        </div>
        <div className="space-y-3">
            {pendingWork.map((item, i) => (
                <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-900 dark:text-white">{item.work}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${item.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    }`}>
                                    {item.priority}
                                </span>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{item.client}</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Users className="w-4 h-4" />
                            {item.assignedTo}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            {item.deadline}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const DemoPendingDocuments = () => (
    <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-lg">Documents Pending Review</h4>
            <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">
                {pendingDocuments.length} pending
            </div>
        </div>
        <div className="space-y-3">
            {pendingDocuments.map((item, i) => (
                <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</div>
                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" /> {item.submittedBy}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {item.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    {item.pages} pages
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <ExternalLink className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </button>
                            <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const DemoRecentUpdates = () => (
    <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-lg">Latest Tax/Compliance Updates</h4>
            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
            </button>
        </div>
        <div className="space-y-3">
            {recentUpdates.map((item, i) => (
                <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="font-semibold text-slate-900 dark:text-white">{item.title}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                                    {item.category}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${item.impact === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                    Impact: {item.impact}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {item.date}
                                </span>
                            </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                            <ExternalLink className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
        <button className="w-full py-2 border-2 border-dashed border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
            Subscribe to Email Updates
        </button>
    </div>
);

const categories: Category[] = [
    {
        name: 'Compliance & Deadlines',
        color: 'from-blue-500 to-blue-600',
        items: [
            {
                name: 'Upcoming Statutory Deadlines',
                icon: Calendar,
                description: 'Track all upcoming compliance deadlines',
                benefits: ['Never miss a deadline', 'Automated reminders', 'Calendar integration'],
                demoComponent: DemoUpcomingDeadlines
            },
            { name: 'Critical Deadlines Today', icon: AlertCircle, description: 'Today\'s urgent compliance tasks', benefits: ['Real-time alerts', 'Priority sorting', 'Quick actions'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> },
            { name: 'Compliance Calendar', icon: Clock, description: 'Complete compliance schedule', benefits: ['Month view', 'Year planning', 'Export options'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> },
            { name: 'Filing Reminders', icon: Bell, description: 'Automated filing notifications', benefits: ['Smart reminders', 'Multi-channel alerts', 'Customizable'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> }
        ]
    },
    {
        name: 'Client Management',
        color: 'from-purple-500 to-purple-600',
        items: [
            {
                name: 'Pending Client Work',
                icon: Users,
                description: 'Active client tasks overview',
                benefits: ['Work tracking', 'Status updates', 'Team collaboration'],
                demoComponent: DemoPendingWork
            },
            { name: 'Overdue Client Deliverables', icon: AlertCircle, description: 'Delayed project tracking', benefits: ['Overdue alerts', 'Client notifications', 'Recovery plans'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> },
            { name: 'Active Client Count', icon: Activity, description: 'Real-time client metrics', benefits: ['Live dashboard', 'Growth tracking', 'Analytics'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> },
            { name: 'Client Query Status', icon: FileText, description: 'Query management system', benefits: ['Query tracking', 'Response time', 'Satisfaction scores'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> }
        ]
    },
    {
        name: 'Revenue & Billing',
        color: 'from-green-500 to-green-600',
        items: [
            {
                name: 'Today\'s Collections',
                icon: DollarSign,
                description: 'Daily revenue tracking',
                benefits: ['Real-time updates', 'Payment tracking', 'Cash flow'],
                demoComponent: DemoTodayCollections
            },
            { name: 'Monthly Revenue Tracker', icon: TrendingUp, description: 'Monthly financial overview', benefits: ['Revenue trends', 'Forecasting', 'Comparisons'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> },
            { name: 'Pending Invoices', icon: FileText, description: 'Outstanding invoice management', benefits: ['Auto reminders', 'Aging reports', 'Payment links'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> },
            { name: 'Billing Summary', icon: FileCheck, description: 'Comprehensive billing analytics', benefits: ['Detailed reports', 'Client breakdown', 'Export data'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> }
        ]
    },
    {
        name: 'Document & Work Status',
        color: 'from-orange-500 to-orange-600',
        items: [
            {
                name: 'Documents Pending Review',
                icon: FileText,
                description: 'Document approval queue',
                benefits: ['Quick review', 'Batch processing', 'Approval flow'],
                demoComponent: DemoPendingDocuments
            },
            { name: 'Work Completed Today', icon: CheckCircle, description: 'Daily completion tracker', benefits: ['Team productivity', 'Task completion', 'Time tracking'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> },
            { name: 'Work in Progress', icon: Activity, description: 'Active work monitoring', benefits: ['Live status', 'Resource allocation', 'Bottleneck detection'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> }
        ]
    },
    {
        name: 'Updates & Notifications',
        color: 'from-red-500 to-red-600',
        items: [
            {
                name: 'Latest Tax/Compliance Updates',
                icon: Bell,
                description: 'Regulatory change tracker',
                benefits: ['Real-time updates', 'Impact analysis', 'Action items'],
                demoComponent: DemoRecentUpdates
            },
            { name: 'Regulatory Changes', icon: AlertCircle, description: 'Law and rule updates', benefits: ['Change alerts', 'Compliance impact', 'Implementation guides'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> },
            { name: 'Important Alerts', icon: Bell, description: 'Critical notifications', benefits: ['Priority alerts', 'Multi-channel', 'Acknowledgment tracking'], demoComponent: () => <div className="text-center py-8 text-slate-500">Coming soon...</div> }
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

                        {/* Submenu */}
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
                                                Demo
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
                                                        Click to see demo interface
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
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}>

                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 z-10">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${categories.find(c => c.items.includes(selectedItem))?.color || 'from-blue-500 to-blue-600'}`}>
                                    <selectedItem.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                        {selectedItem.name}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        {selectedItem.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                            {selectedItem.demoComponent()}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 
                                    text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
