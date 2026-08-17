import api from "./api";

export const getInvoices = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  
  const response = await api.get(`/invoices?${params.toString()}`);
  return response.data;
};

export const getInvoiceById = async (id) => {
  const response = await api.get(`/invoices/${id}`);
  return response.data;
};

export const createInvoice = async (invoiceData) => {
  const response = await api.post("/invoices", invoiceData);
  return response.data;
};

export const updateInvoice = async (id, invoiceData) => {
  const response = await api.put(`/invoices/${id}`, invoiceData);
  return response.data;
};

export const deleteInvoice = async (id) => {
  const response = await api.delete(`/invoices/${id}`);
  return response.data;
};
