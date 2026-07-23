import { useState } from "react";
import { mockBookings, Booking } from "../../data/mockData";
import { Calendar, Clock, MapPin, CheckCircle2, Search, Filter, Eye, X, ClipboardList } from "lucide-react";

const STATUS_COLORS = {
  upcoming: "bg-blue-100 text-blue-700",
  "in-progress": "bg-teal-100 text-teal-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

function BookingRow({ b, onView }: { b: Booking; onView: (b: Booking) => void }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-all">
      <td className="py-3 px-4">
        <p className="text-gray-900 text-sm font-medium">{b.id.toUpperCase()}</p>
        {b.invoiceId && <p className="text-gray-400 text-xs">{b.invoiceId}</p>}
      </td>
      <td className="py-3 px-4">
        <p className="text-gray-900 text-sm">{b.patientName}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-gray-900 text-sm">{b.caregiverName}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-gray-700 text-sm">{b.date}</p>
        <p className="text-gray-400 text-xs">{b.startTime}–{b.endTime}</p>
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[b.status]}`}>{b.status}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <p className="text-gray-900 text-sm font-semibold">KES {b.totalAmount.toLocaleString()}</p>
      </td>
      <td className="py-3 px-4">
        <button onClick={() => onView(b)} className="p-1.5 hover:bg-gray-200 rounded-lg transition-all">
          <Eye className="w-4 h-4 text-gray-500" />
        </button>
      </td>
    </tr>
  );
}

function BookingDetailPanel({ b, onClose }: { b: Booking; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-gray-900">Booking: {b.id.toUpperCase()}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Patient", value: b.patientName },
              { label: "Caregiver", value: b.caregiverName },
              { label: "Date", value: b.date },
              { label: "Time", value: `${b.startTime} – ${b.endTime}` },
              { label: "Duration", value: `${b.duration} hours` },
              { label: "Amount", value: `KES ${b.totalAmount.toLocaleString()}` },
              { label: "Status", value: b.status },
              { label: "Invoice", value: b.invoiceId ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-0.5">{label}</p>
                <p className="text-gray-900 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>

          {b.checkInTime && (
            <div className="bg-teal-50 rounded-xl p-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <div>
                <p className="text-teal-700 text-sm font-medium">GPS Check-In: {b.checkInTime}</p>
                {b.checkInLocation && <p className="text-teal-600 text-xs">{b.checkInLocation.lat.toFixed(4)}°, {b.checkInLocation.lng.toFixed(4)}°</p>}
              </div>
            </div>
          )}

          <div>
            <p className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-1.5"><ClipboardList className="w-4 h-4" />Tasks ({b.tasks.filter(t => t.completed).length}/{b.tasks.length} completed)</p>
            <div className="space-y-1.5">
              {b.tasks.map((t) => (
                <div key={t.id} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl ${t.completed ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-400"}`}>
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${t.completed ? "text-emerald-500" : "text-gray-300"}`} />
                  {t.description}
                  {t.completedAt && <span className="ml-auto text-xs">{t.completedAt}</span>}
                </div>
              ))}
            </div>
          </div>

          {b.visitLog && (
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-blue-700 text-sm font-medium mb-1">✅ Visit Log Submitted</p>
              <p className="text-blue-600 text-sm">{b.visitLog.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingsManager() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewing, setViewing] = useState<Booking | null>(null);

  const filtered = mockBookings.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (search && ![b.patientName, b.caregiverName, b.id].some(v => v.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const totalRevenue = mockBookings.filter(b => b.status === "completed").reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Bookings Manager</h1>
        <p className="text-gray-500 text-sm">All platform bookings at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(["all", "upcoming", "in-progress", "completed"] as const).map((s) => {
          const count = s === "all" ? mockBookings.length : mockBookings.filter(b => b.status === s).length;
          return (
            <button key={s} onClick={() => setFilterStatus(s)} className={`bg-white rounded-xl border p-3 text-center transition-all ${filterStatus === s ? "border-purple-400 shadow-sm" : "border-gray-100"}`}>
              <p className="text-gray-900 text-xl font-bold">{count}</p>
              <p className="text-gray-400 text-xs capitalize">{s === "all" ? "Total" : s}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex justify-between items-center mb-5">
        <p className="text-purple-800 font-medium text-sm">Platform Revenue (Completed)</p>
        <p className="text-purple-900 text-xl font-bold">KES {totalRevenue.toLocaleString()}</p>
      </div>

      {/* Search & filter */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by patient, caregiver, or booking ID..." className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" />
        </div>
        <div className="flex gap-2">
          {["all", "upcoming", "in-progress", "completed", "cancelled"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`text-xs px-3 py-2 rounded-xl capitalize transition-all ${filterStatus === s ? "bg-purple-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>{s === "all" ? "All" : s}</button>
          ))}
        </div>
      </div>

      {/* Table (desktop) */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Booking ID", "Patient", "Caregiver", "Date & Time", "Status", "Amount", ""].map((h) => (
                <th key={h} className="py-3 px-4 text-left text-xs text-gray-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => <BookingRow key={b.id} b={b} onView={setViewing} />)}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
            No bookings match your filter
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((b) => (
          <div key={b.id} onClick={() => setViewing(b)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-xs">{b.id.toUpperCase()}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_COLORS[b.status]}`}>{b.status}</span>
            </div>
            <p className="text-gray-900 font-medium text-sm">{b.patientName}</p>
            <p className="text-gray-500 text-xs">{b.caregiverName}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-400 text-xs">{b.date} · {b.startTime}–{b.endTime}</p>
              <p className="text-gray-900 font-semibold text-sm">KES {b.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {viewing && <BookingDetailPanel b={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
