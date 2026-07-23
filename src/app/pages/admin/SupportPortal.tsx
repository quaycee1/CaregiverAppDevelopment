import { useState } from "react";
import { mockSupportTickets, SupportTicket } from "../../data/mockData";
import {
  MessageSquare, Send, X, Clock, CheckCircle2, AlertCircle,
  User, ChevronRight, Search, Tag
} from "lucide-react";

type TicketStatus = "all" | "open" | "in-progress" | "resolved" | "closed";

const statusConfig = {
  open: { color: "bg-red-100 text-red-700", icon: AlertCircle },
  "in-progress": { color: "bg-amber-100 text-amber-700", icon: Clock },
  resolved: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  closed: { color: "bg-gray-100 text-gray-600", icon: X },
};

const priorityConfig = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-red-100 text-red-700",
};

function TicketConversation({ ticket, onClose }: { ticket: SupportTicket; onClose: () => void }) {
  const [messages, setMessages] = useState([...ticket.messages]);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState(ticket.status);

  const sendReply = () => {
    if (!reply.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        senderId: "admin",
        senderName: "Admin James",
        content: reply.trim(),
        timestamp: new Date().toISOString(),
        isAdmin: true,
      },
    ]);
    setReply("");
    if (status === "open") setStatus("in-progress");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col" style={{ maxHeight: "85vh" }}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400 text-xs">{ticket.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[status].color}`}>{status}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${priorityConfig[ticket.priority]}`}>{ticket.priority}</span>
            </div>
            <h3 className="text-gray-900">{ticket.subject}</h3>
            <p className="text-gray-400 text-xs">{ticket.userName} · {ticket.userRole}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${msg.isAdmin ? "items-end" : "items-start"} flex flex-col`}>
                <div className={`flex items-center gap-1.5 mb-1.5 ${msg.isAdmin ? "flex-row-reverse" : ""}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${msg.isAdmin ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {msg.senderName.charAt(0)}
                  </div>
                  <span className="text-gray-400 text-xs">{msg.senderName}</span>
                  <span className="text-gray-300 text-xs">{new Date(msg.timestamp).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className={`px-4 py-3 rounded-2xl text-sm ${msg.isAdmin ? "bg-purple-600 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-100 p-4 flex-shrink-0">
          <div className="flex gap-2 mb-3">
            {(["in-progress", "resolved", "closed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-full capitalize transition-all ${status === s ? statusConfig[s].color : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                Mark as {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendReply())}
              placeholder="Type your reply..."
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={sendReply}
              disabled={!reply.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 text-white px-4 py-2.5 rounded-xl transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupportPortal() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [filter, setFilter] = useState<TicketStatus>("all");
  const [search, setSearch] = useState("");
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);

  const filtered = tickets.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search && ![t.subject, t.userName, t.description].some(v => v.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    "in-progress": tickets.filter(t => t.status === "in-progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    closed: tickets.filter(t => t.status === "closed").length,
  };

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Support Portal</h1>
        <p className="text-gray-500 text-sm">Manage and resolve user support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {(["all", "open", "in-progress", "resolved", "closed"] as TicketStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`bg-white rounded-xl border p-3 text-center transition-all ${filter === s ? "border-purple-400 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
          >
            <p className={`text-lg font-bold ${s === "open" ? "text-red-600" : s === "in-progress" ? "text-amber-600" : s === "resolved" ? "text-emerald-600" : "text-gray-900"}`}>
              {counts[s]}
            </p>
            <p className="text-gray-400 text-xs capitalize hidden sm:block">{s === "in-progress" ? "In Progress" : s}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" />
      </div>

      {/* Tickets */}
      <div className="space-y-3">
        {filtered.map((ticket) => {
          const sc = statusConfig[ticket.status];
          return (
            <div
              key={ticket.id}
              onClick={() => setActiveTicket(ticket)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-purple-100 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-gray-400 text-xs">{ticket.id}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc.color}`}>{ticket.status}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priorityConfig[ticket.priority]}`}>{ticket.priority} priority</span>
                  </div>
                  <h3 className="text-gray-900">{ticket.subject}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-1">{ticket.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <User className="w-3 h-3" />
                  <span>{ticket.userName}</span>
                  <span>·</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${ticket.userRole === "Caregiver" ? "bg-blue-50 text-blue-600" : "bg-teal-50 text-teal-600"}`}>{ticket.userRole}</span>
                  <span>·</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {ticket.messages.length} message{ticket.messages.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
            No tickets match your filter
          </div>
        )}
      </div>

      {activeTicket && (
        <TicketConversation ticket={activeTicket} onClose={() => setActiveTicket(null)} />
      )}
    </div>
  );
}
