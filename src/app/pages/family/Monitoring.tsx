import { useState, useEffect } from "react";
import { mockBookings, mockVitalsHistory } from "../../data/mockData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import {
  Heart, Activity, Thermometer, Wind, MapPin, CheckCircle2, Clock,
  AlertCircle, TrendingUp, TrendingDown, Minus
} from "lucide-react";

const vitalsChartData = mockVitalsHistory.map((v) => ({
  date: new Date(v.timestamp).toLocaleDateString("en-KE", { month: "short", day: "numeric" }),
  "Heart Rate": v.heartRate,
  "BP Systolic": v.bloodPressureSystolic,
  "BP Diastolic": v.bloodPressureDiastolic,
  "SpO₂": v.oxygenSaturation,
  "Temp": v.temperature,
}));

const VISIT_TIMELINE = [
  { time: "09:00", event: "Caregiver en route", status: "done", icon: "🚗" },
  { time: "09:03", event: "GPS Check-In at patient address", status: "done", icon: "📍" },
  { time: "09:15", event: "Morning medications administered", status: "done", icon: "💊" },
  { time: "09:22", event: "Vitals recorded (HR 71, BP 126/80)", status: "done", icon: "📊" },
  { time: "10:05", event: "Hygiene & grooming completed", status: "done", icon: "✅" },
  { time: "10:35", event: "Breakfast prepared and served", status: "done", icon: "🍽️" },
  { time: "11:15", event: "Garden walk – in progress", status: "active", icon: "🌿" },
  { time: "12:00", event: "Midday medication due", status: "pending", icon: "💊" },
  { time: "13:00", event: "End of visit / GPS Check-Out", status: "pending", icon: "🏠" },
];

