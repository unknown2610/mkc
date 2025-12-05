"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { login, logout, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    if (!name || !password) {
        return { error: "Name and password are required." };
    }

    let role = "";

    try {
        // Authenticate based on Name/Username
        const user = await db.query.users.findFirst({
            where: eq(users.username, name)
        });

        if (!user) {
            return { error: "User not found." };
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { error: "Invalid credentials." };
        }

        role = user.role;

        // Login successful, create session
        await login({ id: user.id, name: user.name, email: user.email, role: user.role });

    } catch (error) {
        console.error("Login Error:", error);
        return { error: "An unexpected error occurred." };
    }

    if (role === 'partner') {
        redirect("/partner/dashboard");
    } else {
        redirect("/staff/dashboard");
    }
}

export async function logoutAction() {
    await logout();
    redirect("/login");
}

export async function changePasswordAction(formData: FormData) {
    const currentPass = formData.get("current") as string;
    const newPass = formData.get("new") as string;

    const session = await getSession();
    if (!session || !session.id) {
        return { success: false, error: "Unauthorized" };
    }
    const userId = Number(session.id); // Ensure number

    // 1. Verify current password
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    if (!user) return { success: false, error: "User not found" };

    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) return { success: false, error: "Incorrect current password" };

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(newPass, 10);

    // 3. Update DB
    await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, userId));

    return { success: true };
}
