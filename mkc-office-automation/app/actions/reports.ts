"use server";

import { db } from "@/lib/db";
import { dailyReports, users } from "@/lib/schema";
import { desc, eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitDailyReport(formData: FormData) {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const summary = formData.get("summary") as string;
        const tasksCompleted = formData.get("tasksCompleted"); // Optional

        if (!summary) {
            return { success: false, error: "Summary is required" };
        }

        // Check if report already exists for today? Maybe allow multiple or appending. 
        // For simplicity, let's allow inserting a new row.

        const today = new Date().toISOString().split('T')[0];

        await db.insert(dailyReports).values({
            userId: session.id,
            date: today,
            summary,
            tasksCompleted: tasksCompleted ? parseInt(tasksCompleted.toString()) : 0,
        });

        revalidatePath("/staff/dashboard");
        revalidatePath("/partner/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Submit Report Error:", error);
        return { success: false, error: "Failed to submit report" };
    }
}

export async function getMyReports() {
    try {
        const session = await getSession();
        if (!session) return [];

        return await db.select()
            .from(dailyReports)
            .where(eq(dailyReports.userId, session.id))
            .orderBy(desc(dailyReports.submittedAt));
    } catch (error) {
        console.error("Get My Reports Error:", error);
        return [];
    }
}

export async function getAllReports() {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') return [];

        // Join with users to get name
        const reports = await db.select({
            id: dailyReports.id,
            userId: dailyReports.userId,
            userName: users.name,
            date: dailyReports.date,
            summary: dailyReports.summary,
            tasksCompleted: dailyReports.tasksCompleted,
            submittedAt: dailyReports.submittedAt
        })
            .from(dailyReports)
            .innerJoin(users, eq(dailyReports.userId, users.id))
            .orderBy(desc(dailyReports.submittedAt));

        return reports;
    } catch (error) {
        console.error("Get All Reports Error:", error);
        return [];
    }
}
