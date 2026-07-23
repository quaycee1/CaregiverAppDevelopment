import { useState } from "react";
import { mockBookings, Task } from "../../data/mockData";
import { CheckCircle2, Circle, AlertTriangle, Pill, Utensils, Dumbbell, Heart, MessageSquare, Clock, ChevronDown, ChevronUp } from "lucide-react";

const categoryConfig = {
  medication: { icon: Pill, color: "red", label: "Medication" },
  meal: { icon: Utensils, color: "amber", label: "Meal / Nutrition" },
  hygiene: { icon: Heart, color: "blue", label: "Hygiene & Grooming" },
  exercise: { icon: Dumbbell, color: "emerald", label: "Exercise" },
  social: { icon: MessageSquare, color: "violet", label: "Social / Mental" },
  other: { icon: CheckCircle2, color: "gray", label: "Other" },
};

function TaskItem({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
  const cfg = categoryConfig[task.category];
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
        task.completed ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onToggle(task.id)}
    >
      <div className={`mt-0.5 flex-shrink-0 transition-all ${task.completed ? "text-emerald-500" : "text-gray-300"}`}>
        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>{task.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full bg-${cfg.color}-50 text-${cfg.color}-700`}>{cfg.label}</span>
          {task.completedAt && <span className="text-xs text-emerald-600">✓ {task.completedAt}</span>}
        </div>
      </div>
      {task.category === "medication" && !task.completed && (
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" title="Medication – high priority" />
      )}
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(mockBookings[0].tasks);
  const [showPatientInfo, setShowPatientInfo] = useState(false);

  const booking = mockBookings[0];
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }) : undefined,
            }
          : t
      )
    );
  };

  const grouped = Object.entries(
    tasks.reduce<Record<string, Task[]>>((acc, t) => {
      if (!acc[t.category]) acc[t.category] = [];
      acc[t.category].push(t);
      return acc;
    }, {})
  );

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-gray-900 mb-1">Task Checklist</h1>
        <p className="text-gray-500 text-sm">{booking.patientName} · {booking.date}</p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-gray-900">Visit Progress</h3>
            <p className="text-gray-400 text-sm">{completed} of {total} tasks completed</p>
          </div>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold ${
            pct === 100 ? "bg-emerald-100 text-emerald-700" : pct > 50 ? "bg-teal-100 text-teal-700" : "bg-blue-100 text-blue-700"
          }`}>
            {pct}%
          </div>
        </div>
        <div className="bg-gray-100 rounded-full h-2.5">
          <div
            className={`${pct === 100 ? "bg-emerald-500" : "bg-teal-500"} rounded-full h-2.5 transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct === 100 && (
          <div className="mt-3 flex items-center gap-2 text-emerald-700 text-sm bg-emerald-50 rounded-xl p-2.5">
            <CheckCircle2 className="w-4 h-4" />
            All tasks completed! Please submit your visit log.
          </div>
        )}
      </div>

      {/* Patient info (collapsible) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowPatientInfo(!showPatientInfo)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1765896387454-3c29c0473615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80"
              alt="Patient"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <p className="text-gray-900 font-medium text-sm">{booking.patientName}</p>
              <p className="text-gray-400 text-xs">Age 78 · Diabetic · Hypertension</p>
            </div>
          </div>
          {showPatientInfo ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {showPatientInfo && (
          <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-red-600 text-xs font-medium mb-1">⚠ ALLERGIES</p>
                <p className="text-red-700 text-xs">Penicillin, Sulfa Drugs</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-blue-600 text-xs font-medium mb-1">Blood Group</p>
                <p className="text-blue-700 text-xs">O+ (Positive)</p>
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-amber-700 text-xs font-medium mb-1">💊 Active Medications</p>
              <p className="text-amber-700 text-xs">Metformin 500mg · Amlodipine 5mg · Aspirin 75mg</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs font-medium mb-1">Care Notes</p>
              <p className="text-gray-600 text-xs">Patient prefers morning walks. Speaks Swahili primarily. Does not prefer male caregivers for bathing assistance.</p>
            </div>
          </div>
        )}
      </div>

      {/* Grouped tasks */}
      {grouped.map(([category, categoryTasks]) => {
        const cfg = categoryConfig[category as keyof typeof categoryConfig];
        const catCompleted = categoryTasks.filter((t) => t.completed).length;
        return (
          <div key={category} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className={`flex items-center justify-between px-5 py-3 bg-${cfg.color}-50 border-b border-${cfg.color}-100`}>
              <div className="flex items-center gap-2">
                <cfg.icon className={`w-4 h-4 text-${cfg.color}-600`} />
                <span className={`text-${cfg.color}-700 text-sm font-medium`}>{cfg.label}</span>
              </div>
              <span className={`text-xs text-${cfg.color}-600`}>{catCompleted}/{categoryTasks.length}</span>
            </div>
            <div className="p-3 space-y-2">
              {categoryTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Notes field */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-gray-900 mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-500" /> Visit Notes
        </h3>
        <textarea
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          placeholder="Add any observations, concerns, or notes for this visit..."
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
        <Clock className="w-3.5 h-3.5" />
        Task timestamps are recorded automatically when you mark them complete
      </div>
    </div>
  );
}
