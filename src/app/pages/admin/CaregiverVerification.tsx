import { useState } from "react";
import { mockCaregivers, Caregiver } from "../../data/mockData";
import {
  Shield, CheckCircle2, XCircle, Clock, Star, MapPin, X,
  Phone, Mail, Award, Languages, Search, Eye
} from "lucide-react";

type VerificationStatus = "all" | "pending" | "approved" | "rejected";

function CaregiverDetailModal({
  caregiver,
  onApprove,
  onReject,
  onClose,
}: {
  caregiver: Caregiver;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-gray-900">Caregiver Review</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-4">
            {caregiver.photo ? (
              <img src={caregiver.photo} alt={caregiver.name} className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 text-xl font-bold">{caregiver.name.charAt(0)}</div>
            )}
            <div>
              <h2 className="text-gray-900">{caregiver.name}</h2>
              <p className="text-gray-400 text-sm">Applied: {caregiver.joinedDate}</p>
              <span className={`text-xs px-2.5 py-1 rounded-full ${caregiver.status === "pending" ? "bg-amber-100 text-amber-700" : caregiver.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                {caregiver.status}
              </span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Email", value: caregiver.email, icon: Mail },
              { label: "Phone", value: caregiver.phone, icon: Phone },
              { label: "Location", value: caregiver.location, icon: MapPin },
              { label: "Experience", value: caregiver.experience, icon: Award },
              { label: "Hourly Rate", value: `KES ${caregiver.hourlyRate.toLocaleString()}`, icon: Star },
              { label: "Languages", value: caregiver.languages.join(", "), icon: Languages },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-gray-400 text-xs">{label}</p>
                </div>
                <p className="text-gray-900 text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div>
            <p className="text-gray-400 text-xs mb-1.5">Professional Bio</p>
            <p className="text-gray-700 text-sm bg-gray-50 rounded-xl p-4">{caregiver.bio}</p>
          </div>

          {/* Specialties */}
          <div>
            <p className="text-gray-400 text-xs mb-2">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {caregiver.specialties.map((s) => (
                <span key={s} className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <p className="text-gray-400 text-xs mb-2">Certifications Provided</p>
            <div className="space-y-2">
              {caregiver.certifications.map((c) => (
                <div key={c} className="flex items-center gap-2 bg-emerald-50 rounded-xl p-3">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 text-sm">{c}</span>
                  <span className="ml-auto text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Submitted</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Review Notes (internal)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={2}
              placeholder="Add any notes about this application..."
            />
          </div>

          {/* Actions */}
          {caregiver.status === "pending" && (
            <div className="flex gap-3">
              <button
                onClick={() => { onReject(caregiver.id); onClose(); }}
                className="flex-1 border-2 border-red-200 text-red-600 py-3 rounded-xl font-medium hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => { onApprove(caregiver.id); onClose(); }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve
              </button>
            </div>
          )}
          {caregiver.status !== "pending" && (
            <div className={`text-center py-3 rounded-xl text-sm font-medium ${caregiver.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              This application has been {caregiver.status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CaregiverVerification() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>(mockCaregivers);
  const [filter, setFilter] = useState<VerificationStatus>("all");
  const [search, setSearch] = useState("");
  const [reviewing, setReviewing] = useState<Caregiver | null>(null);

  const filtered = caregivers.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    setCaregivers((prev) => prev.map((c) => c.id === id ? { ...c, status, verified: status === "approved" } : c));
  };

  const counts = {
    all: caregivers.length,
    pending: caregivers.filter(c => c.status === "pending").length,
    approved: caregivers.filter(c => c.status === "approved").length,
    rejected: caregivers.filter(c => c.status === "rejected").length,
  };

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Caregiver Verification</h1>
        <p className="text-gray-500 text-sm">Review and approve new caregiver registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(["all", "pending", "approved", "rejected"] as VerificationStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`bg-white rounded-xl border p-3 text-center transition-all ${filter === s ? "border-purple-400 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
          >
            <p className={`text-xl font-bold ${s === "pending" ? "text-amber-600" : s === "approved" ? "text-emerald-600" : s === "rejected" ? "text-red-600" : "text-gray-900"}`}>{counts[s]}</p>
            <p className="text-gray-400 text-xs capitalize">{s}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search caregivers..." className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" />
      </div>

      {/* Caregiver list */}
      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-4">
              {c.photo ? (
                <img src={c.photo} alt={c.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 text-lg font-bold flex-shrink-0">{c.name.charAt(0)}</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-gray-900">{c.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Mail className="w-3 h-3" />{c.email}
                      <span>·</span>
                      <MapPin className="w-3 h-3" />{c.location}
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                    c.status === "pending" ? "bg-amber-100 text-amber-700" :
                    c.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {c.status === "pending" && <Clock className="w-3 h-3 inline mr-1" />}
                    {c.status === "approved" && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                    {c.status === "rejected" && <XCircle className="w-3 h-3 inline mr-1" />}
                    {c.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {c.specialties.slice(0, 2).map(s => (
                    <span key={s} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                  <span className="text-xs text-gray-400">{c.experience} · KES {c.hourlyRate.toLocaleString()}/hr</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Applied: {c.joinedDate}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">{c.certifications.length} cert{c.certifications.length !== 1 ? "s" : ""} submitted</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
              <button onClick={() => setReviewing(c)} className="flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all">
                <Eye className="w-4 h-4" /> Review Application
              </button>
              {c.status === "pending" && (
                <>
                  <button onClick={() => updateStatus(c.id, "rejected")} className="flex items-center gap-2 text-sm px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button onClick={() => updateStatus(c.id, "approved")} className="flex items-center gap-2 text-sm px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all ml-auto">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {reviewing && (
        <CaregiverDetailModal
          caregiver={reviewing}
          onApprove={(id) => updateStatus(id, "approved")}
          onReject={(id) => updateStatus(id, "rejected")}
          onClose={() => setReviewing(null)}
        />
      )}
    </div>
  );
}
