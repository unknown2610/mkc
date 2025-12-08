"use server";

import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Get all tasks created by the current partner
 */
export async function getPartnerTasks() {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') {
            return { success: false, error: "Unauthorized", tasks: [] };
        }

        const partnerTasks = await db.query.tasks.findMany({
            where: eq(tasks.createdBy, session.id),
            orderBy: desc(tasks.createdAt),
            with: {
                assignedToUser: {
                    columns: {
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        return { success: true, tasks: partnerTasks };
    } catch (error) {
        console.error("Get Partner Tasks Error:", error);
        return { success: false, error: "Failed to fetch tasks", tasks: [] };
    }
}

/**
 * Cancel/delete a task (only if created by current partner)
 */
export async function cancelTask(taskId: number) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') {
            return { success: false, error: "Unauthorized" };
        }

        // Verify the task was created by this partner
        const task = await db.query.tasks.findFirst({
            where: eq(tasks.id, taskId)
        });

        if (!task) {
            return { success: false, error: "Task not found" };
        }

        if (task.createdBy !== session.id) {
            return { success: false, error: "You can only cancel your own tasks" };
        }

        // Delete the task
        await db.delete(tasks).where(eq(tasks.id, taskId));

        // Revalidate dashboards
        revalidatePath("/partner/dashboard");
        revalidatePath("/staff/dashboard");

        return { success: true };
    } catch (error) {
        console.error("Cancel Task Error:", error);
        return { success: false, error: "Failed to cancel task" };
    }
}
