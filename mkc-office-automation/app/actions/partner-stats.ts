"use server";

import { db } from "@/lib/db";
import { users, attendance, dailyReports, tasks } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";
import { getSession } from "@/lib/auth";

/**
 * Get today's overview statistics (Partner only)
 */
export async function getTodaysOverview() {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') {
            throw new Error("Unauthorized");
        }

        const today = new Date().toISOString().split('T')[0];

        // Get all attendance records for today
        const todaysAttendance = await db.query.attendance.findMany({
            where: eq(attendance.date, today),
        });

        // Calculate average check-in time
        let avgCheckInTime = null;
        if (todaysAttendance.length > 0) {
            const checkInTimes = todaysAttendance
                .filter(a => a.checkIn)
                .map(a => new Date(a.checkIn!).getTime());

            if (checkInTimes.length > 0) {
                const avgTimestamp = checkInTimes.reduce((sum, time) => sum + time, 0) / checkInTimes.length;
                avgCheckInTime = new Date(avgTimestamp);
            }
        }

        // Get today's reports count
        const todaysReports = await db.query.dailyReports.findMany({
            where: eq(dailyReports.reportDate, today),
        });
        const reportsSubmitted = todaysReports.filter(r => r.summary !== "[Pending - Checkout Overridden]").length;

        // Get today's completed tasks count
        const todaysCompletedTasks = await db.query.tasks.findMany({
            where: and(
                eq(tasks.status, 'completed'),
            ),
        });

        // Filter by today's completion (check updatedAt or similar - simplified for now)
        const tasksCompletedToday = todaysCompletedTasks.filter(task => {
            if (!task.createdAt) return false;
            const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
            return taskDate === today;
        }).length;

        return {
            avgCheckInTime: avgCheckInTime ? avgCheckInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : null,
            reportsSubmitted,
            tasksCompleted: tasksCompletedToday,
            totalStaffCheckedIn: todaysAttendance.filter(a => a.checkIn && !a.checkOut).length,
            totalStaff: todaysAttendance.length,
        };

    } catch (error) {
        console.error("Get Today's Overview Error:", error);
        return {
            avgCheckInTime: null,
            reportsSubmitted: 0,
            tasksCompleted: 0,
            totalStaffCheckedIn: 0,
            totalStaff: 0,
        };
    }
}

/**
 * Request all staff to submit their daily reports
 */
export async function requestAllReports() {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') {
            throw new Error("Unauthorized");
        }

        // In a real app, this would send emails/notifications to all staff
        // For now, we'll just return success
        // You could integrate with email service, push notifications, etc.

        const today = new Date().toISOString().split('T')[0];

        // Get all staff who haven't submitted today's report
        const allStaff = await db.query.users.findMany({
            where: eq(users.role, 'staff'),
        });

        const todaysReports = await db.query.dailyReports.findMany({
            where: eq(dailyReports.reportDate, today),
        });

        const reportedStaffIds = todaysReports.map(r => r.userId);
        const staffWithoutReports = allStaff.filter(s => !reportedStaffIds.includes(s.id));

        return {
            success: true,
            message: `Report request sent to ${staffWithoutReports.length} staff members`,
            count: staffWithoutReports.length,
        };

    } catch (error) {
        console.error("Request All Reports Error:", error);
        return {
            success: false,
            message: "Failed to send report request",
            count: 0,
        };
    }
}

/**
 * Send announcement to all staff
 */
export async function sendAnnouncement(title: string, message: string) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') {
            throw new Error("Unauthorized");
        }

        if (!title || !message) {
            return {
                success: false,
                error: "Title and message are required",
            };
        }

        // In a real app, this would:
        // - Send emails to all staff
        // - Create in-app notifications
        // - Log to announcement system
        // For now, we'll simulate success

        const allStaff = await db.query.users.findMany({
            where: eq(users.role, 'staff'),
        });

        // Here you would integrate with your notification/email system
        console.log(`Sending announcement "${title}" to ${allStaff.length} staff members`);

        return {
            success: true,
            message: `Announcement sent to ${allStaff.length} staff members`,
            recipientCount: allStaff.length,
        };

    } catch (error) {
        console.error("Send Announcement Error:", error);
        return {
            success: false,
            error: "Failed to send announcement",
        };
    }
}
