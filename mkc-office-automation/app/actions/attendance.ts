"use server";

import { db } from "@/lib/db";
import { attendance, activityLogs, users } from "@/lib/schema";
import { eq, and, desc, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Hardcoded for Demo
const CURRENT_USER_EMAIL = "arjun@mkc.com";

export async function getStaffState() {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, CURRENT_USER_EMAIL),
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
            lastActivity: lastLog?.activity || ""
        };
    } catch (error) {
        console.error("Error fetching state:", error);
        return { isCheckedIn: false, checkInTime: null, lastActivity: "" };
    }
}

export async function toggleCheckIn() {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, CURRENT_USER_EMAIL),
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
            // Check Out
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
        const user = await db.query.users.findFirst({
            where: eq(users.email, CURRENT_USER_EMAIL),
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
