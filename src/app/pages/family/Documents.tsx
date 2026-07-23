import { useState } from "react";
import { mockTransactions, mockBookings } from "../../data/mockData";
import {
  FileText, Download, Eye, X, Receipt, BarChart3, Calendar,
  CheckCircle2, CreditCard, Building2
} from "lucide-react";

type DocType = "invoice" | "receipt" | "statement";

interface Document {
  id: string;
  type: DocType;
  title: string;
  date: string;
  amount: number;
  bookingId?: string;
  period?: string;
  status: "paid" | "pending";
}

const documents: Document[] = [
  { id: "INV-2026-001", type: "invoice", title: "Invoice – Grace Kamau Visit", date: "2026-03-06", amount: 3200, bookingId: "b1", status: "paid" },
  { id: "INV-2026-002", type: "invoice", title: "Invoice – Grace Kamau Visit", date: "2026-03-04", amount: 3200, bookingId: "b2", status: "paid" },
  { id: "INV-2026-003", type: "invoice", title: "Invoice – Dr. Beatrice Wanjiru Visit", date: "2026-03-06", amount: 4000, bookingId: "b3", status: "pending" },
  { id: "RCP-2026-001", type: "receipt", title: "Payment Receipt – M-Pesa", date: "2026-03-06", amount: 3520, bookingId: "b1", status: "paid" },
  { id: "RCP-2026-002", type: "receipt", title: "Payment Receipt – M-Pesa", date: "2026-03-04", amount: 3520, bookingId: "b2", status: "paid" },
  { id: "STMT-2026-02", type: "statement", title: "Monthly Statement – February 2026", date: "2026-03-01", amount: 12800, period: "February 2026", status: "paid" },
  { id: "STMT-2026-01", type: "statement", title: "Monthly Statement – January 2026", date: "2026-02-01", amount: 9600, period: "January 2026", status: "paid" },
];

const typeConfig = {
  invoice: { icon: FileText, color: "blue", label: "Invoice", bg: "bg-blue-50", text: "text-blue-700" },
  receipt: { icon: Receipt, color: "emerald", label: "Receipt", bg: "bg-emerald-50", text: "text-emerald-700" },
  statement: { icon: BarChart3, color: "violet", label: "Statement", bg: "bg-violet-50", text: "text-violet-700" },
};

