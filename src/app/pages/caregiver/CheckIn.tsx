import { useState, useEffect } from "react";
import { mockBookings } from "../../data/mockData";
import { MapPin, Clock, CheckCircle2, LogIn, LogOut, Navigation, AlertCircle, Camera } from "lucide-react";

type CheckStatus = "idle" | "checking-in" | "checked-in" | "checking-out" | "completed";

export default function CheckIn() {
  const [status, setStatus] = useState<CheckStatus>("idle");
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [liveTime, setLiveTime] = useState(new Date());

  const booking = mockBookings[0]; // Active booking

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (status === "checked-in") {
      timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  const formatElapsed = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const getLocation = (): Promise<{ lat: number; lng: number }> =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {
          // Simulate Nairobi location if permission denied
          resolve({ lat: -1.2921 + (Math.random() - 0.5) * 0.001, lng: 36.8219 + (Math.random() - 0.5) * 0.001 });
        },
        { timeout: 5000 }
      );
    });

  const handleCheckIn = async () => {
    setStatus("checking-in");
    setGettingLocation(true);
    setLocationError("");
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const loc = await getLocation();
      setLocation(loc);
      setCheckInTime(new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }));
      setStatus("checked-in");
      setElapsed(0);
    } catch (e) {
      setLocationError("Could not get location. Using last known address.");
      setLocation({ lat: -1.2921, lng: 36.8219 });
      setCheckInTime(new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }));
      setStatus("checked-in");
    } finally {
      setGettingLocation(false);
    }
  };

  const handleCheckOut = async () => {
    setStatus("checking-out");
    await new Promise((r) => setTimeout(r, 1500));
    setCheckOutTime(new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }));
    setStatus("completed");
  };

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1">Check In / Out</h1>
        <p className="text-gray-500 text-sm">GPS-verified attendance for your visit</p>
      </div>

      {/* Current time */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
        <p className="text-gray-400 text-sm mb-1">Current Time</p>
        <p className="text-gray-900 text-4xl font-mono font-semibold tracking-tight">
          {liveTime.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {liveTime.toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Today's booking */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-gray-900 mb-3">Today's Visit</h3>
        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://images.unsplash.com/photo-1765896387454-3c29c0473615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100"
            alt="Patient"
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <p className="text-gray-900 font-medium">{booking.patientName}</p>
            <p className="text-gray-400 text-sm">{booking.date} · {booking.startTime}–{booking.endTime}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 rounded-xl p-3">
            <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
            <p className="text-gray-900 text-sm font-medium">{booking.startTime}</p>
            <p className="text-gray-400 text-xs">Scheduled Start</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
            <p className="text-gray-900 text-sm font-medium">{booking.endTime}</p>
            <p className="text-gray-400 text-xs">Scheduled End</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
            <p className="text-gray-900 text-sm font-medium">{booking.duration}h</p>
            <p className="text-gray-400 text-xs">Duration</p>
          </div>
        </div>
      </div>

      {/* GPS Map placeholder */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 h-40 flex items-center justify-center relative">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${location ? "bg-teal-500" : "bg-gray-200"}`}>
              <MapPin className={`w-6 h-6 ${location ? "text-white" : "text-gray-400"}`} />
            </div>
            {location ? (
              <div>
                <p className="text-teal-700 text-sm font-medium">Location Verified</p>
                <p className="text-teal-600 text-xs">{location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°</p>
                <p className="text-teal-600 text-xs">14 Kileleshwa Ave, Nairobi</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-sm">GPS Location</p>
                <p className="text-gray-400 text-xs">Will be recorded on check-in</p>
              </div>
            )}
          </div>
          {location && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-teal-300 rounded-full opacity-40 animate-ping" />
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-gray-400" />
            <p className="text-gray-600 text-sm">14 Kileleshwa Avenue, Nairobi</p>
          </div>
        </div>
      </div>

      {/* Check-in/out status */}
      {locationError && (
        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {locationError}
        </div>
      )}

      {status === "idle" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">📍 Before you check in</p>
            <ul className="space-y-1 text-blue-700 list-disc list-inside">
              <li>Ensure you are at the patient's address</li>
              <li>Your GPS location will be automatically recorded</li>
              <li>Timestamp will be logged for transparency</li>
            </ul>
          </div>
          <button
            onClick={handleCheckIn}
            disabled={gettingLocation}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 transition-all shadow-lg"
          >
            <LogIn className="w-6 h-6" /> Check In Now
          </button>
        </div>
      )}

      {status === "checking-in" && (
        <div className="text-center py-8">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Getting your location…</p>
          <p className="text-gray-400 text-sm">Please allow location access if prompted</p>
        </div>
      )}

      {status === "checked-in" && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-emerald-800 font-medium">Checked In Successfully</p>
                <p className="text-emerald-600 text-sm">at {checkInTime} · GPS verified</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Session Duration</p>
              <p className="text-emerald-700 text-3xl font-mono font-bold">{formatElapsed(elapsed)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className="text-gray-400 text-xs">Check-In</p>
              <p className="text-gray-900 font-semibold">{checkInTime}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className="text-gray-400 text-xs">Location</p>
              <p className="text-gray-900 font-semibold text-sm">Verified ✓</p>
            </div>
          </div>

          <button
            onClick={handleCheckOut}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 transition-all shadow-lg"
          >
            <LogOut className="w-6 h-6" /> Check Out
          </button>
        </div>
      )}

      {status === "checking-out" && (
        <div className="text-center py-8">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Recording check-out…</p>
        </div>
      )}

      {status === "completed" && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-gray-900">Visit Completed!</h3>
              <p className="text-gray-500 text-sm">Your attendance has been recorded</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
                <p className="text-gray-400 text-xs">Check-In</p>
                <p className="text-gray-900 font-semibold">{checkInTime}</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
                <p className="text-gray-400 text-xs">Check-Out</p>
                <p className="text-gray-900 font-semibold">{checkOutTime}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            Please submit your post-visit log to complete the visit record.
          </div>
          <button
            onClick={() => setStatus("idle")}
            className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-all"
          >
            Reset (Demo)
          </button>
        </div>
      )}
    </div>
  );
}
