# Mahajan Kohli & Co. (MKC) Office Automation Tool - Implementation Plan

## 1. Project Overview
**Goal**: Create a comprehensive office automation tool for Mahajan Kohli & Co. to streamline daily operations.

## 2. Core Features (Confirmed)

### A. Staff Portal (Employees & Articles)
- **Real-time Activity Status**: "Working on Balance Sheet for Client X".
- **Attendance Tracker**: Check-in/Check-out with timestamps.
- **Daily Reporting**: End-of-day summary submission ("What I did today").
- **Task Board**: View assigned tasks, download attached files, and update status.

### B. Partner Portal (Admin/Boss)
- **Live Dashboard**: Real-time view of what every staff member is currently doing.
- **Task Assignment**: Assign tasks with optional dates and file attachments.
- **Review System**: View staff daily summaries and attendance logs.

## 3. "Antigravity" Feature Ideas (AI Enhancements)
- [ ] **Client Tagging**: Link tasks to specific clients for easy audit trails.
- [ ] **AI Summaries**:  Partners can see a weekly AI-generated summary of staff performance.
- [ ] **Deadline Watchdog**: Automated alerts for approaching statutory deadlines (GST, TDS).
- [ ] **Knowledge Base**: A searchable repository of internal memos/files uploaded by Partners.

## 4. Technology Stack (Proposed)
- **Frontend**: Next.js 14+ (App Router) - Deployed on **Vercel**.
- **Styling**: TailwindCSS + Custom "Glassmorphism" UI.
- **Backend (API/Orchestration)**: Next.js API Routes (Server Actions) on Vercel.
- **Backend (Heavy Processing)**: Python/Node.js Service (for Bank2Excel/OCR) on **Google Cloud Run**.
- **Database**: SQLite (Dev) / Postgres (Prod).

## 5. Next Steps
- [x] **Initialize Project**: Created `mkc-office-automation` (Next.js) for Vercel.
- [x] **Setup Backend**: Created `mkc-backend-service` (FastAPI) for Cloud Run.
- [ ] **Database Setup**: Connect Next.js to a database (SQLite/Postgres).
- [ ] **Integrate Bank2Excel**: Move the logic to the backend service.
- [ ] **Build UI**: Continue polishing Partner/Staff dashboards.
