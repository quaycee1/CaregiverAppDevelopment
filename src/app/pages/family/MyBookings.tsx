import { useState } from "react";
import { mockBookings, Booking } from "../../data/mockData";
import {
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight,
  X, ClipboardList, MapPin, User, FileText
} from "lucide-react";

type FilterStatus = "all" | "upcoming" | "in-progress" | "completed" | "cancelled";

const statusConfig = {
  upcoming: { label: "Upcoming", color: "bg-blue-100 text-blue-700", icon: Calendar },
  "in-progress": { label: "In Progress", color: "bg-teal-100 text-teal-700", icon: AlertCircle },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
};

function BookingDetailModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const completedTasks = booking.tasks.filter((t) => t.completed);
  const pendingTasks = booking.tasks.filter((t) => !t.completed);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-gray-900">Booking Details</h3>
            <p className="text-gray-400 text-xs">#{booking.id.toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Caregiver", value: booking.caregiverName, icon: User },
              { label: "Patient", value: booking.patientName, icon: User },
              { label: "Date", value: booking.date, icon: Calendar },
              { label: "Time", value: `${booking.startTime} – ${booking.endTime}`, icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-gray-400 text-xs">{label}</p>
                </div>
                <p className="text-gray-900 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* Check-in info */}
          {booking.checkInTime && (
            <div className="flex items-center gap-3 bg-teal-50 rounded-xl p-3">
              <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <div>
                <p className="text-teal-700 text-sm font-medium">GPS Check-In Recorded</p>
                <p className="text-teal-600 text-xs">Checked in at {booking.checkInTime} · Location verified</p>
              </div>
            </div>
          )}

          {/* Tasks */}
          <div>
            <h4 className="text-gray-700 mb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" /> Task List
              <span className="text-gray-400 text-sm font-normal">({completedTasks.length}/{booking.tasks.length} completed)</span>
            </h4>
            <div className="space-y-2">
              {booking.tasks.map((task) => (
                <div key={task.id} className={`flex items-start gap-3 p-3 rounded-xl ${task.completed ? "bg-emerald-50" : "bg-gray-50"}`}>
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${task.completed ? "text-emerald-500" : "text-gray-300"}`} />
                  <div className="flex-1">
                    <p className={`text-sm ${task.completed ? "text-gray-700" : "text-gray-400"}`}>{task.description}</p>
                    {task.completedAt && <p className="text-emerald-600 text-xs mt-0.5">✓ Completed at {task.completedAt}</p>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.category === "medication" ? "bg-red-100 text-red-600" :
                    task.category === "meal" ? "bg-amber-100 text-amber-600" :
                    task.category === "hygiene" ? "bg-blue-100 text-blue-600" :
                    task.category === "exercise" ? "bg-green-100 text-green-600" :
                    "bg-gray-100 text-gray-500"
                  }`}>{task.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visit log */}
          {booking.visitLog && (
            <div>
              <h4 className="text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Post-Visit Log
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Caregiver Notes</p>
                  <p className="text-gray-700">{booking.visitLog.notes}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Clinical Observations</p>
                  <p className="text-gray-700">{booking.visitLog.observations}</p>
                </div>
                {booking.visitLog.nextVisitNotes && (
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Notes for Next Visit</p>
                    <p className="text-gray-700">{booking.visitLog.nextVisitNotes}</p>
                  </div>
                )}
                {booking.visitLog.vitals && (
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-gray-400 text-xs mb-2">Vitals Recorded</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center"><p className="text-gray-900 font-medium">{booking.visitLog.vitals.heartRate}</p><p className="text-gray-400 text-xs">HR (bpm)</p></div>
                      <div className="text-center"><p className="text-gray-900 font-medium">{booking.visitLog.vitals.bloodPressureSystolic}/{booking.visitLog.vitals.bloodPressureDiastolic}</p><p className="text-gray-400 text-xs">BP (mmHg)</p></div>
                      <div className="text-center"><p className="text-gray-900 font-medium">{booking.visitLog.vitals.oxygenSaturation}%</p><p className="text-gray-400 text-xs">SpO₂</p></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="flex justify-between items-center bg-teal-50 rounded-xl p-4">
            <div>
              <p className="text-teal-700 text-sm font-medium">Total Paid</p>
              {booking.invoiceId && <p className="text-teal-600 text-xs">{booking.invoiceId}</p>}
            </div>
            <p className="text-teal-800 text-lg font-semibold">KES {booking.totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyBookings() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filtered = mockBookings.filter((b) => filter === "all" || b.status === filter);

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">My Bookings</h1>
        <p className="text-gray-500 text-sm">Track all your care visits and logs</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((s) => {
          const count = mockBookings.filter((b) => b.status === s).length;
          const cfg = statusConfig[s];
          return (
            <button key={s} onClick={() => setFilter(s === filter ? "all" : s)} className={`bg-white rounded-xl p-3 border text-center transition-all ${filter === s ? "border-teal-500 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}>
              <p className="text-gray-900 text-xl font-semibold">{count}</p>
              <p className="text-gray-400 text-xs capitalize">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(["all", "upcoming", "in-progress", "completed", "cancelled"] as FilterStatus[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-4 py-2 rounded-full whitespace-nowrap transition-all ${filter === f ? "bg-teal-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"}`}
          >
            {f === "all" ? "All" : statusConfig[f as keyof typeof statusConfig].label}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <div className="space-y-3">
        {filtered.map((b) => {
          const sc = statusConfig[b.status];
          return (
            <div
              key={b.id}
              onClick={() => setSelectedBooking(b)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-teal-100 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc.color}`}>{sc.label}</span>
                    {b.invoiceId && <span className="text-xs text-gray-400">{b.invoiceId}</span>}
                  </div>
                  <h3 className="text-gray-900">{b.caregiverName}</h3>
                  <p className="text-gray-500 text-xs">{b.patientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-semibold">KES {b.totalAmount.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">{b.duration} hours</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.date}</div>
                <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.startTime} – {b.endTime}</div>
                {b.checkInTime && <div className="flex items-center gap-1 text-teal-600"><MapPin className="w-3 h-3" />GPS checked in</div>}
              </div>

              {/* Task progress bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Tasks</span>
                  <span>{b.tasks.filter(t => t.completed).length}/{b.tasks.length}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-teal-500 rounded-full h-1.5 transition-all"
                    style={{ width: `${b.tasks.length ? (b.tasks.filter(t => t.completed).length / b.tasks.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {b.visitLog && (
                <div className="mt-3 bg-emerald-50 rounded-lg px-3 py-2 text-xs text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Visit log submitted · {new Date(b.visitLog.submittedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedBooking && <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
    </div>
  );
}
