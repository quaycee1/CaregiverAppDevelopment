import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  Heart, LayoutDashboard, Users, Calendar, ClipboardList, MapPin,
  FileText, Activity, Bell, LogOut, Menu, X, ChevronDown,
  Shield, CreditCard, MessageSquare, UserCheck, BarChart3,
  BookOpen
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const familyNav: NavItem[] = [
  { label: "Dashboard", path: "/family", icon: LayoutDashboard },
  { label: "Find Caregivers", path: "/family/caregivers", icon: Users },
  { label: "My Bookings", path: "/family/bookings", icon: Calendar },
  { label: "Live Monitoring", path: "/family/monitoring", icon: Activity },
  { label: "Documents", path: "/family/documents", icon: FileText },
  { label: "Patient Profile", path: "/family/profile", icon: Heart },
];

const caregiverNav: NavItem[] = [
  { label: "Dashboard", path: "/caregiver", icon: LayoutDashboard },
  { label: "Check In / Out", path: "/caregiver/checkin", icon: MapPin },
  { label: "My Tasks", path: "/caregiver/tasks", icon: ClipboardList },
  { label: "Visit Logs", path: "/caregiver/logs", icon: BookOpen },
  { label: "Availability", path: "/caregiver/calendar", icon: Calendar },
  { label: "My Profile", path: "/caregiver/profile", icon: UserCheck },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", path: "/admin", icon: BarChart3 },
  { label: "Caregiver Verification", path: "/admin/caregivers", icon: Shield },
  { label: "Bookings", path: "/admin/bookings", icon: Calendar },
  { label: "Transactions", path: "/admin/transactions", icon: CreditCard },
  { label: "Support Portal", path: "/admin/support", icon: MessageSquare },
];

const roleStyles = {
  family: {
    nav: familyNav,
    label: "Family Portal",
    activeLink: "bg-teal-50 text-teal-700 border-r-2 border-teal-600",
    hoverLink: "hover:bg-teal-50 hover:text-teal-700",
    activeMobile: "text-teal-600",
    dot: "bg-teal-600",
    logoColor: "bg-teal-600",
    badge: "bg-teal-100 text-teal-800",
    icon: "text-teal-700",
    accent: "text-teal-600",
  },
  caregiver: {
    nav: caregiverNav,
    label: "Caregiver Portal",
    activeLink: "bg-blue-50 text-blue-700 border-r-2 border-blue-600",
    hoverLink: "hover:bg-blue-50 hover:text-blue-700",
    activeMobile: "text-blue-600",
    dot: "bg-blue-600",
    logoColor: "bg-blue-600",
    badge: "bg-blue-100 text-blue-800",
    icon: "text-blue-700",
    accent: "text-blue-600",
  },
  admin: {
    nav: adminNav,
    label: "Admin Dashboard",
    activeLink: "bg-purple-50 text-purple-700 border-r-2 border-purple-600",
    hoverLink: "hover:bg-purple-50 hover:text-purple-700",
    activeMobile: "text-purple-600",
    dot: "bg-purple-600",
    logoColor: "bg-purple-600",
    badge: "bg-purple-100 text-purple-800",
    icon: "text-purple-700",
    accent: "text-purple-600",
  },
};

function RoleBadge({ role }: { role: "family" | "caregiver" | "admin" }) {
  const styles = roleStyles[role];
  const labels = { family: "Family", caregiver: "Caregiver", admin: "Admin" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles.badge}`}>
      {labels[role]}
    </span>
  );
}

export default function AppLayout() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [notifications, setNotifications] = useState(3);

  if (!user) return null;

  const styles = roleStyles[user.role];
  const activeNav = styles.nav;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${styles.logoColor} rounded-xl flex items-center justify-center`}>
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-sm">Vizazi Care</p>
            <p className="text-gray-400 text-xs">{styles.label}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {activeNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/family" || item.path === "/caregiver" || item.path === "/admin"}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive ? styles.activeLink : `text-gray-600 ${styles.hoverLink}`
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User menu */}
      <div className="p-3 border-t border-gray-100">
        <div className="relative">
          <button
            onClick={() => setShowRolePicker(!showRolePicker)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-all text-left"
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className={`w-8 h-8 rounded-full ${styles.badge} flex items-center justify-center flex-shrink-0`}>
                <span className={`${styles.icon} text-xs font-bold`}>{user.name.charAt(0)}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-xs font-medium truncate">{user.name}</p>
              <RoleBadge role={user.role} />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </button>

          {showRolePicker && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
              <div className="p-2 border-b border-gray-100">
                <p className="text-xs text-gray-400 px-2">Switch Demo Role</p>
              </div>
              {(["family", "caregiver", "admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowRolePicker(false);
                    setSidebarOpen(false);
                    if (r === "family") navigate("/family");
                    else if (r === "caregiver") navigate("/caregiver");
                    else navigate("/admin");
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-all ${user.role === r ? "opacity-50 cursor-default" : ""}`}
                >
                  <div className={`w-2 h-2 rounded-full ${roleStyles[r].dot}`} />
                  {r === "family" ? "Family Member" : r === "caregiver" ? "Caregiver" : "Admin"}
                </button>
              ))}
              <div className="border-t border-gray-100">
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-all">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
              <span className="text-gray-600 text-sm">{styles.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-all"
              onClick={() => setNotifications(0)}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden bg-white border-t border-gray-100 flex-shrink-0 safe-area-inset-bottom">
          <div className="flex items-center">
            {activeNav.slice(0, 5).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/family" || item.path === "/caregiver" || item.path === "/admin"}
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center gap-1 py-2.5 text-xs transition-all ${
                    isActive ? styles.activeMobile : "text-gray-400"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-5 h-5 ${isActive ? styles.activeMobile : "text-gray-400"}`} />
                    <span className="leading-none">{item.label.split(" ")[0]}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
