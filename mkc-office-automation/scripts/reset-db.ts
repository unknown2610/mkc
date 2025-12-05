import * as dotenv from 'dotenv';
dotenv.config();

import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function reset() {
    console.log("⚠️  Resetting database...");

    // Drop tables in reverse order of dependencies
    await db.execute(sql`DROP TABLE IF EXISTS "activity_logs" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "daily_reports" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "tasks" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "attendance" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "users" CASCADE;`);

    console.log("✅ Database reset complete.");
    process.exit(0);
}

reset().catch((err) => {
    console.error("Reset failed:", err);
    process.exit(1);
});