function DocumentPreview({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const handlePrint = () => {
    const printContent = document.getElementById("print-doc");
    if (!printContent) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head>
        <title>${doc.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
          .logo { font-size: 22px; font-weight: bold; color: #0d9488; }
          .badge { background: #f0fdf4; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #f9fafb; padding: 10px 12px; text-align: left; font-size: 13px; color: #6b7280; }
          td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
          .total-row td { font-weight: bold; font-size: 16px; border-top: 2px solid #e5e7eb; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
        </style>
      </head><body>${printContent.innerHTML}</body></html>
    `);
    win.document.close();
    win.print();
  };

  const booking = doc.bookingId ? mockBookings.find(b => b.id === doc.bookingId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-gray-900">{doc.title}</h3>
            <p className="text-gray-400 text-xs">{doc.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded-xl transition-all"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
          </div>
        </div>

        <div className="p-6">
          <div id="print-doc">
            {/* Document header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                  <span className="text-teal-700 font-bold text-lg">Vizazi Care</span>
                </div>
                <p className="text-gray-400 text-xs">Nairobi, Kenya</p>
                <p className="text-gray-400 text-xs">support@vizazi.care</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm mb-2 ${doc.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {doc.status === "paid" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                  {doc.status === "paid" ? "PAID" : "PENDING"}
                </div>
                <p className="text-gray-500 text-sm">{doc.type.toUpperCase()}</p>
                <p className="text-gray-900 font-bold">{doc.id}</p>
                <p className="text-gray-400 text-xs">{doc.date}</p>
              </div>
            </div>

            {/* Bill to */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-400 text-xs mb-1">BILLED TO</p>
                <p className="text-gray-900 font-medium">Amina Odhiambo</p>
                <p className="text-gray-500 text-sm">Family Member</p>
                <p className="text-gray-500 text-sm">Nairobi, Kenya</p>
              </div>
              {booking && (
                <div>
                  <p className="text-gray-400 text-xs mb-1">CARE RECIPIENT</p>
                  <p className="text-gray-900 font-medium">{booking.patientName}</p>
                  <p className="text-gray-500 text-sm">Patient ID: {booking.patientId.toUpperCase()}</p>
                </div>
              )}
            </div>

            {/* Line items */}
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 text-gray-500 text-xs font-medium rounded-l-lg">Description</th>
                  <th className="text-left p-3 text-gray-500 text-xs font-medium">Date</th>
                  <th className="text-right p-3 text-gray-500 text-xs font-medium rounded-r-lg">Amount (KES)</th>
                </tr>
              </thead>
              <tbody>
                {doc.type === "statement" ? (
                  <>
                    <tr><td className="p-3 text-gray-700">Grace Kamau – 4hr visit × 4</td><td className="p-3 text-gray-500">{doc.period}</td><td className="p-3 text-right text-gray-900">12,800</td></tr>
                    <tr><td className="p-3 text-gray-700">Platform service fee (10%)</td><td className="p-3 text-gray-500">{doc.period}</td><td className="p-3 text-right text-gray-900">1,280</td></tr>
                  </>
                ) : booking ? (
                  <>
                    <tr><td className="p-3 text-gray-700">Caregiver service – {booking.caregiverName}</td><td className="p-3 text-gray-500">{booking.date}</td><td className="p-3 text-right text-gray-900">{booking.totalAmount.toLocaleString()}</td></tr>
                    {doc.type === "receipt" && <tr><td className="p-3 text-gray-700">Platform fee (10%)</td><td className="p-3 text-gray-500">{booking.date}</td><td className="p-3 text-right text-gray-900">{Math.round(booking.totalAmount * 0.1).toLocaleString()}</td></tr>}
                  </>
                ) : null}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200">
                  <td colSpan={2} className="p-3 font-semibold text-gray-900">TOTAL</td>
                  <td className="p-3 text-right font-semibold text-gray-900">KES {doc.amount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            {doc.type === "receipt" && (
              <div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-emerald-800 font-medium text-sm">Payment Confirmed via M-Pesa</p>
                  <p className="text-emerald-600 text-xs">Transaction ref: MP{Math.random().toString().slice(2,10).toUpperCase()}</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
              <p>Vizazi Care Limited · Nairobi, Kenya · support@vizazi.care</p>
              <p>This is a computer-generated document. No signature required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Documents() {
  const [filter, setFilter] = useState<"all" | DocType>("all");
  const [preview, setPreview] = useState<Document | null>(null);

  const filtered = documents.filter((d) => filter === "all" || d.type === filter);

  const totalSpent = documents.filter(d => d.type === "receipt" && d.status === "paid").reduce((s, d) => s + d.amount, 0);

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Documents</h1>
        <p className="text-gray-500 text-sm">Invoices, receipts, and monthly statements — all downloadable as PDF</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Invoices", count: documents.filter(d => d.type === "invoice").length, icon: FileText, color: "blue" },
          { label: "Total Receipts", count: documents.filter(d => d.type === "receipt").length, icon: Receipt, color: "emerald" },
          { label: "Monthly Statements", count: documents.filter(d => d.type === "statement").length, icon: BarChart3, color: "violet" },
        ].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <div className={`w-8 h-8 bg-${color}-50 rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-4 h-4 text-${color}-600`} />
            </div>
            <p className="text-gray-900 text-xl font-semibold">{count}</p>
            <p className="text-gray-400 text-xs">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-teal-600" />
          <div>
            <p className="text-teal-800 font-medium text-sm">Total Spent (Year to Date)</p>
            <p className="text-teal-600 text-xs">All confirmed payments</p>
          </div>
        </div>
        <p className="text-teal-800 text-xl font-bold">KES {totalSpent.toLocaleString()}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(["all", "invoice", "receipt", "statement"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-4 py-2 rounded-full transition-all capitalize ${filter === f ? "bg-teal-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"}`}
          >
            {f === "all" ? "All Documents" : typeConfig[f as DocType].label + "s"}
          </button>
        ))}
      </div>

      {/* Documents list */}
      <div className="space-y-3">
        {filtered.map((doc) => {
          const tc = typeConfig[doc.type];
          return (
            <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 ${tc.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <tc.icon className={`w-5 h-5 ${tc.text}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-gray-900 text-sm font-medium">{doc.title}</p>
                    <span className={`text-xs ${doc.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} px-2 py-0.5 rounded-full`}>
                      {doc.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{doc.id}</span>
                    <span>·</span>
                    <span>{doc.date}</span>
                    {doc.period && <><span>·</span><span>{doc.period}</span></>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-gray-900 font-semibold">KES {doc.amount.toLocaleString()}</p>
                  <p className={`text-xs capitalize ${tc.text}`}>{tc.label}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreview(doc)}
                    className="p-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg transition-all"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreview(doc)}
                    className="p-2 border border-teal-200 text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {preview && <DocumentPreview doc={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
