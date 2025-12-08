"use server";

import { db } from "@/lib/db";
import { attendance, activityLogs, users, dailyReports } from "@/lib/schema";
import { eq, and, desc, isNull, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";

// ...

export async function getStaffState() {
    try {
        const session = await getSession();
        if (!session) return { isCheckedIn: false, checkInTime: null, lastActivity: "" };

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
        });

        if (!user) return { isCheckedIn: false, checkInTime: null, lastActivity: "" };

        // Find active check-in (no check-out time)
        const activeSession = await db.query.attendance.findFirst({
            where: and(
                eq(attendance.userId, user.id),
                isNull(attendance.checkOut)
            ),
            orderBy: desc(attendance.checkIn)
        });

        // Find last activity
        const lastLog = await db.query.activityLogs.findFirst({
            where: eq(activityLogs.userId, user.id),
            orderBy: desc(activityLogs.timestamp)
        });

        return {
            isCheckedIn: !!activeSession,
            checkInTime: activeSession?.checkIn || null,
            lastActivity: lastLog?.activity || "",
            userName: user.name
        };
    } catch (error) {
        console.error("Error fetching state:", error);
        return { isCheckedIn: false, checkInTime: null, lastActivity: "", userName: "" };
    }
}

export async function getUserInfo() {
    try {
        const session = await getSession();
        if (!session) return { name: "", role: "" };
        return { name: session.name, role: session.role };
    } catch (error) {
        console.error("Error fetching user info:", error);
        return { name: "", role: "" };
    }
}

export async function toggleCheckIn() {
    try {
        const session = await getSession();
        if (!session) throw new Error("Unauthorized");

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
        });

        if (!user) throw new Error("User not found");

        // Check if currently checked in
        const activeSession = await db.query.attendance.findFirst({
            where: and(
                eq(attendance.userId, user.id),
                isNull(attendance.checkOut)
            ),
            orderBy: desc(attendance.checkIn)
        });

        if (activeSession) {
            // Check Out - Verify daily report first
            const today = new Date().toISOString().split('T')[0];
            const todayReport = await db.query.dailyReports.findFirst({
                where: and(
                    eq(dailyReports.userId, user.id),
                    eq(dailyReports.reportDate, today)
                ),
            });

            // If no report or report is just an override placeholder, block checkout
            if (!todayReport || todayReport.summary === "[Pending - Checkout Overridden]") {
                return {
                    success: false,
                    needsReport: true,
                    error: "Please submit your daily report before checking out"
                };
            }

            // Proceed with checkout
            await db.update(attendance)
                .set({ checkOut: new Date() })
                .where(eq(attendance.id, activeSession.id));

            revalidatePath("/partner/dashboard");
            return { success: true, isCheckedIn: false };
        } else {
            // Check In
            await db.insert(attendance).values({
                userId: user.id,
                date: new Date().toISOString().split('T')[0],
                status: 'present'
            });

            // Also log activity
            await db.insert(activityLogs).values({
                userId: user.id,
                activity: "Checked In",
            });

            revalidatePath("/partner/dashboard");
            return { success: true, isCheckedIn: true, checkInTime: new Date() };
        }

    } catch (error) {
        console.error("Toggle CheckIn Error:", error);
        return { success: false, error: "Failed to update attendance" };
    }
}

export async function updateActivity(activityText: string) {
    try {
        const session = await getSession();
        if (!session) throw new Error("Unauthorized");

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
        });

        if (!user) throw new Error("User not found");

        await db.insert(activityLogs).values({
            userId: user.id,
            activity: activityText
        });
        revalidatePath("/partner/dashboard");
        return { success: true };

    } catch (error) {
        console.error("Update Activity Error:", error);
        return { success: false, error: "Failed to update activity" };
    }
}

export async function getAllStaffStatus() {
    try {
        // Get all users who are NOT partners (so staff, managers, articles)
        const allUsers = await db.query.users.findMany({
            where: ne(users.role, 'partner')
        });

        // For each user, get their status
        const statusPromises = allUsers.map(async (user) => {

            // 1. Check if they are currently checked in
            const activeSession = await db.query.attendance.findFirst({
                where: and(
                    eq(attendance.userId, user.id),
                    isNull(attendance.checkOut)
                ),
                orderBy: desc(attendance.checkIn)
            });

            // 2. Get their latest activity log
            const lastLog = await db.query.activityLogs.findFirst({
                where: eq(activityLogs.userId, user.id),
                orderBy: desc(activityLogs.timestamp)
            });

            // Determine Status string
            let status = 'offline';
            if (activeSession) status = 'online';

            return {
                id: user.id,
                name: user.name,
                role: user.role === 'staff' ? "Staff" : "Article", // Simple mapping for now
                status: status,
                activity: lastLog?.activity || "No recent activity",
                lastUpdate: lastLog?.timestamp ? new Date(lastLog.timestamp).toISOString() : null
            };
        });

        return await Promise.all(statusPromises);

    } catch (error) {
        console.error("Get All Staff Status Error:", error);
        return [];
    }
}
