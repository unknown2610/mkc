"use client";

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Download,
    Calendar,
    AlertCircle,
    Edit2,
    Trash2,
    X,
    Save,
    RefreshCw
} from 'lucide-react';
import {
    getAllCompliances,
    addComplianceItem,
    updateComplianceItem,
    toggleComplianceStatus,
    seedComplianceData
} from '@/app/actions/compliance';

interface ComplianceItem {
    id: number;
    category: string;
    particular: string;
    description: string;
    frequency: string;
    filingDates: string;
    filingDatesData: any;
    nextFilingDate: string | null;
    isActive: number;
}

export function ComplianceTracker() {
    const [compliances, setCompliances] = useState<ComplianceItem[]>([]);
    const [filteredCompliances, setFilteredCompliances] = useState<ComplianceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingItem, setEditingItem] = useState<ComplianceItem | null>(null);

    useEffect(() => {
        loadCompliances();
    }, [category]);

    useEffect(() => {
        filterCompliances();
    }, [compliances, searchQuery]);

    const loadCompliances = async () => {
        setLoading(true);
        const result = await getAllCompliances(category);
        if (result.success && result.data) {
            setCompliances(result.data);
        }
        setLoading(false);
    };

    const filterCompliances = () => {
        let filtered = compliances;

        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.particular.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredCompliances(filtered);
    };

    const handleSeedData = async () => {
        if (confirm('This will seed the database with all compliance items from the tax calendar. Continue?')) {
            const result = await seedComplianceData();
            if (result.success) {
                alert(result.message);
                loadCompliances();
            } else {
                alert('Error: ' + result.error);
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to archive this compliance item?')) {
            const result = await toggleComplianceStatus(id);
            if (result.success) {
                loadCompliances();
            } else {
                alert('Error: ' + result.error);
            }
        }
    };

    const handleExport = () => {
        const csv = [
            ['S.No', 'Category', 'Particular', 'Description', 'Frequency', 'Next Filing Date'],
            ...filteredCompliances.map((item, idx) => [
                idx + 1,
                item.category === 'DIRECT_TAX' ? 'Direct Tax' : 'GST',
                item.particular,
                item.description,
                item.frequency,
                formatDate(item.nextFilingDate)
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance-tracker-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'TBD';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getFrequencyBadge = (frequency: string) => {
        const colors: { [key: string]: string } = {
            'MONTHLY': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'QUARTERLY': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            'ANNUAL': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'CUSTOM': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        };
        return colors[frequency] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Compliance Tracker</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage statutory compliance requirements
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSeedData}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Seed Data
                    </button>
                    <button
                        onClick={() => setShowAddDialog(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Compliance
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Category Tabs */}
                    <div className="flex gap-2">
                        {['ALL', 'DIRECT_TAX', 'INDIRECT_TAX'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {cat === 'ALL' ? 'All' : cat === 'DIRECT_TAX' ? 'Direct Tax' : 'GST'}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search compliance items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Export */}
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600"></div>
                    </div>
                ) : filteredCompliances.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No compliance items found</p>
                        <button
                            onClick={() => setShowAddDialog(true)}
                            className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                        >
                            Add your first compliance item
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">S.No</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Particular</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Frequency</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Next Filing</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredCompliances.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">{idx + 1}</td>
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-slate-900 dark:text-white text-sm">{item.particular}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                {item.category === 'DIRECT_TAX' ? 'Direct Tax' : 'GST'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{item.description}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFrequencyBadge(item.frequency)}`}>
                                                {item.frequency}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <span className="text-slate-900 dark:text-white">{formatDate(item.nextFilingDate)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingItem(item)}
                                                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                                    title="Archive"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Total Compliances</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{compliances.length}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Direct Tax</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                        {compliances.filter(c => c.category === 'DIRECT_TAX').length}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">GST</div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                        {compliances.filter(c => c.category === 'INDIRECT_TAX').length}
                    </div>
                </div>
            </div>

            {/* Add/Edit Dialog would go here - simplified for now */}
            {(showAddDialog || editingItem) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => {
                    setShowAddDialog(false);
                    setEditingItem(null);
                }}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            {editingItem ? 'Edit Compliance' : 'Add Compliance'}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Form for adding/editing compliance items will be implemented here.
                        </p>
                        <button
                            onClick={() => {
                                setShowAddDialog(false);
                                setEditingItem(null);
                            }}
                            className="w-full py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
