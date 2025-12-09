"use server";

import { db } from "@/lib/db";
import { complianceItems } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { eq, and, or, like, desc } from "drizzle-orm";

interface ComplianceItem {
    id?: number;
    category: 'DIRECT_TAX' | 'INDIRECT_TAX';
    particular: string;
    description: string;
    frequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM';
    filingDates: string;
    isActive?: number;
}

// Get upcoming compliances (next N days)
export async function getUpcomingCompliances(days: number = 30) {
    const session = await getSession();
    if (!session?.userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const allCompliances = await db
            .select()
            .from(complianceItems)
            .where(eq(complianceItems.isActive, 1))
            .orderBy(complianceItems.particular);

        // Calculate next filing dates
        const today = new Date();
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + days);

        const upcomingItems = allCompliances.map(item => {
            const filingDatesData = JSON.parse(item.filingDates);
            const nextDate = calculateNextFilingDate(filingDatesData, item.frequency);

            return {
                ...item,
                nextFilingDate: nextDate,
                daysUntilDue: nextDate ? Math.ceil((new Date(nextDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null,
                filingDatesData
            };
        }).filter(item => {
            if (!item.nextFilingDate) return false;
            const nextDate = new Date(item.nextFilingDate);
            return nextDate >= today && nextDate <= targetDate;
        }).sort((a, b) => {
            if (!a.nextFilingDate || !b.nextFilingDate) return 0;
            return new Date(a.nextFilingDate).getTime() - new Date(b.nextFilingDate).getTime();
        });

        return { success: true, data: upcomingItems };
    } catch (error) {
        console.error("Error fetching upcoming compliances:", error);
        return { success: false, error: "Failed to fetch compliances" };
    }
}

// Get all compliance items (with optional filtering)
export async function getAllCompliances(category?: string) {
    const session = await getSession();
    if (!session?.userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        let query = db.select().from(complianceItems);

        if (category && category !== 'ALL') {
            query = query.where(and(
                eq(complianceItems.category, category),
                eq(complianceItems.isActive, 1)
            )) as any;
        } else {
            query = query.where(eq(complianceItems.isActive, 1)) as any;
        }

        const items = await query.orderBy(complianceItems.category, complianceItems.particular);

        // Add next filing date to each item
        const itemsWithDates = items.map(item => {
            const filingDatesData = JSON.parse(item.filingDates);
            const nextDate = calculateNextFilingDate(filingDatesData, item.frequency);

            return {
                ...item,
                nextFilingDate: nextDate,
                filingDatesData
            };
        });

        return { success: true, data: itemsWithDates };
    } catch (error) {
        console.error("Error fetching all compliances:", error);
        return { success: false, error: "Failed to fetch compliances" };
    }
}

// Get staff compliances (next 5 upcoming)
export async function getStaffCompliances() {
    const session = await getSession();
    if (!session?.userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const result = await getUpcomingCompliances(90); // Look 90 days ahead

        if (!result.success || !result.data) {
            return { success: false, error: "Failed to fetch compliances" };
        }

        // Take only first 5
        const topFive = result.data.slice(0, 5);

        return { success: true, data: topFive };
    } catch (error) {
        console.error("Error fetching staff compliances:", error);
        return { success: false, error: "Failed to fetch compliances" };
    }
}

// Add new compliance item (partner only)
export async function addComplianceItem(data: ComplianceItem) {
    const session = await getSession();
    if (!session?.userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await db.insert(complianceItems).values({
            category: data.category,
            particular: data.particular,
            description: data.description,
            frequency: data.frequency,
            filingDates: data.filingDates,
            isActive: 1,
        });

        return { success: true, message: "Compliance item added successfully" };
    } catch (error) {
        console.error("Error adding compliance item:", error);
        return { success: false, error: "Failed to add compliance item" };
    }
}

// Update compliance item
export async function updateComplianceItem(id: number, data: Partial<ComplianceItem>) {
    const session = await getSession();
    if (!session?.userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await db
            .update(complianceItems)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(complianceItems.id, id));

        return { success: true, message: "Compliance item updated successfully" };
    } catch (error) {
        console.error("Error updating compliance item:", error);
        return { success: false, error: "Failed to update compliance item" };
    }
}

// Toggle compliance status (active/archived)
export async function toggleComplianceStatus(id: number) {
    const session = await getSession();
    if (!session?.userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const item = await db
            .select()
            .from(complianceItems)
            .where(eq(complianceItems.id, id))
            .limit(1);

        if (!item || item.length === 0) {
            return { success: false, error: "Compliance item not found" };
        }

        const newStatus = item[0].isActive === 1 ? 0 : 1;

        await db
            .update(complianceItems)
            .set({ isActive: newStatus, updatedAt: new Date() })
            .where(eq(complianceItems.id, id));

        return { success: true, message: `Compliance item ${newStatus === 1 ? 'activated' : 'archived'} successfully` };
    } catch (error) {
        console.error("Error toggling compliance status:", error);
        return { success: false, error: "Failed to toggle status" };
    }
}

// Helper function to calculate next filing date
function calculateNextFilingDate(filingDatesData: any, frequency: string): string | null {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed

    try {
        if (frequency === 'MONTHLY') {
            // For monthly, find the next occurrence of the filing date
            const dayOfMonth = parseInt(filingDatesData.day);
            let nextDate = new Date(currentYear, currentMonth, dayOfMonth);

            if (nextDate <= today) {
                nextDate = new Date(currentYear, currentMonth + 1, dayOfMonth);
            }

            return nextDate.toISOString().split('T')[0];
        }

        if (frequency === 'QUARTERLY') {
            // Parse quarterly dates like "31st July", "31st October", etc.
            const quarters = filingDatesData.dates || [];
            const upcomingDates = quarters.map((dateStr: string) => {
                const parsed = parseIndianDate(dateStr, currentYear);
                if (parsed <= today) {
                    return parseIndianDate(dateStr, currentYear + 1);
                }
                return parsed;
            }).filter((d: Date) => d > today);

            if (upcomingDates.length > 0) {
                upcomingDates.sort((a: Date, b: Date) => a.getTime() - b.getTime());
                return upcomingDates[0].toISOString().split('T')[0];
            }
        }

        if (frequency === 'ANNUAL') {
            // Parse annual date like "31st December", "30th November"
            const dateStr = filingDatesData.date || filingDatesData;
            let nextDate = parseIndianDate(dateStr, currentYear);

            if (nextDate <= today) {
                nextDate = parseIndianDate(dateStr, currentYear + 1);
            }

            return nextDate.toISOString().split('T')[0];
        }

        return null;
    } catch (error) {
        console.error("Error calculating next filing date:", error);
        return null;
    }
}

// Helper to parse Indian date format like "15th June", "31st October"
function parseIndianDate(dateStr: string, year: number): Date {
    const months: { [key: string]: number } = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
        'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
    };

    // Extract day and month from strings like "15th June" or "31st October"
    const match = dateStr.match(/(\d+)(?:st|nd|rd|th)?\s+(\w+)/i);
    if (!match) {
        throw new Error(`Invalid date format: ${dateStr}`);
    }

    const day = parseInt(match[1]);
    const monthName = match[2].toLowerCase();
    const month = months[monthName];

    if (month === undefined) {
        throw new Error(`Invalid month: ${monthName}`);
    }

    return new Date(year, month, day);
}

