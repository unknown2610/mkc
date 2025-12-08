"use server";

import { db } from "@/lib/db";
import { attendance, activityLogs, tasks, users, dailyReports } from "@/lib/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function getLiveOverview() {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') return null;

        const today = new Date().toISOString().split('T')[0];

        // 1. Get All Staff
        const allStaff = await db.query.users.findMany({
            where: (users, { ne }) => ne(users.role, 'partner'),
            columns: { id: true, name: true, role: true }
        });

        // 2. Get Today's Attendance for these staff
        // Note: Drizzle's query builder is easiest for this join, but let's do parallel queries for simplicity
        const attendanceRecords = await db.select()
            .from(attendance)
            .where(
                and(
                    eq(attendance.date, today),
                    // We really want only latest status, but assuming one record per day per user for now
                    // or we handle multiple check-ins logically
                )
            );

        // 3. Get Latest Activity per user
        // Distinct on userId, order by timestamp desc is tricky in simple API, 
        // let's just fetch all today's logs and filter in JS for small teams (simpler dev)
        // Optimization: In prod, use window functions or proper SQL aggregation. 
        const todayLogs = await db.select()
            .from(activityLogs)
            .where(sql`DATE(${activityLogs.timestamp}) = ${today}`)
            .orderBy(desc(activityLogs.timestamp));

        // 4. Construct Live Status List
        const liveStatus = allStaff.map(staff => {
            // Find ALL records for this user today
            const userRecords = attendanceRecords.filter(a => a.userId === staff.id);

            // Find if ANY record is an active session (no check-out)
            const activeSession = userRecords.find(a => !a.checkOut);

            // Find latest activity
            const lastLog = todayLogs.find(l => l.userId === staff.id);

            return {
                ...staff,
                isCheckedIn: !!activeSession,
                checkInTime: activeSession?.checkIn || null,
                lastActivity: lastLog?.activity || (activeSession ? "Checked In" : "Offline"),
                lastActivityTime: lastLog?.timestamp
            };
        });

        // 5. Calculate Stats
        const presentCount = liveStatus.filter(s => s.isCheckedIn).length;

        // Count tasks completed today
        // We'll approximate this by checking tasks updated to 'completed' today 
        // OR use dailyReports submitted today. Let's use dailyReports summation
        const reportsResult = await db.select({
            totalTasks: sql<number>`sum(${dailyReports.tasksCompleted})`
        }).from(dailyReports).where(eq(dailyReports.date, today));

        const tasksCompletedToday = reportsResult[0]?.totalTasks || 0;

        // Reports submitted count
        const reportsCountRes = await db.select({ count: sql<number>`count(*)` })
            .from(dailyReports)
            .where(eq(dailyReports.date, today));

        const reportsSubmittedCount = reportsCountRes[0]?.count || 0;

        return {
            staffStatus: liveStatus,
            stats: {
                presentCount,
                tasksCompletedToday: Number(tasksCompletedToday),
                reportsSubmittedCount: Number(reportsSubmittedCount)
            }
        };

    } catch (error) {
        console.error("Get Overview Error:", error);
        return null;
    }
}