function VitalTrendCard({
  icon: Icon, label, current, unit, normal, history, color
}: {
  icon: React.ElementType; label: string; current: number; unit: string;
  normal: string; history: number[]; color: string;
}) {
  const trend = history[history.length - 1] > history[history.length - 2] ? "up" : history[history.length - 1] < history[history.length - 2] ? "down" : "stable";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const isGood = (label === "Heart Rate" && trend === "down") ||
    (label === "BP Systolic" && trend === "down") ||
    (label === "SpO₂" && trend === "up") ||
    label === "Temperature";

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 bg-${color}-50 rounded-xl flex items-center justify-center`}>
            <Icon className={`w-4 h-4 text-${color}-600`} />
          </div>
          <div>
            <p className="text-gray-900 text-sm font-medium">{label}</p>
            <p className="text-gray-400 text-xs">Normal: {normal}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs ${isGood ? "text-emerald-600" : "text-amber-600"}`}>
          <TrendIcon className="w-3 h-3" />
          <span>{trend}</span>
        </div>
      </div>
      <p className={`text-2xl font-bold text-${color}-700 mb-1`}>
        {current}<span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
      </p>
      {/* Mini sparkline */}
      <div className="flex items-end gap-1 h-8 mt-2">
        {history.map((v, i) => {
          const max = Math.max(...history);
          const min = Math.min(...history);
          const h = max === min ? 50 : ((v - min) / (max - min)) * 100;
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm bg-${color}-${i === history.length - 1 ? "500" : "200"} transition-all`}
              style={{ height: `${Math.max(15, h)}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Monitoring() {
  const [activeVisit] = useState(mockBookings.find((b) => b.status === "in-progress"));
  const [selectedVital, setSelectedVital] = useState<"Heart Rate" | "BP Systolic" | "SpO���">("Heart Rate");
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const latestVitals = mockVitalsHistory[mockVitalsHistory.length - 1];
  const prevVitals = mockVitalsHistory[mockVitalsHistory.length - 2];

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1">Live Monitoring</h1>
        <p className="text-gray-500 text-sm">Real-time updates on Mzee Francis's care visit</p>
      </div>

      {/* Live visit status banner */}
      {activeVisit ? (
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-teal-100 text-sm">LIVE</span>
                </div>
                <p className="text-white font-semibold">{activeVisit.caregiverName} is with your father</p>
              </div>
            </div>
            <p className="text-teal-100 text-sm">{liveTime.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
          </div>

          {/* GPS map placeholder */}
          <div className="bg-white/10 rounded-xl h-28 flex items-center justify-center mb-4 border border-white/20">
            <div className="text-center">
              <MapPin className="w-6 h-6 text-white mx-auto mb-1" />
              <p className="text-teal-100 text-xs">14 Kileleshwa Avenue, Nairobi</p>
              <p className="text-teal-200 text-xs">GPS verified · -1.2921°, 36.8219°</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-teal-100 text-xs">Checked in</p>
              <p className="text-white font-semibold">{activeVisit.checkInTime}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-teal-100 text-xs">Tasks done</p>
              <p className="text-white font-semibold">
                {activeVisit.tasks.filter(t => t.completed).length}/{activeVisit.tasks.length}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-teal-100 text-xs">Visit ends</p>
              <p className="text-white font-semibold">{activeVisit.endTime}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-2xl p-6 text-center">
          <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No active visit right now</p>
          <p className="text-gray-400 text-sm">Next visit: March 10, 2026 at 10:00 AM</p>
        </div>
      )}

      {/* Visit timeline */}
      {activeVisit && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" /> Visit Timeline
          </h3>
          <div className="space-y-0">
            {VISIT_TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    item.status === "done" ? "bg-emerald-100 text-emerald-700" :
                    item.status === "active" ? "bg-teal-500 text-white animate-pulse" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    {item.status === "done" ? "✓" : item.status === "active" ? "●" : "○"}
                  </div>
                  {i < VISIT_TIMELINE.length - 1 && (
                    <div className={`w-0.5 h-8 ${item.status === "done" ? "bg-emerald-200" : "bg-gray-100"}`} />
                  )}
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-gray-400 text-xs w-10">{item.time}</span>
                    <span className={`text-sm ${item.status === "pending" ? "text-gray-400" : item.status === "active" ? "text-teal-700 font-medium" : "text-gray-700"}`}>
                      {item.icon} {item.event}
                    </span>
                    {item.status === "active" && (
                      <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full animate-pulse">In Progress</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vital trend cards */}
      <div>
        <h3 className="text-gray-900 mb-4">Health Vitals Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <VitalTrendCard
            icon={Heart} label="Heart Rate" current={latestVitals.heartRate} unit="bpm"
            normal="60–100" color="red"
            history={mockVitalsHistory.map(v => v.heartRate)}
          />
          <VitalTrendCard
            icon={Activity} label="BP Systolic" current={latestVitals.bloodPressureSystolic} unit="mmHg"
            normal="<130" color="violet"
            history={mockVitalsHistory.map(v => v.bloodPressureSystolic)}
          />
          <VitalTrendCard
            icon={Thermometer} label="Temperature" current={latestVitals.temperature} unit="°C"
            normal="36.1–37.2" color="amber"
            history={mockVitalsHistory.map(v => v.temperature)}
          />
          <VitalTrendCard
            icon={Wind} label="SpO₂" current={latestVitals.oxygenSaturation} unit="%"
            normal="≥95" color="blue"
            history={mockVitalsHistory.map(v => v.oxygenSaturation)}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-gray-900">Vitals Trend (Last 6 Visits)</h3>
          <div className="flex gap-2">
            {(["Heart Rate", "BP Systolic", "SpO₂"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVital(v)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${selectedVital === v ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={vitalsChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
            <ReferenceLine
              y={selectedVital === "Heart Rate" ? 100 : selectedVital === "BP Systolic" ? 130 : 95}
              stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5}
            />
            <Line
              type="monotone" dataKey={selectedVital}
              stroke={selectedVital === "Heart Rate" ? "#ef4444" : selectedVital === "BP Systolic" ? "#8b5cf6" : "#3b82f6"}
              strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-gray-400 text-xs mt-2 text-center">Dashed line = clinical threshold</p>
      </div>

      {/* Digital care log */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-gray-900 mb-4">Digital Care Log – Today</h3>
        <div className="space-y-2">
          {activeVisit?.tasks.filter(t => t.completed).map((task) => (
            <div key={task.id} className="flex items-center gap-3 text-sm text-gray-700 bg-emerald-50 rounded-xl p-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{task.description}</span>
              <span className="ml-auto text-xs text-emerald-600 flex-shrink-0">{task.completedAt}</span>
            </div>
          ))}
          {activeVisit?.tasks.filter(t => !t.completed).map((task) => (
            <div key={task.id} className="flex items-center gap-3 text-sm text-gray-400 bg-gray-50 rounded-xl p-3">
              <Clock className="w-4 h-4 text-gray-300 flex-shrink-0" />
              <span>{task.description}</span>
              <span className="ml-auto text-xs text-gray-300 flex-shrink-0">Pending</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
