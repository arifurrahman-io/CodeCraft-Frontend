import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Mail, Phone, MapPin, Globe, Edit } from "lucide-react";
import { toast } from "sonner";
import { getInvoiceById } from "@/services/invoiceService";
import Button from "@/components/common/Button";

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await getInvoiceById(id);
        const data = response?.data?.invoice || response?.invoice || response?.data || response;
        setInvoice(data);
      } catch (error) {
        toast.error("Failed to load invoice");
        navigate("/admin/invoices");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoice();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-ink-muted">Loading invoice...</p>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="min-h-screen py-8 text-slate-800 bg-canvas print:bg-white print:py-0 font-sans">
      {/* Controls - Hidden when printing */}
      <div className="print:hidden max-w-[210mm] mx-auto flex justify-between items-center mb-8 px-4 sm:px-0">
        <Button variant="ghost" onClick={() => navigate("/admin/invoices")} icon={ArrowLeft}>
          Back to Invoices
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/admin/invoices/${id}/edit`)} icon={Edit} className="border-blue-200 hover:bg-blue-50 text-blue-700">
            Edit Invoice
          </Button>
          <Button onClick={handlePrint} icon={Printer}>
            Print Invoice
          </Button>
        </div>
      </div>

      {/* A4 Invoice Document */}
      <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-2xl relative flex flex-col overflow-hidden print:shadow-none text-slate-800">

        {/* Top Geometric Backgrounds */}
        <div className="absolute top-0 right-0 w-[60%] h-[150px] pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-full h-full bg-blue-50" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%, 10% 50%)' }}></div>
          <div className="absolute top-0 right-0 w-[45%] h-full bg-blue-600" style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%, 15% 50%)' }}></div>
        </div>

        {/* Status Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 overflow-hidden z-0">
          <div className={`text-[12rem] font-black uppercase transform -rotate-45 leading-none select-none ${invoice.status === 'Paid' ? 'text-green-600' :
            invoice.status === 'Overdue' ? 'text-red-600' :
              invoice.status === 'Cancelled' ? 'text-slate-600' :
                'text-blue-600'
            }`}>
            {invoice.status}
          </div>
        </div>

        {/* Content Container */}
        <div className="px-[16mm] pt-[16mm] pb-[10mm] flex-1 flex flex-col relative z-10">

          {/* Header Row: Logo & Title */}
          <div className="flex justify-between items-center mb-12 relative z-10">
            <div className="w-1/2">
              <img src="/logo.png" alt="CodeCraft.BD" className="h-16 w-auto object-contain object-left" />
            </div>
            <div className="w-1/2 flex items-center justify-end pr-[22%]">
              <h1 className="text-4xl font-black tracking-widest text-slate-800 uppercase">Invoice</h1>
            </div>
          </div>

          {/* Invoice Info Grid */}
          <div className="flex justify-between items-end mb-10">
            {/* Invoice To */}
            <div>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-widest mb-1">Invoice To:</h2>
              <p className="text-md font-black text-slate-800 uppercase">{invoice.clientName}</p>
              <div className="text-xs text-slate-700 space-y-0.5">
                {invoice.clientEmail && <p>Email: {invoice.clientEmail}</p>}
                {invoice.clientAddress && <p>Address: {invoice.clientAddress}</p>}
              </div>
            </div>

            {/* Dates & Numbers */}
            <div className="text-right text-xs text-slate-700 space-y-1.5 pb-1">
              <div className="flex justify-end gap-6">
                <span className="uppercase tracking-wider">Invoice no:</span>
                <span className="font-bold text-slate-800 w-20">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-end gap-6">
                <span className="uppercase tracking-wider">Invoice date:</span>
                <span className="font-bold text-slate-800 w-20">{new Date(invoice.issueDate).toLocaleDateString()}</span>
              </div>
              {invoice.dueDate && (
                <div className="flex justify-end gap-6">
                  <span className="uppercase tracking-wider">Due date:</span>
                  <span className="font-bold text-slate-800 w-20">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="mb-6">
            <table className="w-full text-left border-collapse border border-slate-400">
              <thead>
                <tr className="bg-blue-600 text-white uppercase text-[11px] tracking-widest">
                  <th className="py-2.5 px-4 font-semibold w-12 text-center border border-blue-500">SL</th>
                  <th className="py-2.5 px-4 font-semibold border border-blue-500">Item Description</th>
                  <th className="py-2.5 px-4 font-semibold text-center w-24 border border-blue-500">Price</th>
                  <th className="py-2.5 px-4 font-semibold text-center w-16 border border-blue-500">Qty</th>
                  <th className="py-2.5 px-4 font-semibold text-right w-28 border border-blue-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="bg-transparent text-xs">
                    <td className="py-3 px-4 text-center text-slate-700 font-medium border border-slate-400">{index + 1}</td>
                    <td className="py-3 px-4 border border-slate-400">
                      <div className="font-bold text-slate-800">{item.description}</div>
                      <div className="text-[11px] mt-1.5 flex flex-wrap gap-2">
                        <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-medium border border-slate-300">Cycle: {item.billingCycle || "One-time"}</span>
                        {item.serviceStartDate && <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-medium border border-slate-300">Start: {new Date(item.serviceStartDate).toLocaleDateString()}</span>}
                        {item.expirationDate && <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-medium border border-slate-300">Exp: {new Date(item.expirationDate).toLocaleDateString()}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600 font-medium border border-slate-400">৳{item.rate.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center text-slate-600 font-medium border border-slate-400">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-slate-800 font-bold border border-slate-400">৳{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lower Section: Payment Info & Totals */}
          <div className="flex justify-between items-start mt-2">

            {/* Left side: Payment Info + Terms */}
            <div className="w-[50%] pr-8">
              {/* Payment Info */}
              <div className="mb-6">
                <h3 className="bg-blue-600 text-white inline-block px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest mb-3 rounded-md shadow-sm">Payment Info</h3>
                <div className="text-[11px] text-slate-600 space-y-1.5">
                  <div className="flex">
                    <span className="w-24 uppercase tracking-wider text-slate-700 font-semibold">A/C Number:</span>
                    <span className="text-slate-800 font-bold">1072074330001</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 uppercase tracking-wider text-slate-700 font-semibold">A/C Name:</span>
                    <span className="text-slate-800 font-bold">CodeCraft.BD</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 uppercase tracking-wider text-slate-700 font-semibold">Bank Details:</span>
                    <span className="text-slate-800 font-bold">BRAC Bank, Rampura Branch, Dhaka</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 uppercase tracking-wider text-slate-700 font-semibold">bKash/Nagad:</span>
                    <span className="text-slate-800 font-bold">+880 1886-886000 (Personal)</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-1 text-slate-800">Terms and Conditions</h3>
                <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line pr-4">
                  {invoice.terms || "Please clear the payment before the due date to avoid service interruption."}
                </p>
                {invoice.notes && (
                  <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line mt-2 pr-4 italic">
                    Note: {invoice.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Right side: Totals */}
            <div className="w-[45%] flex flex-col pt-1">
              <div className="text-xs font-medium mb-3">
                <div className="flex justify-between items-center px-4 py-2 border-b border-slate-400">
                  <span className="text-slate-700 uppercase tracking-wider">Subtotal:</span>
                  <span className="text-slate-800 font-bold text-sm">৳{(invoice.subtotal || 0).toFixed(2)}</span>
                </div>
                {invoice.tax > 0 && (
                  <div className="flex justify-between items-center px-4 py-2 border-b border-slate-400">
                    <span className="text-slate-700 uppercase tracking-wider">Tax:</span>
                    <span className="text-slate-800 font-bold text-sm">৳{invoice.tax.toFixed(2)}</span>
                  </div>
                )}
                {invoice.discount > 0 && (
                  <div className="flex justify-between items-center px-4 py-2 border-b border-slate-400 text-red-600">
                    <span className="uppercase tracking-wider">Discount:</span>
                    <span className="font-bold text-sm">-৳{invoice.discount.toFixed(2)}</span>
                  </div>
                )}
                {invoice.paidAmount > 0 && (
                  <div className="flex justify-between items-center px-4 py-2 border-b border-slate-400 text-green-600">
                    <span className="uppercase tracking-wider">Amount Paid:</span>
                    <span className="font-bold text-sm">-৳{invoice.paidAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Grand Total Bar */}
              <div className="bg-blue-600 text-white flex justify-between items-center px-4 py-2.5 rounded-md shadow-sm">
                <span className="text-xs font-bold uppercase tracking-widest">Balance Due:</span>
                <span className="text-sm font-bold">৳{(invoice.balanceDue || 0).toFixed(2)}</span>
              </div>

              {/* Signature */}
              <div className="mt-14 flex flex-col items-center ml-auto w-40 text-center">
                <p className="text-[12px] font-black text-slate-800 uppercase mb-1"> </p>
                <div className="w-full border-t border-slate-500 pt-1">
                  <p className="text-[10px] text-slate-700 uppercase tracking-widest">Signature</p>
                </div>
              </div>
            </div>
          </div>

          {/* Spacer to push footer to bottom */}
          <div className="flex-1"></div>

          {/* Footer Contact Info */}
          <div className="mt-auto pt-6 pb-2 border-t border-slate-400 z-10 flex justify-end flex-wrap items-center gap-x-4 gap-y-3 relative pl-[25%]">
            <div className="flex items-center gap-4 text-[11px] text-slate-700">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                  <Globe className="w-2.5 h-2.5" />
                </div>
                <span className="font-bold tracking-wide">www.codecraft.bd</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                  <Mail className="w-2.5 h-2.5" />
                </div>
                <span className="font-bold tracking-wide">hello.codecraftbd@gmail.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                  <Phone className="w-2.5 h-2.5" />
                </div>
                <span className="font-bold tracking-wide">+880 1886-886000</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
              <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <MapPin className="w-2.5 h-2.5" />
              </div>
              <span className="font-bold tracking-wide">Banasree, Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        {/* Bottom Geometric Backgrounds */}
        <div className="absolute bottom-0 left-0 w-[40%] h-[80px] pointer-events-none z-0">
          <div className="absolute bottom-0 left-0 w-full h-full bg-blue-50" style={{ clipPath: 'polygon(0 0, 70% 0, 100% 100%, 0 100%)' }}></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[80%] bg-blue-600" style={{ clipPath: 'polygon(0 0, 100% 0, 60% 100%, 0 100%)' }}></div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceView;

