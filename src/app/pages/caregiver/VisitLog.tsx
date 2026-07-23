import { useState } from "react";
import { mockBookings } from "../../data/mockData";
import {
  CheckCircle2, FileText, Heart, Activity, Thermometer, Wind,
  MessageSquare, ChevronRight, Save, X, Clock
} from "lucide-react";

type LogStep = "select" | "tasks" | "vitals" | "notes" | "submitted";

const CHECKLIST_ITEMS = [
  { id: "med_morning", label: "Morning medications administered", category: "medication" },
  { id: "vitals_bp", label: "Blood pressure checked", category: "medication" },
  { id: "vitals_sugar", label: "Blood sugar checked", category: "medication" },
  { id: "hygiene_bath", label: "Bathing / personal hygiene assisted", category: "hygiene" },
  { id: "hygiene_dress", label: "Patient dressed and groomed", category: "hygiene" },
  { id: "meal_breakfast", label: "Breakfast prepared and served", category: "meal" },
  { id: "meal_fluids", label: "Adequate fluid intake encouraged", category: "meal" },
  { id: "exercise_walk", label: "Light exercise / walk completed", category: "exercise" },
  { id: "med_midday", label: "Midday medications administered", category: "medication" },
  { id: "social", label: "Social interaction / companionship provided", category: "social" },
];

