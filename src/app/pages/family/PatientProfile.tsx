import { useState } from "react";
import { mockPatients } from "../../data/mockData";
import {
  User, Heart, Phone, MapPin, Pill, AlertTriangle, Edit2, Save, X,
  Droplets, Activity, Plus, Trash2, CheckCircle2
} from "lucide-react";

export default function PatientProfile() {
  const [patient, setPatient] = useState({ ...mockPatients[0] });
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newCondition, setNewCondition] = useState("");
  const [newMed, setNewMed] = useState("");

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setPatient(p => ({ ...p, conditions: [...p.conditions, newCondition.trim()] }));
      setNewCondition("");
    }
  };

  const removeCondition = (c: string) =>
    setPatient(p => ({ ...p, conditions: p.conditions.filter(x => x !== c) }));

  const addMed = () => {
    if (newMed.trim()) {
      setPatient(p => ({ ...p, medications: [...p.medications, newMed.trim()] }));
      setNewMed("");
    }
  };

  const removeMed = (m: string) =>
    setPatient(p => ({ ...p, medications: p.medications.filter(x => x !== m) }));

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 mb-1">Patient Profile</h1>
          <p className="text-gray-500 text-sm">Manage your loved one's health information</p>
        </div>
        <div className="flex gap-2">
          {saved && (
            <div className="flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4" /> Saved
            </div>
          )}
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="p-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                <X className="w-4 h-4" />
              </button>
              <button onClick={handleSave} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded-xl transition-all">
                <Save className="w-4 h-4" /> Save
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 border border-teal-200 text-teal-700 hover:bg-teal-50 text-sm px-4 py-2 rounded-xl transition-all">
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img src={patient.photo} alt={patient.name} className="w-20 h-20 rounded-2xl object-cover" />
            {editing && (
              <button className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white text-xs">
                Change
              </button>
            )}
          </div>
          <div className="flex-1">
            {editing ? (
              <input
                value={patient.name}
                onChange={e => setPatient(p => ({ ...p, name: e.target.value }))}
                className="text-gray-900 text-lg font-medium border-b-2 border-teal-400 outline-none w-full mb-1 pb-1"
              />
            ) : (
              <h2 className="text-gray-900 mb-1">{patient.name}</h2>
            )}
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <span>Age {patient.age}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-red-500" />{patient.bloodType}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2"><User className="w-4 h-4 text-teal-600" />Basic Information</h3>
          <div className="space-y-4">
            {[
              { label: "Age", field: "age", value: String(patient.age), icon: User },
              { label: "Blood Type", field: "bloodType", value: patient.bloodType, icon: Droplets },
              { label: "Home Address", field: "address", value: patient.address, icon: MapPin },
              { label: "Emergency Contact", field: "emergencyContact", value: patient.emergencyContact, icon: Phone },
            ].map(({ label, field, value, icon: Icon }) => (
              <div key={field}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <label className="text-gray-400 text-xs">{label}</label>
                </div>
                {editing && field !== "age" && field !== "bloodType" ? (
                  <input
                    value={value}
                    onChange={e => setPatient(p => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-red-500" />Medical Conditions</h3>
          <div className="space-y-2 mb-3">
            {patient.conditions.map((c) => (
              <div key={c} className="flex items-center justify-between bg-red-50 rounded-xl px-3 py-2">
                <span className="text-red-700 text-sm">{c}</span>
                {editing && (
                  <button onClick={() => removeCondition(c)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {editing && (
            <div className="flex gap-2">
              <input
                value={newCondition}
                onChange={e => setNewCondition(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addCondition()}
                placeholder="Add condition..."
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button onClick={addCondition} className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Medications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2"><Pill className="w-4 h-4 text-blue-500" />Current Medications</h3>
          <div className="space-y-2 mb-3">
            {patient.medications.map((m) => (
              <div key={m} className="flex items-center justify-between bg-blue-50 rounded-xl px-3 py-2">
                <span className="text-blue-700 text-sm">{m}</span>
                {editing && (
                  <button onClick={() => removeMed(m)} className="text-blue-400 hover:text-blue-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {editing && (
            <div className="flex gap-2">
              <input
                value={newMed}
                onChange={e => setNewMed(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addMed()}
                placeholder="Add medication..."
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button onClick={addMed} className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" />Allergies & Alerts</h3>
          <div className="space-y-2">
            {patient.allergies.map((a) => (
              <div key={a} className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="text-amber-700 text-sm">{a}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-3">
            <p className="text-orange-800 text-xs font-medium mb-1">⚠ Caregiver Alert</p>
            <p className="text-orange-700 text-xs">This patient has known drug allergies. Caregivers are automatically notified of all allergies listed above before each visit.</p>
          </div>
        </div>
      </div>

      {/* Care preferences */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-4">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2"><Heart className="w-4 h-4 text-pink-500" />Care Preferences & Notes</h3>
        <textarea
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          rows={4}
          readOnly={!editing}
          defaultValue="Father prefers morning visits. Enjoys classical music and reading. Does not like bathing help from male caregivers. Speaks primarily Swahili and Luo at home. Prefers walks in the garden in the morning before 10am."
        />
      </div>
    </div>
  );
}