// Seed compliance data from the provided image
export async function seedComplianceData() {
    // Temporarily allow seeding without auth check - one time setup
    try {
        const complianceData: ComplianceItem[] = [
            // Direct Taxes
            {
                category: 'DIRECT_TAX',
                particular: 'Advance Tax Payment',
                description: 'Quarterly advance tax payment',
                frequency: 'QUARTERLY',
                filingDates: JSON.stringify({ dates: ['15th June', '15th September', '15th December', '15th March'] })
            },
            {
                category: 'DIRECT_TAX',
                particular: 'Corporate Income Tax Return (ITR-7 & ITR-6)',
                description: 'Return of Income (Form ITR-7 & Form ITR-6)',
                frequency: 'ANNUAL',
                filingDates: JSON.stringify({ date: '31st October', conditional: '30th November if transfer pricing applicable' })
            },
            {
                category: 'DIRECT_TAX',
                particular: 'Monthly TDS Deposit',
                description: 'TDS Deposit (Payment & Returns)',
                frequency: 'MONTHLY',
                filingDates: JSON.stringify({ day: '7' })
            },
            {
                category: 'DIRECT_TAX',
                particular: 'TDS Return Filing (24Q, 26Q, 27Q)',
                description: 'Filing of TDS Return (Salary and Non Salary) - Form 24Q, Form 26Q, Form 27Q',
                frequency: 'QUARTERLY',
                filingDates: JSON.stringify({ dates: ['31st July', '31st October', '31st January', '31st May'] })
            },
            {
                category: 'DIRECT_TAX',
                particular: 'Form 16A',
                description: 'Tax Certificate (Non-Salary)',
                frequency: 'QUARTERLY',
                filingDates: JSON.stringify({ dates: ['15th August', '15th November', '15th February', '15th June'] })
            },
            {
                category: 'DIRECT_TAX',
                particular: 'Form 16',
                description: 'Tax Certificate (Salary)',
                frequency: 'ANNUAL',
                filingDates: JSON.stringify({ date: '15th June' })
            },
            {
                category: 'DIRECT_TAX',
                particular: 'Form 15CA/15CB',
                description: 'Certification for withdrawing taxes on foreign remittances',
                frequency: 'CUSTOM',
                filingDates: JSON.stringify({ note: 'At the time of foreign remittance' })
            },
            {
                category: 'DIRECT_TAX',
                particular: 'Form 3CD + Tax Auditor Certificate (Form 3CB)',
                description: 'Tax Audit (applicable in case of turnover INR 1 crore)',
                frequency: 'ANNUAL',
                filingDates: JSON.stringify({ date: '30th September', conditional: '30th November if transfer pricing applicable' })
            },
            {
                category: 'DIRECT_TAX',
                particular: 'Form 3CEB',
                description: 'Transfer pricing (applicable in case of foreign related party transactions)',
                frequency: 'ANNUAL',
                filingDates: JSON.stringify({ date: '30th November' })
            },
            {
                category: 'DIRECT_TAX',
                particular: 'Form 61A',
                description: 'Specified Financial transaction',
                frequency: 'ANNUAL',
                filingDates: JSON.stringify({ date: '31st May' })
            },

            // GST - Indirect Taxes
            {
                category: 'INDIRECT_TAX',
                particular: 'Form GSTR-1 (Details of Outward Supplies)',
                description: 'For registered persons having turnover exceeding 1.5 Crore',
                frequency: 'MONTHLY',
                filingDates: JSON.stringify({ day: '11' })
            },
            {
                category: 'INDIRECT_TAX',
                particular: 'Form GSTR-1 (Quarterly)',
                description: 'For registered persons having turnover less than 1.5 crore',
                frequency: 'QUARTERLY',
                filingDates: JSON.stringify({ note: 'Last day of succeeding month from the end of quarter' })
            },
            {
                category: 'INDIRECT_TAX',
                particular: 'Form GSTR-3B (Monthly Return)',
                description: 'For registered person having aggregate turnover exceeding INR 5 crore',
                frequency: 'MONTHLY',
                filingDates: JSON.stringify({ day: '20' })
            },
            {
                category: 'INDIRECT_TAX',
                particular: 'Form GSTR-6',
                description: 'Return for Input service distributor (Form GSTR-6)',
                frequency: 'MONTHLY',
                filingDates: JSON.stringify({ day: '13' })
            },
            {
                category: 'INDIRECT_TAX',
                particular: 'Annual Return - Form GSTR-9',
                description: 'GST Audit (GSTR-9C) applicable if turnover is INR 2 Crore or more',
                frequency: 'ANNUAL',
                filingDates: JSON.stringify({ date: '31st December' })
            },
            {
                category: 'INDIRECT_TAX',
                particular: 'Form GSTR-4',
                description: 'Annual Return under Composition Scheme',
                frequency: 'ANNUAL',
                filingDates: JSON.stringify({ date: '30th April' })
            },
            {
                category: 'INDIRECT_TAX',
                particular: 'Form CMP-08',
                description: 'Quarterly Return under Composition Scheme',
                frequency: 'QUARTERLY',
                filingDates: JSON.stringify({ note: '18th day of succeeding month of the end of quarter' })
            },
            {
                category: 'INDIRECT_TAX',
                particular: 'Form GSTR-7 (Return of TDS)',
                description: 'Return by Registered persons who are required to deduct tax',
                frequency: 'MONTHLY',
                filingDates: JSON.stringify({ day: '10' })
            },
            {
                category: 'INDIRECT_TAX',
                particular: 'Form GSTR-8',
                description: 'Monthly Statement by E-Commerce Operator',
                frequency: 'MONTHLY',
                filingDates: JSON.stringify({ day: '10' })
            },
        ];

        // Insert all compliance items
        for (const item of complianceData) {
            await db.insert(complianceItems).values(item);
        }

        return { success: true, message: `Successfully seeded ${complianceData.length} compliance items` };
    } catch (error) {
        console.error("Error seeding compliance data:", error);
        return { success: false, error: "Failed to seed compliance data" };
    }
}
