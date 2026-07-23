import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { mockPatients, mockBookings, mockVitalsHistory } from "../../data/mockData";
import {
  Heart, Clock, MapPin, CheckCircle2, AlertCircle, ChevronRight,
  Activity, Thermometer, Droplets, Wind, User, Calendar, TrendingUp, TrendingDown
} from "lucide-react";

function VitalCard({ icon: Icon, label, value, unit, status }: {
  icon: React.ElementType; label: string; value: string | number; unit: string;
  status: "normal" | "warning" | "alert";
}) {
  const colors = {
    normal: { bg: "bg-emerald-50", icon: "text-emerald-600", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
    warning: { bg: "bg-amber-50", icon: "text-amber-600", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
    alert: { bg: "bg-red-50", icon: "text-red-600", text: "text-red-700", badge: "bg-red-100 text-red-700" },
  }[status];

  return (
    <div className={`${colors.bg} rounded-xl p-4 border border-white`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 ${colors.icon}`} />
        <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>{status}</span>
      </div>
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className={`text-lg font-semibold ${colors.text}`}>
        {value}<span className="text-xs font-normal ml-1">{unit}</span>
      </p>
    </div>
  );
}

export default function FamilyDashboard() {
  const navigate = useNavigate();
  const patient = mockPatients[0];
  const activeBooking = mockBookings.find((b) => b.status === "in-progress");
  const upcomingBookings = mockBookings.filter((b) => b.status === "upcoming");
  const latestVitals = mockVitalsHistory[mockVitalsHistory.length - 1];
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const completedTasks = activeBooking?.tasks.filter((t) => t.completed).length ?? 0;
  const totalTasks = activeBooking?.tasks.length ?? 0;
  const progressPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-gray-900">Good {time.getHours() < 12 ? "morning" : time.getHours() < 17 ? "afternoon" : "evening"}, Amina 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's the latest on your father's care</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-gray-900 text-sm font-medium">{time.toLocaleDateString("en-KE", { weekday: "long", month: "short", day: "numeric" })}</p>
          <p className="text-gray-400 text-xs">{time.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      </div>

      {/* Active visit banner */}
      {activeBooking && (
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-teal-100 text-sm">Visit in progress</span>
              </div>
              <h2 className="text-white">{activeBooking.caregiverName}</h2>
              <p className="text-teal-100 text-sm">Started at {activeBooking.checkInTime} · {activeBooking.startTime}–{activeBooking.endTime}</p>
            </div>
            <button
              onClick={() => navigate("/family/monitoring")}
              className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all backdrop-blur-sm"
            >
              Live View <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-teal-100">Tasks completed</span>
              <span className="text-white font-medium">{completedTasks}/{totalTasks}</span>
            </div>
            <div className="bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeBooking.tasks.slice(0, 3).map((task) => (
              <div key={task.id} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full ${task.completed ? "bg-white/25 text-white" : "bg-white/10 text-teal-200"}`}>
                {task.completed ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {task.description.split(" ").slice(0, 4).join(" ")}…
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patient card + quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Patient card */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <img src={patient.photo} alt={patient.name} className="w-14 h-14 rounded-xl object-cover" />
            <div>
              <h3 className="text-gray-900">{patient.name}</h3>
              <p className="text-gray-500 text-xs">Age {patient.age} · {patient.bloodType}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-gray-400 text-xs mb-1">Conditions</p>
              <div className="flex flex-wrap gap-1">
                {patient.conditions.map((c) => (
                  <span key={c} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Allergies</p>
              <div className="flex flex-wrap gap-1">
                {patient.allergies.map((a) => (
                  <span key={a} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{a}</span>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => navigate("/family/profile")} className="w-full mt-4 text-sm text-teal-600 hover:text-teal-700 border border-teal-200 hover:border-teal-300 py-2 rounded-lg transition-all flex items-center justify-center gap-1">
            View Full Profile <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {[
            { icon: Calendar, label: "Upcoming Visits", value: upcomingBookings.length, sub: "next: " + (upcomingBookings[0]?.date ?? "—"), className: "text-teal-500", bg: "bg-teal-50" },
            { icon: CheckCircle2, label: "Completed Visits", value: mockBookings.filter(b => b.status === "completed").length, sub: "this month", className: "text-emerald-500", bg: "bg-emerald-50" },
            { icon: Activity, label: "Last HR Reading", value: `${latestVitals.heartRate}`, sub: "bpm · Today 09:22", className: "text-blue-500", bg: "bg-blue-50" },
            { icon: TrendingDown, label: "Blood Pressure", value: `${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic}`, sub: "mmHg · Trending better", className: "text-violet-500", bg: "bg-violet-50" },
          ].map(({ icon: Icon, label, value, sub, className, bg }) => (
            <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <Icon className={`w-5 h-5 ${className} mb-2`} />
              <p className="text-gray-400 text-xs mb-0.5">{label}</p>
              <p className="text-gray-900 text-xl font-semibold">{value}</p>
              <p className="text-gray-400 text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Latest vitals */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Latest Health Vitals</h3>
          <button onClick={() => navigate("/family/monitoring")} className="text-teal-600 text-sm flex items-center gap-1 hover:text-teal-700">
            Full report <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <VitalCard icon={Heart} label="Heart Rate" value={latestVitals.heartRate} unit="bpm" status="normal" />
          <VitalCard icon={Activity} label="BP Systolic" value={latestVitals.bloodPressureSystolic} unit="mmHg" status={latestVitals.bloodPressureSystolic > 130 ? "warning" : "normal"} />
          <VitalCard icon={Thermometer} label="Temperature" value={latestVitals.temperature} unit="°C" status="normal" />
          <VitalCard icon={Wind} label="SpO₂" value={latestVitals.oxygenSaturation} unit="%" status={latestVitals.oxygenSaturation < 95 ? "warning" : "normal"} />
        </div>
      </div>

      {/* Upcoming bookings */}
      {upcomingBookings.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Upcoming Visits</h3>
            <button onClick={() => navigate("/family/bookings")} className="text-teal-600 text-sm flex items-center gap-1 hover:text-teal-700">
              All bookings <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm font-medium">{b.caregiverName}</p>
                    <p className="text-gray-400 text-xs">{b.date} · {b.startTime}–{b.endTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 text-sm font-medium">KES {b.totalAmount.toLocaleString()}</p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Upcoming</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Book a Caregiver", icon: Calendar, path: "/family/caregivers", iconClass: "text-teal-600", bgClass: "bg-teal-50", borderHover: "hover:border-teal-200" },
          { label: "View Documents", icon: Heart, path: "/family/documents", iconClass: "text-blue-600", bgClass: "bg-blue-50", borderHover: "hover:border-blue-200" },
          { label: "Edit Patient Profile", icon: User, path: "/family/profile", iconClass: "text-violet-600", bgClass: "bg-violet-50", borderHover: "hover:border-violet-200" },
        ].map(({ label, icon: Icon, path, iconClass, bgClass, borderHover }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm ${borderHover} hover:shadow-md transition-all text-left`}
          >
            <div className={`w-9 h-9 ${bgClass} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${iconClass}`} />
            </div>
            <span className="text-gray-700 text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}