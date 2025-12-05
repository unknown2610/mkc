"use server";

import { db } from "@/lib/db";
import { tasks, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

export async function createTask(formData: FormData) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') {
            return { success: false, error: "Unauthorized" };
        }

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const assignedTo = formData.get("assignedTo") as string; // User ID
        const deadline = formData.get("deadline") as string;
        const file = formData.get("file") as File;

        if (!title || !assignedTo) {
            return { success: false, error: "Title and Assignee are required" };
        }

        let fileUrl = null;

        // Handle File Upload if present
        if (file && file.size > 0) {
            try {
                const blob = await put(file.name, file, {
                    access: 'public',
                });
                fileUrl = blob.url;
            } catch (err) {
                return { success: false, error: "Blob upload failed: " + (err as Error).message };
            }
        }

        // Insert Task
        await db.insert(tasks).values({
            title,
            description,
            assignedTo: parseInt(assignedTo),
            createdBy: session.id,
            dueDate: deadline ? new Date(deadline) : null,
            fileUrl: fileUrl,
            status: 'pending',
            priority: 'medium' // Default for now
        });

        revalidatePath("/partner/dashboard");
        revalidatePath("/staff/dashboard");

        return { success: true };

    } catch (error) {
        console.error("Create Task Error:", error);
        return { success: false, error: "Failed to create task" };
    }
}

export async function getStaffTasks() {
    try {
        const session = await getSession();
        if (!session) return [];

        const userTasks = await db.query.tasks.findMany({
            where: eq(tasks.assignedTo, session.id),
            orderBy: desc(tasks.createdAt),
            with: {
                // We might want creator name later, but simple join/query is fine
            }
        });

        // Enrich with Creator Name manually if needed, or assume simple display
        // Let's perform a join or manual fetch if needed. Drizzle 'with' needs relations defined.
        // For now, let's just return tasks. The UI can display "Assigned by Partner".
        return userTasks;

    } catch (error) {
        console.error("Get Staff Tasks Error:", error);
        return [];
    }
}

export async function getStaffList() {
    // Helper to get list of staff for the select dropdown
    try {
        return await db.query.users.findMany({
            where: (users, { ne }) => ne(users.role, 'partner'),
            columns: { id: true, name: true, role: true }
        });
    } catch (error) {
        console.error("fetch staff list error", error);
        return [];
    }
}
