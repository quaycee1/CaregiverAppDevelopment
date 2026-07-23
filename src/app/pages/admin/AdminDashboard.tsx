import { useNavigate } from "react-router";
import { mockBookings, mockCaregivers, mockTransactions, mockSupportTickets } from "../../data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { Users, Calendar, CreditCard, MessageSquare, Shield, TrendingUp, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

const monthlyRevenue = [
  { month: "Sep", revenue: 45000, bookings: 14 },
  { month: "Oct", revenue: 52000, bookings: 17 },
  { month: "Nov", revenue: 48000, bookings: 15 },
  { month: "Dec", revenue: 61000, bookings: 19 },
  { month: "Jan", revenue: 55000, bookings: 18 },
  { month: "Feb", revenue: 67000, bookings: 21 },
  { month: "Mar", revenue: 24320, bookings: 8 },
];

const userDistribution = [
  { name: "Family Members", value: 48, color: "#0d9488" },
  { name: "Caregivers", value: 32, color: "#3b82f6" },
  { name: "Patients", value: 52, color: "#8b5cf6" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const pendingCaregivers = mockCaregivers.filter((c) => c.status === "pending").length;
  const openTickets = mockSupportTickets.filter((t) => t.status === "open" || t.status === "in-progress").length;
  const totalRevenue = mockTransactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const pendingPayouts = mockTransactions.filter(t => t.status === "pending").reduce((s, t) => s + t.caregiverPayout, 0);

  const kpiCards = [
    { label: "Active Bookings", value: mockBookings.filter(b => b.status !== "cancelled").length, icon: Calendar, iconClass: "text-teal-600", bgClass: "bg-teal-50", borderClass: "border-gray-100", sub: "+3 this week", alert: false },
    { label: "Total Users", value: "132", icon: Users, iconClass: "text-blue-600", bgClass: "bg-blue-50", borderClass: "border-gray-100", sub: "48 families · 32 caregivers", alert: false },
    { label: "Revenue (Month)", value: `KES ${totalRevenue.toLocaleString()}`, icon: CreditCard, iconClass: "text-emerald-600", bgClass: "bg-emerald-50", borderClass: "border-gray-100", sub: "March 2026", alert: false },
    { label: "Pending Payouts", value: `KES ${pendingPayouts.toLocaleString()}`, icon: TrendingUp, iconClass: "text-amber-600", bgClass: "bg-amber-50", borderClass: "border-amber-200", sub: `${mockTransactions.filter(t => t.status === "pending").length} transactions`, alert: true },
    { label: "Pending Verifications", value: String(pendingCaregivers), icon: Shield, iconClass: "text-violet-600", bgClass: "bg-violet-50", borderClass: pendingCaregivers > 0 ? "border-violet-200" : "border-gray-100", sub: "new caregiver registrations", alert: pendingCaregivers > 0 },
    { label: "Open Support Tickets", value: String(openTickets), icon: MessageSquare, iconClass: "text-red-600", bgClass: "bg-red-50", borderClass: openTickets > 0 ? "border-red-200" : "border-gray-100", sub: "1 high priority", alert: openTickets > 0 },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Vizazi Care platform overview · March 6, 2026</p>
      </div>

      {/* Alerts */}
      {(pendingCaregivers > 0 || openTickets > 0) && (
        <div className="space-y-2">
          {pendingCaregivers > 0 && (
            <div
              onClick={() => navigate("/admin/caregivers")}
              className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-violet-100 transition-all"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-violet-600" />
                <p className="text-violet-800 text-sm font-medium">{pendingCaregivers} caregiver registration{pendingCaregivers > 1 ? "s" : ""} awaiting verification</p>
              </div>
              <ChevronRight className="w-4 h-4 text-violet-400" />
            </div>
          )}
          {openTickets > 0 && (
            <div
              onClick={() => navigate("/admin/support")}
              className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-red-100 transition-all"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-600" />
                <p className="text-red-800 text-sm font-medium">{openTickets} support ticket{openTickets > 1 ? "s" : ""} require attention</p>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </div>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, iconClass, bgClass, borderClass, sub, alert }) => (
          <div key={label} className={`bg-white rounded-2xl border shadow-sm p-5 ${borderClass}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${bgClass} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconClass}`} />
              </div>
              {alert && <div className="w-2 h-2 bg-red-500 rounded-full" />}
            </div>
            <p className="text-gray-900 text-xl font-bold">{value}</p>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-gray-900">Revenue & Bookings</h3>
            <span className="text-xs text-gray-400">Last 7 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyRevenue} barSize={24}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis key="x" dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis key="y" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                key="tooltip"
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                formatter={(val, name) => [name === "revenue" ? `KES ${Number(val).toLocaleString()}` : val, name === "revenue" ? "Revenue" : "Bookings"]}
              />
              <Bar key="bar-revenue" dataKey="revenue" fill="#0d9488" radius={[6, 6, 0, 0]} />
              <Bar key="bar-bookings" dataKey="bookings" fill="#dbeafe" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 mb-5">User Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={userDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {userDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {userDistribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="text-gray-900 font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Verify Caregivers", icon: Shield, path: "/admin/caregivers", iconClass: "text-violet-600", bgClass: "bg-violet-50", count: pendingCaregivers },
          { label: "View Bookings", icon: Calendar, path: "/admin/bookings", iconClass: "text-teal-600", bgClass: "bg-teal-50", count: null },
          { label: "Manage Payouts", icon: CreditCard, path: "/admin/transactions", iconClass: "text-emerald-600", bgClass: "bg-emerald-50", count: null },
          { label: "Support Portal", icon: MessageSquare, path: "/admin/support", iconClass: "text-red-600", bgClass: "bg-red-50", count: openTickets },
        ].map(({ label, icon: Icon, path, iconClass, bgClass, count }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="relative flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            {count ? (
              <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">{count}</div>
            ) : null}
            <div className={`w-10 h-10 ${bgClass} rounded-xl flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${iconClass}`} />
            </div>
            <span className="text-gray-700 text-xs font-medium text-center">{label}</span>
          </button>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Recent Transactions</h3>
          <button onClick={() => navigate("/admin/transactions")} className="text-purple-600 text-sm flex items-center gap-1 hover:text-purple-700">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {mockTransactions.map((txn) => (
            <div key={txn.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="text-gray-900 font-medium">{txn.familyMemberName} → {txn.caregiverName}</p>
                <p className="text-gray-400 text-xs">{txn.date} · {txn.paymentMethod}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-900 font-medium">KES {txn.amount.toLocaleString()}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${txn.status === "completed" ? "bg-emerald-100 text-emerald-700" : txn.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}