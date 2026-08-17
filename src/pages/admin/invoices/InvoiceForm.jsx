import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Loader from "@/components/common/Loader";
import TextArea from "@/components/common/TextArea";
import {
  createInvoice,
  getInvoiceById,
  updateInvoice,
} from "@/services/invoiceService";

const initialItem = {
  description: "",
  rate: 0,
  quantity: 1,
  amount: 0,
  billingCycle: "One-time",
  serviceStartDate: "",
  expirationDate: "",
};

const initialFormData = {
  invoiceNumber: "",
  clientName: "",
  clientEmail: "",
  clientAddress: "",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  items: [{ ...initialItem }],
  tax: 0,
  discount: 0,
  paidAmount: 0,
  notes: "Please pay within the due date.",
  terms: "1. Late payments may result in service suspension until outstanding dues are cleared.\n2. Domain registration, renewal, hosting fees, and third-party service charges are non-refundable once processed.\n3. Additional work beyond the approved scope will be billed separately.\n4. Ownership of project deliverables will be transferred upon full payment of all invoices.\n5. The company shall not be liable for losses arising from third-party service outages, domain expiration, cyberattacks, or force majeure events.",
  status: "Draft",
};

const getInvoiceFromResponse = (response) =>
  response?.data?.invoice || response?.invoice || response?.data || response;

const InvoiceFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    let isMounted = true;

    const fetchInvoice = async () => {
      if (!isEditing) return;

      try {
        setIsLoading(true);
        const response = await getInvoiceById(id);
        const invoice = getInvoiceFromResponse(response);

        if (isMounted && invoice) {
          setFormData({
            ...invoice,
            issueDate: invoice.issueDate ? new Date(invoice.issueDate).toISOString().split("T")[0] : "",
            dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split("T")[0] : "",
            items: invoice.items ? invoice.items.map(item => ({
              ...item,
              serviceStartDate: item.serviceStartDate ? new Date(item.serviceStartDate).toISOString().split("T")[0] : "",
              expirationDate: item.expirationDate ? new Date(item.expirationDate).toISOString().split("T")[0] : "",
            })) : [{ ...initialItem }]
          });
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load invoice details");
        navigate("/admin/invoices");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInvoice();

    return () => {
      isMounted = false;
    };
  }, [id, isEditing, navigate]);

  // Recalculate amounts whenever items change
  const calculateTotals = (items, tax, discount, paidAmount) => {
    const calculatedItems = items.map(item => ({
      ...item,
      amount: Number(item.rate) * Number(item.quantity)
    }));
    
    const subtotal = calculatedItems.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal + Number(tax) - Number(discount);
    const balanceDue = total - Number(paidAmount);
    
    return { calculatedItems, subtotal, total, balanceDue };
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => {
      const nextData = {
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      };

      if (["tax", "discount", "paidAmount"].includes(name)) {
        const { subtotal, total, balanceDue } = calculateTotals(
          nextData.items,
          nextData.tax,
          nextData.discount,
          nextData.paidAmount
        );
        nextData.subtotal = subtotal;
        nextData.total = total;
        nextData.balanceDue = balanceDue;
      }

      return nextData;
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => {
      const newItems = [...prev.items];
      const nextItem = {
        ...newItems[index],
        [name]: type === "number" ? Number(value) : value,
      };

      if (["billingCycle", "serviceStartDate"].includes(name)) {
        if (nextItem.serviceStartDate) {
          const startDate = new Date(nextItem.serviceStartDate);
          if (nextItem.billingCycle === "Monthly") {
            startDate.setMonth(startDate.getMonth() + 1);
            nextItem.expirationDate = startDate.toISOString().split("T")[0];
          } else if (nextItem.billingCycle === "Yearly") {
            startDate.setFullYear(startDate.getFullYear() + 1);
            nextItem.expirationDate = startDate.toISOString().split("T")[0];
          }
        }
      }

      newItems[index] = nextItem;

      const { calculatedItems, subtotal, total, balanceDue } = calculateTotals(
        newItems,
        prev.tax,
        prev.discount,
        prev.paidAmount
      );

      return {
        ...prev,
        items: calculatedItems,
        subtotal,
        total,
        balanceDue
      };
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...initialItem }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => {
      const newItems = prev.items.filter((_, i) => i !== index);
      
      const { subtotal, total, balanceDue } = calculateTotals(
        newItems,
        prev.tax,
        prev.discount,
        prev.paidAmount
      );

      return {
        ...prev,
        items: newItems,
        subtotal,
        total,
        balanceDue
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clientName || formData.items.length === 0) {
      toast.error("Please fill required fields and add at least one item");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateInvoice(id, formData);
        toast.success("Invoice updated successfully");
      } else {
        await createInvoice(formData);
        toast.success("Invoice created successfully");
      }
      navigate("/admin/invoices");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-surface rounded-xl p-12 border border-border">
          <Loader text="Loading invoice..." />
        </div>
      </div>
    );
  }

  // Derive display values for auto-calculated fields
  const displaySubtotal = formData.items.reduce((sum, item) => sum + (Number(item.rate) * Number(item.quantity)), 0);
  const displayTotal = displaySubtotal + Number(formData.tax || 0) - Number(formData.discount || 0);
  const displayBalanceDue = displayTotal - Number(formData.paidAmount || 0);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin/invoices")}
          className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-ink">
            {isEditing ? "Edit Invoice" : "Create Invoice"}
          </h1>
          <p className="text-ink-muted">
            {isEditing ? "Update invoice information" : "Generate a new invoice"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
          <h2 className="text-lg font-semibold text-ink">Details</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Invoice Number"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              placeholder="Leave blank to auto-generate"
              disabled={isEditing}
            />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <Input
              label="Issue Date"
              name="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={handleChange}
              required
            />

            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
          <h2 className="text-lg font-semibold text-ink">Client Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

            <Input
              label="Client Email"
              name="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <TextArea
            label="Client Address"
            name="clientAddress"
            value={formData.clientAddress}
            onChange={handleChange}
            placeholder="123 Street Name, City"
            rows={2}
          />
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Services / Items</h2>
            <Button type="button" variant="secondary" onClick={addItem} icon={Plus} size="sm">
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="flex flex-col gap-4 p-4 bg-canvas rounded-lg border border-border">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                  <div className="flex-1 w-full">
                    <Input
                      label="Description"
                      name="description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="Web Development"
                      required
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <Input
                      label="Rate"
                      name="rate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </div>
                  <div className="w-full md:w-24">
                    <Input
                      label="Quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <Input
                      label="Amount"
                      value={(Number(item.rate) * Number(item.quantity)).toFixed(2)}
                      disabled
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 mb-1 text-ink-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                {/* Item-level billing fields */}
                <div className="grid md:grid-cols-3 gap-4 pt-2 border-t border-border mt-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-ink">Billing Cycle</label>
                    <select
                      name="billingCycle"
                      value={item.billingCycle || "One-time"}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    >
                      <option value="One-time">One-time</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>

                  <Input
                    label="Service Start Date"
                    name="serviceStartDate"
                    type="date"
                    value={item.serviceStartDate || ""}
                    onChange={(e) => handleItemChange(index, e)}
                  />

                  <Input
                    label="Expiration Date"
                    name="expirationDate"
                    type="date"
                    value={item.expirationDate || ""}
                    onChange={(e) => handleItemChange(index, e)}
                    disabled={item.billingCycle !== "One-time"}
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
          <h2 className="text-lg font-semibold text-ink">Totals</h2>

          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1 space-y-4">
              <TextArea
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes for the client..."
                rows={3}
              />
              <TextArea
                label="Terms & Conditions"
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="w-full md:w-72 space-y-4 bg-canvas p-4 rounded-lg border border-border">
              <div className="flex justify-between text-ink">
                <span>Subtotal:</span>
                <span className="font-medium">৳{displaySubtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center text-ink">
                <span>Tax:</span>
                <div className="w-24">
                  <Input
                    name="tax"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tax}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-ink">
                <span>Discount:</span>
                <div className="w-24">
                  <Input
                    name="discount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="h-px bg-border my-2"></div>

              <div className="flex justify-between text-lg font-bold text-ink">
                <span>Total:</span>
                <span>৳{displayTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-ink pt-2">
                <span>Paid Amount:</span>
                <div className="w-24">
                  <Input
                    name="paidAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.paidAmount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="h-px bg-border my-2"></div>

              <div className="flex justify-between text-lg font-bold text-accent">
                <span>Balance Due:</span>
                <span>৳{displayBalanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/admin/invoices")}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Update Invoice" : "Save Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceFormPage;
