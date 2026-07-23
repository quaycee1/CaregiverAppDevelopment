import { useState } from "react";
import { caregiverAvailability, mockBookings } from "../../data/mockData";
import { ChevronLeft, ChevronRight, Plus, X, Clock, Calendar } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const TIME_SLOTS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function CaregiverCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Record<string, string[]>>({ ...caregiverAvailability });
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [saved, setSaved] = useState<string | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const formatDate = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const bookedDates = mockBookings.map((b) => b.date);
  const today = "2026-03-06";

  const selectDate = (day: number) => {
    const dateStr = formatDate(day);
    setSelectedDate(dateStr);
    setSelectedSlots(availability[dateStr] || []);
    setSaved(null);
  };

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const saveAvailability = () => {
    if (selectedDate) {
      setAvailability((prev) => ({ ...prev, [selectedDate]: selectedSlots }));
      setSaved(selectedDate);
    }
  };

  const getDateStatus = (day: number) => {
    const d = formatDate(day);
    if (bookedDates.includes(d)) return "booked";
    if (availability[d]?.length) return "available";
    return "none";
  };

  const totalAvailableHours = Object.values(availability).reduce((sum, slots) => sum + slots.length, 0);

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-gray-900 mb-1">Availability Calendar</h1>
        <p className="text-gray-500 text-sm">Set your available time slots so families can book you</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Available Slots", value: String(totalAvailableHours), sub: "this month", color: "teal" },
          { label: "Booked Days", value: String(bookedDates.filter(d => d.startsWith("2026-03")).length), sub: "March 2026", color: "blue" },
          { label: "Free Days", value: String(22 - bookedDates.filter(d => d.startsWith("2026-03")).length), sub: "remaining", color: "emerald" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <p className={`text-${color}-600 text-xl font-bold`}>{value}</p>
            <p className="text-gray-600 text-xs font-medium">{label}</p>
            <p className="text-gray-400 text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-gray-900">{MONTHS[month]} {year}</h3>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateStr = formatDate(day);
            const status = getDateStatus(day);
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === today;
            const isPast = dateStr < today;
            return (
              <button
                key={i}
                onClick={() => !isPast && selectDate(day)}
                disabled={isPast}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all relative ${
                  isSelected ? "bg-blue-600 text-white shadow-md" :
                  isToday ? "ring-2 ring-blue-400 bg-blue-50 text-blue-700" :
                  isPast ? "text-gray-300 cursor-not-allowed" :
                  status === "booked" ? "bg-teal-100 text-teal-700 font-medium" :
                  status === "available" ? "bg-emerald-50 text-emerald-700" :
                  "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span>{day}</span>
                {status === "available" && !isSelected && <div className="w-1 h-1 bg-emerald-500 rounded-full mt-0.5" />}
                {status === "booked" && !isSelected && <div className="w-1 h-1 bg-teal-500 rounded-full mt-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-xs text-gray-400 flex-wrap">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-200" />Available</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-teal-300" />Booked</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-600" />Selected</div>
        </div>
      </div>

      {/* Time slot picker */}
      {selectedDate && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-900">Set Availability</h3>
              <p className="text-gray-400 text-sm">{selectedDate}</p>
            </div>
            <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {bookedDates.includes(selectedDate) ? (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-800 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              You have a confirmed booking on this date — availability cannot be changed.
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-3">Select the hours you're available (click to toggle)</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => toggleSlot(slot)}
                    className={`py-2.5 rounded-xl text-sm transition-all font-medium ${
                      selectedSlots.includes(slot)
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 text-sm">{selectedSlots.length} hour{selectedSlots.length !== 1 ? "s" : ""} selected</p>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedSlots([])} className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 border border-gray-200 rounded-lg">Clear all</button>
                  <button onClick={() => setSelectedSlots([...TIME_SLOTS])} className="text-xs text-blue-600 hover:text-blue-700 px-3 py-1.5 border border-blue-200 rounded-lg">Select all</button>
                </div>
              </div>

              <button
                onClick={saveAvailability}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                Save Availability
              </button>

              {saved === selectedDate && (
                <p className="text-emerald-600 text-sm text-center mt-2">✓ Availability saved for {selectedDate}</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Upcoming bookings list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" />My Bookings This Month</h3>
        <div className="space-y-3">
          {mockBookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all">
              <div>
                <p className="text-gray-900 text-sm font-medium">{b.patientName}</p>
                <p className="text-gray-400 text-xs">{b.date} · {b.startTime}–{b.endTime}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                b.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                b.status === "in-progress" ? "bg-teal-100 text-teal-700" :
                "bg-blue-100 text-blue-700"
              }`}>{b.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
