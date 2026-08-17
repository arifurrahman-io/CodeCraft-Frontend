import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Loader from "@/components/common/Loader";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { deleteInvoice, getInvoices } from "@/services/invoiceService";

const getInvoicesFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.invoices)) return response.data.invoices;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.invoices)) return response.invoices;
  return [];
};

const normalizeInvoice = (invoice = {}) => ({
  ...invoice,
  _id: invoice._id || invoice.id,
  invoiceNumber: invoice.invoiceNumber || "N/A",
  clientName: invoice.clientName || "Unknown Client",
  total: invoice.total || 0,
  balanceDue: invoice.balanceDue || 0,
  issueDate: invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : "N/A",
  billingCycle: invoice.items?.length > 0 
    ? (invoice.items.every(i => (i.billingCycle || "One-time") === (invoice.items[0].billingCycle || "One-time")) 
        ? (invoice.items[0].billingCycle || "One-time")
        : "Mixed")
    : "One-time",
  status: invoice.status || "Draft",
});

const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = useCallback(async () => {
    try {
      const response = await getInvoices();
      const invoicesData = getInvoicesFromResponse(response).map(normalizeInvoice);
      setInvoices(invoicesData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load invoices");
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchInvoices);
  }, [fetchInvoices]);

  const handleDelete = async (id) => {
    try {
      await deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      toast.success("Invoice deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete invoice");
      throw error;
    }
  };

  const filteredInvoices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        !query ||
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.clientName.toLowerCase().includes(query);

      const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, filterStatus]);

  const columns = [
    {
      header: "Invoice",
      accessor: "invoiceNumber",
      render: (row) => (
        <div>
          <h3 className="font-medium text-ink">{row.invoiceNumber}</h3>
          <p className="text-sm text-ink-muted">{row.clientName}</p>
        </div>
      ),
    },
    {
      header: "Issue Date",
      accessor: "issueDate",
      render: (row) => <span className="text-ink">{row.issueDate}</span>,
    },
    {
      header: "Cycle",
      accessor: "billingCycle",
      render: (row) => <span className="text-ink-muted">{row.billingCycle}</span>,
    },
    {
      header: "Total",
      accessor: "total",
      render: (row) => <span className="text-accent font-medium">৳{row.total.toFixed(2)}</span>,
    },
    {
      header: "Balance Due",
      accessor: "balanceDue",
      render: (row) => (
        <span className="text-red-600">৳{row.balanceDue.toFixed(2)}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Invoices</h1>
          <p className="text-ink-muted">Manage your invoices</p>
        </div>

        <Link to="/admin/invoices/create">
          <Button icon={Plus}>Create Invoice</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by invoice number or client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-surface border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        >
          <option value="all">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="bg-surface rounded-xl p-12 border border-border">
          <Loader text="Loading invoices..." />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredInvoices}
          basePath="/admin/invoices"
          viewPath={(row) => `/admin/invoices/${row._id}/view`}
          editPath={(row) => `/admin/invoices/${row._id}/edit`}
          onDelete={handleDelete}
          deleteTitle="Delete invoice"
          deleteMessage="Are you sure you want to delete this invoice? This action cannot be undone."
          emptyMessage="No invoices found"
        />
      )}
    </div>
  );
};

export default InvoiceListPage;
