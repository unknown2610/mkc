import * as dotenv from 'dotenv';
dotenv.config();

import { db } from "../lib/db";
import { users } from "../lib/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("🌱 Seeding database...");

    // 1. Create Staff User (Arjun)
    const existingStaff = await db.select().from(users).where(eq(users.email, "arjun@mkc.com"));
    if (existingStaff.length === 0) {
        await db.insert(users).values({
            name: "Arjun Singh",
            email: "arjun@mkc.com",
            role: "staff",
        });
        console.log("Created staff user: Arjun");
    } else {
        console.log("Staff user already exists.");
    }

    // 2. Create Partner User (Kartik)
    const existingPartner = await db.select().from(users).where(eq(users.email, "kartik@mkc.com"));
    if (existingPartner.length === 0) {
        await db.insert(users).values({
            name: "Kartik Mahajan",
            email: "kartik@mkc.com",
            role: "partner",
        });
        console.log("Created partner user: Kartik");
    } else {
        console.log("Partner user already exists.");
    }

    console.log("✅ Seeding complete!");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
