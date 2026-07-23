import { useState } from "react";
import { mockCaregivers, Caregiver } from "../../data/mockData";
import {
  Star, MapPin, Clock, Shield, CheckCircle2, X, Calendar, CreditCard,
  Search, Filter, ChevronRight, Phone, Heart, Languages
} from "lucide-react";

const SPECIALTIES = ["All", "Dementia Care", "Physiotherapy", "Palliative Care", "Diabetes Management", "General Home Care"];

function CaregiverCard({ c, onBook }: { c: Caregiver; onBook: (c: Caregiver) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            {c.photo ? (
              <img src={c.photo} alt={c.name} className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-teal-100 flex items-center justify-center">
                <span className="text-teal-700 text-xl font-bold">{c.name.charAt(0)}</span>
              </div>
            )}
            {c.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="text-gray-900">{c.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-gray-700 text-xs font-medium">{c.rating}</span>
                    <span className="text-gray-400 text-xs">({c.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-900 text-sm font-semibold">KES {c.hourlyRate.toLocaleString()}</p>
                <p className="text-gray-400 text-xs">per hour</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {c.specialties.slice(0, 2).map((s) => (
                <span key={s} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{s}</span>
              ))}
              {c.specialties.length > 2 && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{c.specialties.length - 2}</span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</div>
              <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.experience}</div>
              {c.verified && <div className="flex items-center gap-1 text-teal-600"><Shield className="w-3 h-3" />Verified</div>}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full ${c.available ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${c.available ? "bg-emerald-500" : "bg-gray-400"}`} />
            {c.available ? "Available" : "Unavailable"}
          </div>
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full bg-gray-50 text-gray-600">
            <Languages className="w-3 h-3" />{c.languages.slice(0, 2).join(", ")}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-50 px-5 py-3 flex gap-2">
        <button
          onClick={() => onBook(c)}
          disabled={!c.available}
          className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-sm py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          {c.available ? "Book Now" : "Unavailable"}
        </button>
        <button className="px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm transition-all">
          <Phone className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function BookingModal({ caregiver, onClose }: { caregiver: Caregiver; onClose: () => void }) {
  const [step, setStep] = useState<"details" | "payment" | "confirmation">("details");
  const [date, setDate] = useState("2026-03-09");
  const [startTime, setStartTime] = useState("09:00");
  const [hours, setHours] = useState(4);
  const [payMethod, setPayMethod] = useState("mpesa");
  const total = caregiver.hourlyRate * hours;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-gray-900">{step === "details" ? "Book Caregiver" : step === "payment" ? "Payment" : "Confirmed!"}</h3>
            <p className="text-gray-400 text-xs">{caregiver.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-5">
          {step === "details" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                {caregiver.photo ? (
                  <img src={caregiver.photo} alt={caregiver.name} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 font-bold">{caregiver.name.charAt(0)}</div>
                )}
                <div>
                  <p className="text-gray-900 text-sm font-medium">{caregiver.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-gray-500 text-xs">{caregiver.rating} · KES {caregiver.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Visit Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} min="2026-03-07"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Start Time</label>
                  <select value={startTime} onChange={e => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00"].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Duration</label>
                  <select value={hours} onChange={e => setHours(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {[2,3,4,6,8].map(h => <option key={h} value={h}>{h} hours</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Special Instructions (optional)</label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                  placeholder="e.g. Patient prefers walks in the morning, needs help with medications..."
                />
              </div>

              <div className="bg-teal-50 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <p className="text-teal-700 text-sm">Estimated Total</p>
                  <p className="text-gray-400 text-xs">{hours} hrs × KES {caregiver.hourlyRate.toLocaleString()}</p>
                </div>
                <p className="text-teal-800 text-lg font-semibold">KES {total.toLocaleString()}</p>
              </div>

              <button onClick={() => setStep("payment")} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium transition-all">
                Continue to Payment
              </button>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "mpesa", label: "M-Pesa", icon: "📱" },
                  { id: "card", label: "Visa / Mastercard", icon: "💳" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className={`p-3 rounded-xl border-2 text-sm transition-all flex flex-col items-center gap-1 ${payMethod === m.id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className={payMethod === m.id ? "text-teal-700 font-medium" : "text-gray-600"}>{m.label}</span>
                  </button>
                ))}
              </div>

              {payMethod === "mpesa" && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">M-Pesa Phone Number</label>
                  <input type="tel" placeholder="+254 700 000 000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <p className="text-gray-400 text-xs mt-2">You will receive an STK push to confirm payment.</p>
                </div>
              )}

              {payMethod === "card" && (
                <div className="space-y-3">
                  <input placeholder="Card number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM / YY" className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <input placeholder="CVV" className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Caregiver fee ({hours} hrs)</span><span>KES {total.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-600"><span>Platform fee (10%)</span><span>KES {Math.round(total * 0.1).toLocaleString()}</span></div>
                <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2"><span>Total</span><span>KES {Math.round(total * 1.1).toLocaleString()}</span></div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("details")} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm hover:bg-gray-50 transition-all">Back</button>
                <button onClick={() => setStep("confirmation")} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" /> Pay Now
                </button>
              </div>
            </div>
          )}

          {step === "confirmation" && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Booking Confirmed!</h3>
                <p className="text-gray-500 text-sm">Your booking with {caregiver.name} on {date} at {startTime} has been confirmed.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Booking ID</span><span className="text-gray-900 font-medium">BK-{Math.random().toString(36).slice(2,8).toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Invoice</span><span className="text-teal-600">View in Documents →</span></div>
              </div>
              <button onClick={onClose} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium transition-all">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BrowseCaregivers() {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [bookingCaregiver, setBookingCaregiver] = useState<Caregiver | null>(null);

  const filtered = mockCaregivers.filter((c) => {
    if (c.status !== "approved") return false;
    if (showAvailableOnly && !c.available) return false;
    if (selectedSpecialty !== "All" && !c.specialties.includes(selectedSpecialty)) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Find a Caregiver</h1>
        <p className="text-gray-500 text-sm">Browse verified caregivers matched to your loved one's needs</p>
      </div>

      {/* Search & filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or specialty..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <div className="flex gap-2 flex-wrap">
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSpecialty(s)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${selectedSpecialty === s ? "bg-teal-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all border ${showAvailableOnly ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200"}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${showAvailableOnly ? "bg-white" : "bg-emerald-500"}`} />
            Available only
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-gray-400 text-sm mb-4">{filtered.length} caregiver{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Caregiver grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <CaregiverCard key={c.id} c={c} onBook={setBookingCaregiver} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No caregivers match your filters</p>
          </div>
        )}
      </div>

      {bookingCaregiver && <BookingModal caregiver={bookingCaregiver} onClose={() => setBookingCaregiver(null)} />}
    </div>
  );
}
