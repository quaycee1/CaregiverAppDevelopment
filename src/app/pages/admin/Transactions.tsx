import { useState } from "react";
import { mockTransactions, Transaction } from "../../data/mockData";
import { CreditCard, CheckCircle2, Clock, AlertCircle, TrendingUp, Download, Send } from "lucide-react";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [payingOut, setPayingOut] = useState<string | null>(null);

  const totalRevenue = transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const totalPlatformFees = transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.platformFee, 0);
  const pendingPayouts = transactions.filter(t => t.status === "pending").reduce((s, t) => s + t.caregiverPayout, 0);

  const processPayout = async (id: string) => {
    setPayingOut(id);
    await new Promise(r => setTimeout(r, 1500));
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "completed" as const } : t));
    setPayingOut(null);
  };

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Transactions & Payouts</h1>
        <p className="text-gray-500 text-sm">Manage all financial transactions and caregiver payouts</p>
      </div>

      {/* Financial summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Revenue", value: `KES ${totalRevenue.toLocaleString()}`, sub: "Gross (all time)", icon: CreditCard, color: "teal" },
          { label: "Platform Fees", value: `KES ${totalPlatformFees.toLocaleString()}`, sub: "10% of revenue", icon: TrendingUp, color: "violet" },
          { label: "Pending Payouts", value: `KES ${pendingPayouts.toLocaleString()}`, sub: `${transactions.filter(t => t.status === "pending").length} caregivers pending`, icon: Clock, color: "amber" },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 bg-${color}-50 rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <p className="text-gray-900 text-2xl font-bold">{value}</p>
            <p className="text-gray-600 text-sm">{label}</p>
            <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Pending payout alert */}
      {pendingPayouts > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <p className="text-amber-800 text-sm font-medium">KES {pendingPayouts.toLocaleString()} in caregiver payouts pending processing</p>
          </div>
          <button
            onClick={() => {
              transactions.filter(t => t.status === "pending").forEach(t => processPayout(t.id));
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Process All
          </button>
        </div>
      )}

      {/* Transactions list */}
      <div className="space-y-3">
        {transactions.map((txn) => (
          <div key={txn.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-gray-500 text-xs mb-0.5">{txn.id}</p>
                <p className="text-gray-900 font-medium">{txn.familyMemberName}</p>
                <p className="text-gray-500 text-sm">→ Booking {txn.bookingId.toUpperCase()}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                txn.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                txn.status === "pending" ? "bg-amber-100 text-amber-700" :
                "bg-red-100 text-red-700"
              }`}>
                {txn.status === "completed" ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : <Clock className="w-3 h-3 inline mr-1" />}
                {txn.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-gray-400 text-xs">Total Paid</p>
                <p className="text-gray-900 font-semibold">KES {txn.amount.toLocaleString()}</p>
              </div>
              <div className="bg-violet-50 rounded-xl p-3 text-center">
                <p className="text-violet-500 text-xs">Platform Fee</p>
                <p className="text-violet-800 font-semibold">KES {txn.platformFee.toLocaleString()}</p>
              </div>
              <div className="bg-teal-50 rounded-xl p-3 text-center">
                <p className="text-teal-500 text-xs">Caregiver Payout</p>
                <p className="text-teal-800 font-semibold">KES {txn.caregiverPayout.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-gray-400 text-xs">Method</p>
                <p className="text-gray-900 font-semibold text-sm">{txn.paymentMethod}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{txn.date} · Caregiver: {txn.caregiverName}</span>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-all text-xs">
                  <Download className="w-3.5 h-3.5" /> Receipt
                </button>
                {txn.status === "pending" && (
                  <button
                    onClick={() => processPayout(txn.id)}
                    disabled={payingOut === txn.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all text-xs disabled:opacity-60"
                  >
                    {payingOut === txn.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    {payingOut === txn.id ? "Processing…" : "Pay Out"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
