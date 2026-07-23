import { createBrowserRouter, Navigate } from "react-router";
import React from "react";
import Landing from "./pages/Landing";
import AppLayout from "./components/AppLayout";

// Family
import FamilyDashboard from "./pages/family/FamilyDashboard";
import BrowseCaregivers from "./pages/family/BrowseCaregivers";
import MyBookings from "./pages/family/MyBookings";
import Monitoring from "./pages/family/Monitoring";
import Documents from "./pages/family/Documents";
import PatientProfile from "./pages/family/PatientProfile";

// Caregiver
import CaregiverDashboard from "./pages/caregiver/CaregiverDashboard";
import CheckIn from "./pages/caregiver/CheckIn";
import Tasks from "./pages/caregiver/Tasks";
import VisitLog from "./pages/caregiver/VisitLog";
import CaregiverCalendar from "./pages/caregiver/CaregiverCalendar";
import CaregiverProfile from "./pages/caregiver/CaregiverProfile";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import CaregiverVerification from "./pages/admin/CaregiverVerification";
import BookingsManager from "./pages/admin/BookingsManager";
import Transactions from "./pages/admin/Transactions";
import SupportPortal from "./pages/admin/SupportPortal";

// Auth guard
function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem("vizazi_user");
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  { path: "/", Component: Landing },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      // Family routes
      { path: "family", Component: FamilyDashboard },
      { path: "family/caregivers", Component: BrowseCaregivers },
      { path: "family/bookings", Component: MyBookings },
      { path: "family/monitoring", Component: Monitoring },
      { path: "family/documents", Component: Documents },
      { path: "family/profile", Component: PatientProfile },

      // Caregiver routes
      { path: "caregiver", Component: CaregiverDashboard },
      { path: "caregiver/checkin", Component: CheckIn },
      { path: "caregiver/tasks", Component: Tasks },
      { path: "caregiver/logs", Component: VisitLog },
      { path: "caregiver/calendar", Component: CaregiverCalendar },
      { path: "caregiver/profile", Component: CaregiverProfile },

      // Admin routes
      { path: "admin", Component: AdminDashboard },
      { path: "admin/caregivers", Component: CaregiverVerification },
      { path: "admin/bookings", Component: BookingsManager },
      { path: "admin/transactions", Component: Transactions },
      { path: "admin/support", Component: SupportPortal },
    ],
  },
]);