"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { uploadFileToBackend } from "@/app/actions";

interface FileUploadProps {
    onUploadComplete?: (fileUrl: string) => void;
    label?: string;
}

export function FileUpload({ onUploadComplete, label = "Upload File" }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setSuccess(false);
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
        }
    };

    const uploadFile = async () => {
        if (!file) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const result = await uploadFileToBackend(formData);

            if (result.success) {
                setSuccess(true);
                if (onUploadComplete) onUploadComplete(result.data?.view_link || "");

                // Reset after success
                setTimeout(() => {
                    setFile(null);
                    setSuccess(false);
                    setUploading(false);
                }, 3000);
            } else {
                console.error(result.error);
                alert("Upload failed. Please try again.");
            }

        } catch (error) {
            console.error("Upload failed", error);
            alert("An error occurred during upload.");
        } finally {
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

                    {uploading ? (
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden relative">
                            <div className="absolute inset-0 bg-blue-600 animate-pulse w-2/3" />
                        </div>
                    ) : success ? (
                        <div className="text-sm text-emerald-600 font-medium text-center">Upload Complete!</div>
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
