"use client";

import { useState } from "react";
import { FileText, Bell, X, Send } from "lucide-react";
import { requestAllReports, sendAnnouncement } from "@/app/actions/partner-stats";

export function QuickActionsPanel() {
    const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementMessage, setAnnouncementMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleRequestReports = async () => {
        setLoading(true);
        setMessage("");

        try {
            const result = await requestAllReports();
            if (result.success) {
                setMessage(`✓ ${result.message}`);
            } else {
                setMessage(`✗ ${result.message}`);
            }
        } catch (error) {
            setMessage("✗ Failed to send report request");
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(""), 5000);
        }
    };

    const handleSendAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await sendAnnouncement(announcementTitle, announcementMessage);
            if (result.success) {
                setMessage(`✓ ${result.message}`);
                setAnnouncementTitle("");
                setAnnouncementMessage("");
                setShowAnnouncementDialog(false);
            } else {
                setMessage(`✗ ${result.error}`);
            }
        } catch (error) {
            setMessage("✗ Failed to send announcement");
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(""), 5000);
        }
    };

    return (
        <>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <p className="text-sm text-purple-100 mb-4">Manage office operations</p>

                <div className="space-y-2">
                    <button
                        onClick={handleRequestReports}
                        disabled={loading}
                        className="w-full flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all disabled:opacity-50"
                    >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">Request All Reports</span>
                    </button>

                    <button
                        onClick={() => setShowAnnouncementDialog(true)}
                        disabled={loading}
                        className="w-full flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all disabled:opacity-50"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="text-sm font-medium">Send Announcement</span>
                    </button>
                </div>

                {message && (
                    <div className="mt-4 p-2 bg-white/20 backdrop-blur-sm rounded text-sm">
                        {message}
                    </div>
                )}
            </div>

            {/* Announcement Dialog */}
            {showAnnouncementDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Send Announcement</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Broadcast to all staff</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAnnouncementDialog(false)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSendAnnouncement} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={announcementTitle}
                                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                                    placeholder="e.g., Office Closure Notice"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={announcementMessage}
                                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                                    rows={5}
                                    placeholder="Enter your announcement message..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white resize-none"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAnnouncementDialog(false)}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    {loading ? "Sending..." : "Send"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