export default function VisitLog() {
  const [step, setStep] = useState<LogStep>("select");
  const [selectedBooking] = useState(mockBookings[1]); // completed booking
  const [checkedItems, setCheckedItems] = useState<string[]>(["med_morning", "vitals_bp", "vitals_sugar", "hygiene_bath", "hygiene_dress", "meal_breakfast", "meal_fluids"]);
  const [vitals, setVitals] = useState({ hr: "74", bpSys: "128", bpDia: "82", temp: "36.6", spo2: "97", weight: "72.5" });
  const [notes, setNotes] = useState("");
  const [observations, setObservations] = useState("");
  const [nextVisitNotes, setNextVisitNotes] = useState("");
  const [overallRating, setOverallRating] = useState<"good" | "fair" | "concerning">("good");

  const toggleItem = (id: string) =>
    setCheckedItems((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const completedBookings = mockBookings.filter((b) => b.status === "completed");

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-gray-900 mb-1">Submit Visit Log</h1>
        <p className="text-gray-500 text-sm">Complete your post-visit report for the family and records</p>
      </div>

      {/* Previous logs */}
      {step === "select" && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            📋 Submit your visit log as soon as possible after each visit. The family is notified when you submit.
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-gray-900 mb-4">Recent Visits — Pending Logs</h3>
            <div className="space-y-3">
              <div
                onClick={() => setStep("tasks")}
                className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:border-amber-300 transition-all"
              >
                <div>
                  <p className="text-amber-800 font-medium text-sm">{mockBookings[0].patientName}</p>
                  <p className="text-amber-600 text-xs">{mockBookings[0].date} · {mockBookings[0].startTime}–{mockBookings[0].endTime}</p>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mt-1 inline-block">Log Pending</span>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-gray-900 mb-4">Submitted Logs</h3>
            <div className="space-y-3">
              {completedBookings.filter(b => b.visitLog).map((b) => (
                <div key={b.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                  <div>
                    <p className="text-emerald-800 font-medium text-sm">{b.patientName}</p>
                    <p className="text-emerald-600 text-xs">{b.date}</p>
                    <p className="text-emerald-600 text-xs">{b.visitLog?.notes?.slice(0, 60)}…</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Step: Task checklist */}
      {step === "tasks" && (
        <>
          <div className="flex items-center gap-3 mb-2">
            {(["tasks", "vitals", "notes"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? "bg-blue-600 text-white" : ["vitals", "notes"].indexOf(s) > ["tasks", "vitals", "notes"].indexOf(step) ? "bg-gray-200 text-gray-400" : "bg-emerald-500 text-white"}`}>
                  {i + 1}
                </div>
                {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
              </div>
            ))}
            <span className="text-gray-400 text-xs ml-2">Tasks → Vitals → Notes</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-gray-900 mb-1">Task Completion</h3>
            <p className="text-gray-400 text-sm mb-4">Check all tasks completed during this visit</p>
            <div className="space-y-2">
              {CHECKLIST_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${checkedItems.includes(item.id) ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-transparent hover:border-gray-200"}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${checkedItems.includes(item.id) ? "bg-emerald-500" : "border-2 border-gray-300"}`}>
                    {checkedItems.includes(item.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${checkedItems.includes(item.id) ? "text-emerald-700" : "text-gray-600"}`}>{item.label}</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    item.category === "medication" ? "bg-red-100 text-red-600" :
                    item.category === "meal" ? "bg-amber-100 text-amber-600" :
                    item.category === "hygiene" ? "bg-blue-100 text-blue-600" :
                    item.category === "exercise" ? "bg-green-100 text-green-600" :
                    "bg-violet-100 text-violet-600"
                  }`}>{item.category}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-400 text-sm">{checkedItems.length}/{CHECKLIST_ITEMS.length} completed</p>
              <button onClick={() => setStep("vitals")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                Next: Record Vitals <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Step: Vitals */}
      {step === "vitals" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 mb-1">Record Patient Vitals</h3>
          <p className="text-gray-400 text-sm mb-4">Enter the vitals measured during this visit</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "Heart Rate", key: "hr", unit: "bpm", icon: Heart, color: "red" },
              { label: "BP Systolic", key: "bpSys", unit: "mmHg", icon: Activity, color: "violet" },
              { label: "BP Diastolic", key: "bpDia", unit: "mmHg", icon: Activity, color: "violet" },
              { label: "Temperature", key: "temp", unit: "°C", icon: Thermometer, color: "amber" },
              { label: "SpO₂", key: "spo2", unit: "%", icon: Wind, color: "blue" },
              { label: "Weight", key: "weight", unit: "kg", icon: Activity, color: "teal" },
            ].map(({ label, key, unit, icon: Icon, color }) => (
              <div key={key} className={`bg-${color}-50 rounded-xl p-3`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon className={`w-3.5 h-3.5 text-${color}-600`} />
                  <p className={`text-${color}-700 text-xs font-medium`}>{label}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={vitals[key as keyof typeof vitals]}
                    onChange={(e) => setVitals((v) => ({ ...v, [key]: e.target.value }))}
                    className={`w-full px-2 py-1.5 bg-white border border-${color}-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-${color}-400`}
                  />
                  <span className={`text-${color}-500 text-xs whitespace-nowrap`}>{unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-2">Overall patient condition</p>
            <div className="grid grid-cols-3 gap-2">
              {(["good", "fair", "concerning"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setOverallRating(r)}
                  className={`py-2.5 rounded-xl text-sm capitalize transition-all border-2 ${
                    overallRating === r
                      ? r === "good" ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : r === "fair" ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  {r === "good" ? "😊 Good" : r === "fair" ? "😐 Fair" : "😟 Concerning"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("tasks")} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-all">Back</button>
            <button onClick={() => setStep("notes")} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
              Next: Add Notes <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step: Notes */}
      {step === "notes" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div>
            <h3 className="text-gray-900 mb-1">Visit Notes</h3>
            <p className="text-gray-400 text-sm">Provide a summary for the family and care record</p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">General Visit Notes *</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="e.g. Patient was in good spirits today. Ate full breakfast with good appetite..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Clinical Observations</label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="e.g. Blood sugar slightly elevated (8.2 mmol/L). Blood pressure stable..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Notes for Next Visit</label>
            <textarea
              value={nextVisitNotes}
              onChange={(e) => setNextVisitNotes(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
              placeholder="e.g. Monitor blood sugar trend. Bring glucometer calibration kit..."
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("vitals")} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-all">Back</button>
            <button
              onClick={() => setStep("submitted")}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Submit Log
            </button>
          </div>
        </div>
      )}

      {/* Submitted */}
      {step === "submitted" && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-emerald-800 mb-2">Visit Log Submitted!</h2>
            <p className="text-emerald-700 text-sm mb-1">The family has been notified.</p>
            <p className="text-emerald-600 text-xs">Submitted at {new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h3 className="text-gray-900">Summary</h3>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Tasks completed</span><span className="text-gray-900 font-medium">{checkedItems.length}/{CHECKLIST_ITEMS.length}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Heart Rate</span><span className="text-gray-900 font-medium">{vitals.hr} bpm</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Blood Pressure</span><span className="text-gray-900 font-medium">{vitals.bpSys}/{vitals.bpDia} mmHg</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Patient Condition</span><span className={`font-medium capitalize ${overallRating === "good" ? "text-emerald-600" : overallRating === "fair" ? "text-amber-600" : "text-red-600"}`}>{overallRating}</span></div>
          </div>

          <button onClick={() => setStep("select")} className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-all text-sm">
            Back to Visit Logs
          </button>
        </div>
      )}
    </div>
  );
}
