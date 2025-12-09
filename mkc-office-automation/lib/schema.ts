import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    username: text('username').notNull().unique(), // Local Login
    password: text('password').notNull(),          // Hashed Password
    role: text('role').notNull(), // 'partner', 'staff', 'article'
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const attendance = pgTable('attendance', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    checkIn: timestamp('check_in').defaultNow().notNull(),
    checkOut: timestamp('check_out'),
    date: text('date').notNull(), // YYYY-MM-DD
    status: text('status').default('present'), // 'present', 'absent', 'late'
});

export const tasks = pgTable('tasks', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').default('pending').notNull(), // 'pending', 'in-progress', 'completed', 'review'
    priority: text('priority').default('medium'), // 'low', 'medium', 'high', 'urgent'
    assignedTo: integer('assigned_to').references(() => users.id),
    createdBy: integer('created_by').references(() => users.id),
    dueDate: timestamp('due_date'),
    fileUrl: text('file_url'), // Link to Google Drive file
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dailyReports = pgTable('daily_reports', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    date: text('date').notNull(), // YYYY-MM-DD (legacy field, keeping for compatibility)
    reportDate: text('report_date').notNull(), // YYYY-MM-DD - The actual work date being reported
    summary: text('summary').notNull(),
    tasksCompleted: integer('tasks_completed').default(0),
    overridden: integer('overridden').default(0).notNull(), // 0 = false, 1 = true (SQLite doesn't have boolean)
    overriddenAt: timestamp('overridden_at'), // When the checkout was overridden without report
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(), // Track when reports are updated/submitted late
});

export const activityLogs = pgTable('activity_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    activity: text('activity').notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const complianceItems = pgTable("compliance_items", {
    id: serial("id").primaryKey(),
    category: text("category").notNull(), // 'DIRECT_TAX' or 'INDIRECT_TAX'
    particular: text("particular").notNull(),
    description: text("description").notNull(),
    frequency: text("frequency").notNull(), // 'MONTHLY', 'QUARTERLY', 'ANNUAL', 'CUSTOM'
    filingDates: text("filing_dates").notNull(), // JSON array of dates/rules
    isActive: integer("is_active").default(1).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
