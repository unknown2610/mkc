"use server";

import { db } from "@/lib/db";
import { users, attendance, activityLogs, tasks } from "@/lib/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { getSession } from "@/lib/auth";

/**
 * Get comprehensive staff details (Partner only)
 */
export async function getStaffDetail(staffId: number) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') {
            throw new Error("Unauthorized - Partner access only");
        }

        const staff = await db.query.users.findFirst({
            where: eq(users.id, staffId),
        });

        if (!staff) {
            return null;
        }

        // Get today's attendance
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = await db.query.attendance.findFirst({
            where: and(
                eq(attendance.userId, staffId),
                eq(attendance.date, today)
            ),
        });

        // Get latest activity
        const latestActivity = await db.query.activityLogs.findFirst({
            where: eq(activityLogs.userId, staffId),
            orderBy: desc(activityLogs.timestamp),
        });

        return {
            id: staff.id,
            name: staff.name,
            email: staff.email,
            role: staff.role,
            todayCheckIn: todayAttendance?.checkIn || null,
            todayCheckOut: todayAttendance?.checkOut || null,
            isCheckedIn: todayAttendance ? !todayAttendance.checkOut : false,
            lastActivity: latestActivity?.activity || null,
            lastActivityTime: latestActivity?.timestamp || null,
        };

    } catch (error) {
        console.error("Get Staff Detail Error:", error);
        return null;
    }
}

/**
 * Get staff attendance history (Partner only)
 */
export async function getStaffAttendanceHistory(staffId: number, days: number = 7) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') {
            throw new Error("Unauthorized");
        }

        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - days);
        const startDate = daysAgo.toISOString().split('T')[0];

        const attendanceRecords = await db.query.attendance.findMany({
            where: and(
                eq(attendance.userId, staffId),
                gte(attendance.date, startDate)
            ),
            orderBy: desc(attendance.date),
        });

        return attendanceRecords.map(record => ({
            date: record.date,
            checkIn: record.checkIn,
            checkOut: record.checkOut,
            status: record.status,
        }));

    } catch (error) {
        console.error("Get Attendance History Error:", error);
        return [];
    }
}

/**
 * Get staff activity timeline for specific date (Partner only)
 */
export async function getStaffActivityTimeline(staffId: number, date?: string) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') {
            throw new Error("Unauthorized");
        }

        const targetDate = date || new Date().toISOString().split('T')[0];

        // Get activity logs for the specific date
        const activities = await db.query.activityLogs.findMany({
            where: eq(activityLogs.userId, staffId),
            orderBy: desc(activityLogs.timestamp),
        });

        // Filter by date on the returned results
        const filteredActivities = activities.filter(activity => {
            const activityDate = new Date(activity.timestamp).toISOString().split('T')[0];
            return activityDate === targetDate;
        });

        return filteredActivities.map(activity => ({
            id: activity.id,
            activity: activity.activity,
            timestamp: activity.timestamp,
        }));

    } catch (error) {
        console.error("Get Activity Timeline Error:", error);
        return [];
    }
}

/**
 * Get staff's active/assigned tasks (Partner only)
 */
export async function getStaffActiveTasks(staffId: number) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') {
            throw new Error("Unauthorized");
        }

        const staffTasks = await db.query.tasks.findMany({
            where: and(
                eq(tasks.assignedTo, staffId),
            ),
            orderBy: desc(tasks.createdAt),
        });

        return staffTasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            fileUrl: task.fileUrl,
            createdAt: task.createdAt,
        }));

    } catch (error) {
        console.error("Get Staff Tasks Error:", error);
        return [];
    }
}
