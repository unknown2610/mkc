"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    onUploadComplete?: (fileUrl: string) => void;
    endpoint?: string;
    label?: string;
}

export function FileUpload({ onUploadComplete, label = "Upload File" }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setSuccess(false);
            setProgress(0);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setSuccess(false);
            setProgress(0);
        }
    };

    const uploadFile = async () => {
        if (!file) return;

        setUploading(true);
        // Simulate upload progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                return prev + 10;
            });
        }, 200);

        try {
            // TODO: Replace with actual Server Action / API call
            // const formData = new FormData();
            // formData.append("file", file);
            // await uploadAction(formData);

            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating network

            clearInterval(interval);
            setProgress(100);
            setSuccess(true);
            if (onUploadComplete) onUploadComplete("https://fake-url.com/" + file.name);

            // Reset after success
            setTimeout(() => {
                setFile(null);
                setSuccess(false);
                setUploading(false);
                setProgress(0);
            }, 3000);

        } catch (error) {
            console.error("Upload failed", error);
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            {!file ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                >
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                    <p className="text-xs text-slate-400 mt-1">Drag & drop or click to browse</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="truncate">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[180px]">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                            </div>
                        </div>
                        {!uploading && !success && (
                            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                        {success && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                    </div>

                    {uploading || success ? (
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full transition-all duration-300", success ? "bg-emerald-500" : "bg-blue-600")}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    ) : (
                        <button
                            onClick={uploadFile}
                            className="w-full mt-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Upload File
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
