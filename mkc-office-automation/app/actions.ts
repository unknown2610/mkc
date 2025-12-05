"use server";

export async function uploadFileToBackend(formData: FormData) {
    const BACKEND_URL = "https://mkc-backend-service-238981963438.us-central1.run.app";

    try {
        const file = formData.get("file") as File;
        if (!file) {
            throw new Error("No file provided");
        }

        // Forward the file to the Python Backend
        // We need to reconstruct FormData to send it via fetch
        const backendFormData = new FormData();
        backendFormData.append("file", file);

        const response = await fetch(`${BACKEND_URL}/upload-file`, {
            method: "POST",
            body: backendFormData,
            // @ts-ignore - Required for Node.js fetch with FormData
            duplex: "half",
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Backend Upload Error:", errorText);
            throw new Error(`Upload failed: ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        return { success: true, data: result };

    } catch (error: any) {
        console.error("Server Action Error:", error);
        return { success: false, error: error.message || "Failed to upload file to backend." };
    }
}
