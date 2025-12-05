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
            // specific headers might be needed depending on fetch implementation, 
            // but usually FormData handles boundaries automatically.
            // Next.js (Node) fetch might need 'duplex: half' for streaming bodies if usage is advanced,
            // but standard form data usually works. 
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Backend Upload Error:", errorText);
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return { success: true, data: result };

    } catch (error) {
        console.error("Server Action Error:", error);
        return { success: false, error: "Failed to upload file to backend." };
    }
}
