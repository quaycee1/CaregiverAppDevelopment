import { useNavigate } from "react-router";
import { mockBookings, mockCaregivers } from "../../data/mockData";
import {
  Calendar, Clock, MapPin, CheckCircle2, Star, TrendingUp, ChevronRight,
  ClipboardList, DollarSign, Users, Award
} from "lucide-react";

export default function CaregiverDashboard() {
  const navigate = useNavigate();
  const caregiver = mockCaregivers[0];
  const todayBooking = mockBookings.find((b) => b.date === "2026-03-06" && b.status === "in-progress");
  const upcomingBookings = mockBookings.filter((b) => b.status === "upcoming").slice(0, 2);
  const completedCount = mockBookings.filter((b) => b.status === "completed").length;

  const stats = [
    { label: "Rating", value: caregiver.rating.toFixed(1), icon: Star, iconClass: "text-amber-600", bgClass: "bg-amber-50", sub: `${caregiver.reviews} reviews` },
    { label: "Completed", value: String(completedCount + 42), icon: CheckCircle2, iconClass: "text-emerald-600", bgClass: "bg-emerald-50", sub: "total visits" },
    { label: "This Month", value: "KES 28,800", icon: DollarSign, iconClass: "text-teal-600", bgClass: "bg-teal-50", sub: "earned" },
    { label: "Patients", value: "12", icon: Users, iconClass: "text-blue-600", bgClass: "bg-blue-50", sub: "served" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-gray-900">Good morning, Grace 👋</h1>
        <p className="text-gray-500 text-sm mt-0.5">Friday, March 6, 2026 · You have 1 active visit today</p>
      </div>

      {/* Active visit card */}
      {todayBooking && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-blue-100 text-sm">Active Visit</span>
              </div>
              <h2 className="text-white">{todayBooking.patientName}</h2>
              <p className="text-blue-100 text-sm">{todayBooking.startTime} – {todayBooking.endTime} · {todayBooking.duration}hr session</p>
            </div>
            <button
              onClick={() => navigate("/caregiver/tasks")}
              className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
            >
              View Tasks <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <MapPin className="w-4 h-4 text-blue-200 mx-auto mb-1" />
              <p className="text-white text-sm font-medium">Checked In</p>
              <p className="text-blue-200 text-xs">{todayBooking.checkInTime}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <ClipboardList className="w-4 h-4 text-blue-200 mx-auto mb-1" />
              <p className="text-white text-sm font-medium">{todayBooking.tasks.filter(t => t.completed).length}/{todayBooking.tasks.length}</p>
              <p className="text-blue-200 text-xs">Tasks done</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Clock className="w-4 h-4 text-blue-200 mx-auto mb-1" />
              <p className="text-white text-sm font-medium">13:00</p>
              <p className="text-blue-200 text-xs">Check-out</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, iconClass, bgClass, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className={`w-9 h-9 ${bgClass} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${iconClass}`} />
            </div>
            <p className="text-gray-900 text-xl font-semibold">{value}</p>
            <p className="text-gray-400 text-xs">{label}</p>
            <p className="text-gray-300 text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Check In / Out", icon: MapPin, path: "/caregiver/checkin", iconClass: "text-blue-600", bgClass: "bg-blue-50", desc: "GPS location" },
          { label: "My Tasks", icon: ClipboardList, path: "/caregiver/tasks", iconClass: "text-teal-600", bgClass: "bg-teal-50", desc: "View checklist" },
          { label: "Submit Log", icon: CheckCircle2, path: "/caregiver/logs", iconClass: "text-emerald-600", bgClass: "bg-emerald-50", desc: "Post-visit" },
          { label: "Availability", icon: Calendar, path: "/caregiver/calendar", iconClass: "text-violet-600", bgClass: "bg-violet-50", desc: "Set timeslots" },
        ].map(({ label, icon: Icon, path, iconClass, bgClass, desc }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center"
          >
            <div className={`w-10 h-10 ${bgClass} rounded-xl flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${iconClass}`} />
            </div>
            <div>
              <p className="text-gray-900 text-sm font-medium">{label}</p>
              <p className="text-gray-400 text-xs">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Upcoming visits */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Upcoming Visits</h3>
          <button onClick={() => navigate("/caregiver/tasks")} className="text-blue-600 text-sm flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {upcomingBookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-gray-900 text-sm font-medium">{b.patientName}</p>
                <p className="text-gray-400 text-xs">{b.date} · {b.startTime}–{b.endTime}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-900 text-sm font-medium">KES {(b.totalAmount * 0.9).toLocaleString()}</p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Upcoming</span>
              </div>
            </div>
          ))}
          {upcomingBookings.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">No upcoming visits scheduled</p>
          )}
        </div>
      </div>

      {/* Performance */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-teal-600" />
          <h3 className="text-gray-900">Performance Summary</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: "On-time arrival rate", value: 96, barColor: "bg-teal-500" },
            { label: "Task completion rate", value: 98, barColor: "bg-emerald-500" },
            { label: "Family satisfaction", value: 94, barColor: "bg-blue-500" },
          ].map(({ label, value, barColor }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600">{label}</span>
                <span className="text-gray-900 font-medium">{value}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2">
                <div className={`${barColor} rounded-full h-2 transition-all`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 bg-amber-50 rounded-xl p-3">
          <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-amber-800 text-sm font-medium">Top-rated Caregiver Badge</p>
            <p className="text-amber-600 text-xs">You are in the top 5% of caregivers on Vizazi Care</p>
          </div>
        </div>
      </div>
    </div>
  );
}