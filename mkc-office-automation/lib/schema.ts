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
    date: text('date').notNull(), // YYYY-MM-DD
    summary: text('summary').notNull(),
    tasksCompleted: integer('tasks_completed').default(0),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

export const activityLogs = pgTable('activity_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    activity: text('activity').notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
});
