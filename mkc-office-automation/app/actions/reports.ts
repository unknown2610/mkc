"use server";

import { db } from "@/lib/db";
import { dailyReports, users, attendance } from "@/lib/schema";
import { eq, and, desc, gte, lte, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

/**
 * Submit or update a daily report
 * @param reportDate - The work date being reported (YYYY-MM-DD)
 * @param summary - What the staff member did
 * @param tasksCompleted - Number of tasks completed
 */
export async function submitDailyReport(
    reportDate: string,
    summary: string,
    tasksCompleted: number
) {
    try {
        const session = await getSession();
        if (!session) throw new Error("Unauthorized");

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
        });

        if (!user) throw new Error("User not found");

        // Validate inputs
        if (!summary || summary.trim().length === 0) {
            return { success: false, error: "Summary is required" };
        }

        // Check if report already exists for this date
        const existing = await db.query.dailyReports.findFirst({
            where: and(
                eq(dailyReports.userId, user.id),
                eq(dailyReports.reportDate, reportDate)
            ),
        });

        const now = new Date();

        if (existing) {
            // Update existing report
            await db.update(dailyReports)
                .set({
                    summary,
                    tasksCompleted,
                    updatedAt: now,
                    overridden: 0, // Clear override flag when report is submitted
                })
                .where(eq(dailyReports.id, existing.id));
        } else {
            // Create new report
            await db.insert(dailyReports).values({
                userId: user.id,
                date: reportDate, // Keep for compatibility
                reportDate: reportDate,
                summary,
                tasksCompleted,
                overridden: 0,
                submittedAt: now,
                updatedAt: now,
            });
        }

        revalidatePath("/staff/dashboard");
        revalidatePath("/partner/dashboard");
        return { success: true };

    } catch (error) {
        console.error("Submit Daily Report Error:", error);
        return { success: false, error: "Failed to submit report" };
    }
}

/**
 * Get pending reports for current user (dates where checkout was overridden)
 */
export async function getMyPendingReports() {
    try {
        const session = await getSession();
        if (!session) return [];

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
        });

        if (!user) return [];

        // Get all attendance records where checkout happened but no report exists
        const attendanceRecords = await db.query.attendance.findMany({
            where: and(
                eq(attendance.userId, user.id),
                // Has checked out (not null checkOut)
            ),
            orderBy: desc(attendance.date),
        });

        const pendingDates: string[] = [];

        for (const record of attendanceRecords) {
            // Skip if checkOut is null (still checked in)
            if (!record.checkOut) continue;

            const dateStr = record.date;

            // Check if report exists for this date
            const report = await db.query.dailyReports.findFirst({
                where: and(
                    eq(dailyReports.userId, user.id),
                    eq(dailyReports.reportDate, dateStr)
                ),
            });

            // If no report exists, it's pending
            if (!report) {
                pendingDates.push(dateStr);
            }
        }

        // Return unique dates, sorted newest first
        return [...new Set(pendingDates)].slice(0, 10); // Limit to last 10 pending

    } catch (error) {
        console.error("Get Pending Reports Error:", error);
        return [];
    }
}

/**
 * Check if user can checkout (has submitted today's report)
 */
export async function checkCanCheckout() {
    try {
        const session = await getSession();
        if (!session) return { canCheckout: false, needsReport: true };

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
        });

        if (!user) return { canCheckout: false, needsReport: true };

        const today = new Date().toISOString().split('T')[0];

        // Check if report exists for today
        const todayReport = await db.query.dailyReports.findFirst({
            where: and(
                eq(dailyReports.userId, user.id),
                eq(dailyReports.reportDate, today)
            ),
        });

        if (todayReport) {
            return { canCheckout: true, needsReport: false };
        }

        return { canCheckout: false, needsReport: true };

    } catch (error) {
        console.error("Check Can Checkout Error:", error);
        return { canCheckout: false, needsReport: true };
    }
}

/**
 * Override checkout without report (logs the override)
 */
export async function overrideCheckout() {
    try {
        const session = await getSession();
        if (!session) throw new Error("Unauthorized");

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
        });

        if (!user) throw new Error("User not found");

        const today = new Date().toISOString().split('T')[0];

        // Create a "placeholder" report marking the override
        // Check if already exists
        const existing = await db.query.dailyReports.findFirst({
            where: and(
                eq(dailyReports.userId, user.id),
                eq(dailyReports.reportDate, today)
            ),
        });

        if (!existing) {
            // Create override record
            await db.insert(dailyReports).values({
                userId: user.id,
                date: today,
                reportDate: today,
                summary: "[Pending - Checkout Overridden]",
                tasksCompleted: 0,
                overridden: 1,
                overriddenAt: new Date(),
                submittedAt: new Date(),
                updatedAt: new Date(),
            });
        }

        revalidatePath("/staff/dashboard");
        return { success: true };

    } catch (error) {
        console.error("Override Checkout Error:", error);
        return { success: false, error: "Failed to override checkout" };
    }
}

/**
 * Get all daily reports with optional filters (Partner only)
 * @param filters - Object with optional dateFrom, dateTo, userIds, showOnlyOverridden
 */
export async function getDailyReports(filters?: {
    dateFrom?: string;
    dateTo?: string;
    userIds?: number[];
    showOnlyOverridden?: boolean;
}) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') {
            throw new Error("Unauthorized - Partner access only");
        }

        // Build query conditions
        const conditions: any[] = [];

        if (filters?.dateFrom) {
            conditions.push(gte(dailyReports.reportDate, filters.dateFrom));
        }

        if (filters?.dateTo) {
            conditions.push(lte(dailyReports.reportDate, filters.dateTo));
        }

        if (filters?.userIds && filters.userIds.length > 0) {
            conditions.push(inArray(dailyReports.userId, filters.userIds));
        }

        if (filters?.showOnlyOverridden) {
            conditions.push(eq(dailyReports.overridden, 1));
        }

        // Fetch reports
        const reports = await db.query.dailyReports.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            orderBy: desc(dailyReports.reportDate),
        });

        // Enrich with user data
        const enrichedReports = await Promise.all(
            reports.map(async (report) => {
                const user = await db.query.users.findFirst({
                    where: eq(users.id, report.userId),
                });

                return {
                    id: report.id,
                    userId: report.userId,
                    userName: user?.name || "Unknown",
                    userRole: user?.role || "staff",
                    reportDate: report.reportDate,
                    summary: report.summary,
                    tasksCompleted: report.tasksCompleted,
                    overridden: report.overridden === 1,
                    overriddenAt: report.overriddenAt,
                    submittedAt: report.submittedAt,
                    updatedAt: report.updatedAt,
                };
            })
        );

        return enrichedReports;

    } catch (error) {
        console.error("Get Daily Reports Error:", error);
        return [];
    }
}

/**
 * Get list of staff members for filter dropdown (Partner only)
 */
export async function getStaffListForFilters() {
    try {
        const session = await getSession();
        if (!session || session.role !== 'partner') {
            throw new Error("Unauthorized");
        }

        const staffMembers = await db.query.users.findMany({
            where: eq(users.role, 'staff'),
        });

        return staffMembers.map(s => ({
            id: s.id,
            name: s.name,
            role: s.role,
        }));

    } catch (error) {
        console.error("Get Staff List Error:", error);
        return [];
    }
}
