'use client';

import { useState } from 'react';
import { loginAction } from '@/app/actions/auth';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError(null);
        const result = await loginAction(formData); // Note: server actions returning simple objects don't trigger redirects automatically in client components if invoked directly without startTransition usually, but Next.js actions can redirect.
        // However, if redirect() is called in server action, it throws an error that is caught by Next.js to handle the redirect.
        // If we catch it here, we break the redirect. 
        // Wait, redirect() in Server Actions works by throwing NEXT_REDIRECT. We should NOT catch it.
        // But we are calling it in an event handler.
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MKC Office</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your dashboard</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Username (Name)</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Vishal"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
