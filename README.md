# Donnect - Blood Donation Management Platform

![Donnect Banner](./public/favicon.svg) <!-- Using SVG as placeholder -->

**Donnect** is a modern, comprehensive blood donation management platform designed to streamline operations for blood centers, manage donor records, and provide a secure, personal portal for donors to access their health information.

## 🌟 Key Features

### Staff & Admin Interface (Private)
* **Donor Management:** securely register and update donor profiles.
* **Donation Tracking:** record and manage detailed donation histories (volume, type, location).
* **Screening Results:** log critical health screening and test results (HIV, Hepatitis B/C, Syphilis, Blood Typing).
* **Medical Notes:** add and track internal medical observations securely.
* **Role-based Access:** distinct permissions for Staff (recording/viewing) and Admins (editing/deleting).

### Donor Portal (Public)
* **Secure Access:** donors can log in instantly using their registered **Full Name** and **Email Address**.
* **Personal Dashboard:** a summary of total donations, blood type, and latest screening status.
* **Donation History:** full chronological record of past blood donations.
* **Test Results:** direct, read-only access to their personal screening and test results.

## 🛠 Tech Stack

* **Frontend:** React, TypeScript, Vite
* **Routing:** React Router v6
* **Styling:** Tailwind CSS, shadcn/ui components
* **State Management & Data Fetching:** TanStack Query (React Query)
* **Backend Backend:** Supabase (PostgreSQL, Row Level Security, Auth)
* **Forms:** React Hook Form with Zod validation
* **Icons:** Lucide React

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Supabase credentials** in a `.env` file at the root:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Build for production:**
   ```bash
   npm run build
   ```

## 🔒 Security

* **Row Level Security (RLS)** is enforced at the database level.
* The Donor Portal strictly utilizes `SELECT` policies with exact name and email matching to grant donors read-only access to their personal data without requiring traditional passwords. Staff/Admins use secure Supabase Authentication.
