import * as dotenv from 'dotenv';
dotenv.config();

import { db } from "../lib/db";
import { users } from "../lib/schema";
import { eq } from "drizzle-orm";

const STAFF = [
    { name: "Vishal", email: "vishal@mkc.com", role: "staff" },
    { name: "Rizwan", email: "rizwan@mkc.com", role: "staff" },
    { name: "Nishant", email: "nishant@mkc.com", role: "article" },
    { name: "Gurpreet", email: "gurpreet@mkc.com", role: "article" },
];

const PARTNERS = [
    { name: "CA Vineet", email: "vineet@mkc.com", role: "partner" },
    { name: "CA Ishan", email: "ishan@mkc.com", role: "partner" },
    { name: "CA Kashish", email: "kashish@mkc.com", role: "partner" },
    { name: "CA Kavish", email: "kavish@mkc.com", role: "partner" },
];

async function main() {
    console.log("🌱 Seeding database...");

    // Seed Staff
    for (const staff of STAFF) {
        const existing = await db.select().from(users).where(eq(users.email, staff.email));
        if (existing.length === 0) {
            await db.insert(users).values(staff);
            console.log(`Created user: ${staff.name}`);
        } else {
            console.log(`User ${staff.name} already exists`);
        }
    }

    // Seed Partners
    for (const partner of PARTNERS) {
        const existing = await db.select().from(users).where(eq(users.email, partner.email));
        if (existing.length === 0) {
            await db.insert(users).values(partner);
            console.log(`Created partner: ${partner.name}`);
        } else {
            console.log(`Partner ${partner.name} already exists`);
        }
    }

    console.log("✅ Seeding complete!");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
