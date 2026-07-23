import { useState } from "react";
import { mockCaregivers } from "../../data/mockData";
import { Star, Shield, Award, Edit2, Save, X, Plus, Trash2, CheckCircle2, MapPin, Phone, Mail } from "lucide-react";

export default function CaregiverProfile() {
  const [profile, setProfile] = useState({ ...mockCaregivers[0] });
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSpec, setNewSpec] = useState("");
  const [newCert, setNewCert] = useState("");

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-1">My Profile</h1>
          <p className="text-gray-500 text-sm">Manage your professional caregiver profile</p>
        </div>
        <div className="flex gap-2">
          {saved && <div className="flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl"><CheckCircle2 className="w-4 h-4" />Saved</div>}
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="p-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl transition-all"><X className="w-4 h-4" /></button>
              <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition-all"><Save className="w-4 h-4" />Save</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 border border-blue-200 text-blue-700 hover:bg-blue-50 text-sm px-4 py-2 rounded-xl transition-all"><Edit2 className="w-4 h-4" />Edit Profile</button>
          )}
        </div>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img src={profile.photo} alt={profile.name} className="w-20 h-20 rounded-2xl object-cover" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center border-2 border-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900 mb-1">{profile.name}</h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" />{profile.rating} ({profile.reviews} reviews)</div>
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4" />{profile.location}</div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" />Verified
              </span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" />Top Rated
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-xs mb-1.5">Bio</p>
          {editing ? (
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          ) : (
            <p className="text-gray-700 text-sm">{profile.bio}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contact info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            {[
              { label: "Email", value: profile.email, icon: Mail, field: "email" },
              { label: "Phone", value: profile.phone, icon: Phone, field: "phone" },
              { label: "Location", value: profile.location, icon: MapPin, field: "location" },
              { label: "Experience", value: profile.experience, icon: Award, field: "experience" },
            ].map(({ label, value, icon: Icon, field }) => (
              <div key={field}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-gray-400 text-xs">{label}</p>
                </div>
                {editing ? (
                  <input
                    value={value}
                    onChange={(e) => setProfile(p => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{value}</p>
                )}
              </div>
            ))}
            <div>
              <p className="text-gray-400 text-xs mb-1">Hourly Rate</p>
              {editing ? (
                <input
                  type="number"
                  value={profile.hourlyRate}
                  onChange={(e) => setProfile(p => ({ ...p, hourlyRate: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 text-sm">KES {profile.hourlyRate.toLocaleString()} / hour</p>
              )}
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 mb-4">Specialties</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.specialties.map((s) => (
              <div key={s} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 rounded-full px-3 py-1.5 text-sm">
                {s}
                {editing && (
                  <button onClick={() => setProfile(p => ({ ...p, specialties: p.specialties.filter(x => x !== s) }))} className="text-blue-400 hover:text-blue-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {editing && (
            <div className="flex gap-2 mb-4">
              <input value={newSpec} onChange={e => setNewSpec(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && newSpec.trim()) { setProfile(p => ({ ...p, specialties: [...p.specialties, newSpec.trim()] })); setNewSpec(""); }}} placeholder="Add specialty..." className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={() => { if (newSpec.trim()) { setProfile(p => ({ ...p, specialties: [...p.specialties, newSpec.trim()] })); setNewSpec(""); }}} className="p-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4" /></button>
            </div>
          )}

          <h4 className="text-gray-700 mb-3">Languages</h4>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((l) => (
              <span key={l} className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm">{l}</span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 mb-4">Certifications</h3>
          <div className="space-y-2 mb-3">
            {profile.certifications.map((c) => (
              <div key={c} className="flex items-center justify-between bg-emerald-50 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 text-sm">{c}</span>
                </div>
                {editing && (
                  <button onClick={() => setProfile(p => ({ ...p, certifications: p.certifications.filter(x => x !== c) }))} className="text-emerald-400 hover:text-emerald-600"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
            ))}
          </div>
          {editing && (
            <div className="flex gap-2">
              <input value={newCert} onChange={e => setNewCert(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && newCert.trim()) { setProfile(p => ({ ...p, certifications: [...p.certifications, newCert.trim()] })); setNewCert(""); }}} placeholder="Add certification..." className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={() => { if (newCert.trim()) { setProfile(p => ({ ...p, certifications: [...p.certifications, newCert.trim()] })); setNewCert(""); }}} className="p-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4" /></button>
            </div>
          )}
        </div>

        {/* Stats card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 mb-4">Performance Stats</h3>
          <div className="space-y-4">
            {[
              { label: "Overall Rating", value: `${profile.rating} / 5.0`, bar: (profile.rating / 5) * 100, color: "amber" },
              { label: "On-time Arrival", value: "96%", bar: 96, color: "teal" },
              { label: "Task Completion", value: "98%", bar: 98, color: "emerald" },
              { label: "Family Satisfaction", value: "94%", bar: 94, color: "blue" },
            ].map(({ label, value, bar, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{label}</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div className={`bg-${color}-500 rounded-full h-2`} style={{ width: `${bar}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center bg-amber-50 rounded-xl p-3">
            <p className="text-amber-700 text-sm font-medium">⭐ {profile.reviews} Total Reviews</p>
            <p className="text-amber-600 text-xs">Member since {profile.joinedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
