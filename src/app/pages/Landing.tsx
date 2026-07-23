import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Heart, Shield, Users, Clock, Star, ChevronRight, Eye, EyeOff } from "lucide-react";

const DEMO_ACCOUNTS = [
  { label: "Family Member", email: "family@vizazi.care", color: "bg-teal-50 border-teal-200 text-teal-800", dot: "bg-teal-500" },
  { label: "Caregiver", email: "caregiver@vizazi.care", color: "bg-blue-50 border-blue-200 text-blue-800", dot: "bg-blue-500" },
  { label: "Admin", email: "admin@vizazi.care", color: "bg-purple-50 border-purple-200 text-purple-800", dot: "bg-purple-500" },
];

export default function Landing() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await login(email, password);
    if (success) {
      const user = JSON.parse(localStorage.getItem("vizazi_user") || "{}");
      if (user.role === "family") navigate("/family");
      else if (user.role === "caregiver") navigate("/caregiver");
      else navigate("/admin");
    } else {
      setError("Invalid credentials. Use one of the demo accounts below.");
    }
  };

  const quickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    const success = await login(demoEmail, "password");
    if (success) {
      const user = JSON.parse(localStorage.getItem("vizazi_user") || "{}");
      if (user.role === "family") navigate("/family");
      else if (user.role === "caregiver") navigate("/caregiver");
      else navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left hero panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 p-8 lg:p-12 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full border-4 border-white" />
          <div className="absolute bottom-[-60px] left-[-60px] w-60 h-60 rounded-full border-4 border-white" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full border-2 border-white" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-white tracking-tight">Vizazi Care</h1>
              <p className="text-teal-200 text-xs">Generations of Compassion</p>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 my-8 lg:my-0">
          <h2 className="text-white mb-4" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", lineHeight: 1.2 }}>
            Professional Care for<br />Your Loved Ones
          </h2>
          <p className="text-teal-100 mb-8 max-w-md">
            Connect with verified caregivers, monitor health in real time, and ensure peace of mind — all in one platform built for African families.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, label: "Verified Caregivers", desc: "All caregivers background-checked" },
              { icon: Clock, label: "Real-Time Tracking", desc: "GPS check-in & live updates" },
              { icon: Heart, label: "Health Monitoring", desc: "Vitals logged every visit" },
              { icon: Star, label: "Trusted Platform", desc: "4.9★ avg caregiver rating" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Icon className="w-5 h-5 text-teal-200 mb-2" />
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-teal-200 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["bg-teal-300", "bg-emerald-300", "bg-cyan-300"].map((c, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-teal-700 flex items-center justify-center text-xs text-teal-900 font-bold`}>
                  {["A", "G", "B"][i]}
                </div>
              ))}
            </div>
            <p className="text-teal-100 text-sm">Join 500+ families already using Vizazi Care</p>
          </div>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-lg text-sm capitalize transition-all ${
                  activeTab === tab
                    ? "bg-white text-teal-700 shadow-sm font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {activeTab === "login" ? (
            <>
              <h2 className="text-gray-900 mb-1">Welcome back</h2>
              <p className="text-gray-500 text-sm mb-8">Sign in to your Vizazi Care account</p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all pr-12"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Sign In <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              {/* Demo accounts */}
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <p className="text-gray-400 text-xs">Demo Accounts</p>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="space-y-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      onClick={() => quickLogin(acc.email)}
                      disabled={isLoading}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all hover:shadow-sm disabled:opacity-60 ${acc.color}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${acc.dot}`} />
                        <div className="text-left">
                          <p className="font-medium">{acc.label}</p>
                          <p className="opacity-70 text-xs">{acc.email}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <RegisterForm onSwitch={() => setActiveTab("login")} />
          )}
        </div>
      </div>
    </div>
  );
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [role, setRole] = useState<"family" | "caregiver">("family");
  const [step, setStep] = useState(1);

  return (
    <div>
      <h2 className="text-gray-900 mb-1">Create your account</h2>
      <p className="text-gray-500 text-sm mb-6">Join Vizazi Care as a family member or caregiver</p>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {(["family", "caregiver"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`flex-1 py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all ${
              role === r ? "bg-white text-teal-700 shadow-sm font-medium" : "text-gray-500"
            }`}
          >
            {r === "family" ? <Users className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
            {r === "family" ? "Family Member" : "Caregiver"}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">First name</label>
              <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="First name" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Last name</label>
              <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Last name" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Email address</label>
            <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Phone number</label>
            <input type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="+254 700 000 000" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Password</label>
            <input type="password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="••••••••" />
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium transition-all"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {role === "family" ? (
            <>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-800">
                You'll be able to create your loved one's profile after registration.
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Relationship to patient</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Daughter / Son</option>
                  <option>Spouse</option>
                  <option>Sibling</option>
                  <option>Other</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Primary specialty</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Dementia Care</option>
                  <option>Physiotherapy</option>
                  <option>General Home Care</option>
                  <option>Palliative Care</option>
                  <option>Diabetes Management</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Years of experience</label>
                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. 3 years" />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                📋 Your profile will be reviewed and verified by our admin team before you can receive bookings.
              </div>
            </>
          )}
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all">Back</button>
            <button
              onClick={onSwitch}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-gray-500 text-sm mt-6">
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-teal-600 hover:text-teal-700 font-medium">Sign in</button>
      </p>
    </div>
  );
}
