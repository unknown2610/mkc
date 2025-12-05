import 'dotenv/config';
import { db } from "../lib/db";
import { users } from "../lib/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from 'bcryptjs';

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
    console.log("🌱 Seeding database with credentials...");

    // NOTE: Simple password usage for seed only. Username = Name, Password = Name
    const ALL_USERS = [...STAFF, ...PARTNERS];

    for (const u of ALL_USERS) {
        // Clean name for username (e.g. "CA Vineet" -> "vineet", "Arjun Singh" -> "arjun")
        // Actually user wanted "Username as their name". Let's use First Name lowercased to be safe/simple, or full name?
        // "LOGIN WILL HAVE USERNAME AS THEIR NAME". Let's key off email for simplicity or just use the name field directly.
        // Let's use the 'name' field as the username, but maybe trim it?
        const username = u.name;
        const rawPassword = u.name;

        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // Check existence
        const existing = await db.select().from(users).where(eq(users.email, u.email));

        if (existing.length === 0) {
            await db.insert(users).values({
                name: u.name,
                email: u.email,
                role: u.role,
                username: username,
                password: hashedPassword,
            });
            console.log(`Created user: ${u.name}`);
        } else {
            // Update existing user with username/password if missing
            const user = existing[0];
            // We'll update the password/username for everyone to ensure they can login
            await db.update(users).set({
                username: username,
                password: hashedPassword
            }).where(eq(users.id, user.id));
            console.log(`Updated credentials for: ${u.name}`);
        }
    }

    console.log("✅ Seeding complete!");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
