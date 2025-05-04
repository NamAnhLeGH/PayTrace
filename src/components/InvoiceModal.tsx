import { useEffect, useState } from "react";
import Modal from "./Modal";
import InvoiceList from "./InvoiceList";
import ReceiptForm from "./ReceiptForm";
import { Customer, Order } from "../types";

type Props = {
  customer: Customer | null;
  show: boolean;
  onClose: () => void;
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "000000";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g. "May"
  const year = String(date.getFullYear()).slice(-2); // e.g. "25"
  return `${day}${month}${year}`; // e.g. "03May25"
};

const InvoiceModal = ({ customer, show, onClose }: Props) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [issuedBy, setIssuedBy] = useState("Temple Admin");
  const [note, setNote] = useState("Thank you!");
  const [invoices, setInvoices] = useState<string[]>([]);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!customer) return;
      const ordersRes = await fetch(`/api/orders?customer_id=${customer.id}`);
      setOrders(await ordersRes.json());
      const invRes = await fetch(`/api/invoices/${customer.id}`);
      setInvoices(await invRes.json());
    };
    if (show) loadData();
  }, [customer, show]);

  const generateReceipt = async () => {
    if (!customer) return null;

    // filter orders by date range
    const filteredOrders = orders.filter((order) => {
      const orderDate = order.created_at?.split("T")[0];
      if (!orderDate) return false;
      return (
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate)
      );
    });

    const items = filteredOrders.flatMap((order) =>
      (order.line_items || []).map((item) => ({
        date: order.created_at?.split("T")[0] || "N/A",
        description: item.name,
        amount: `$${(
          (parseInt(item.quantity) * item.base_price_money.amount) /
          100
        ).toFixed(2)}`,
      }))
    );

    const totalAmount = items
      .reduce((sum, i) => sum + parseFloat(i.amount.replace("$", "")), 0)
      .toFixed(2);

    const res = await fetch("/api/generate-donation-receipt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receipt_id: `R-${Date.now()}`,
        donator_id: customer.id,
        donator: `${customer.given_name} ${customer.family_name}`,
        phone_number: customer.phone_number,
        email: customer.email_address,
        total_amount: `$${totalAmount}`,
        issued_by: issuedBy,
        note,
        year: new Date().getFullYear().toString(),
        items,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      }),
    });

    const { url } = await res.json();
    setReceiptUrl(url);

    // Refresh invoice list
    const invoiceRes = await fetch(`/api/invoices/${customer.id}`);
    const invoiceFiles: string[] = await invoiceRes.json();
    setInvoices(invoiceFiles);

    return url;
  };

  const handlePreview = async () => {
    const url = await generateReceipt();
    if (url) window.open(url, "_blank");
  };

  const handleDownload = async (format: "docx" | "pdf") => {
    const url = await generateReceipt();
    if (!url || !customer) return;

    const downloadUrl = format === "docx" ? url.replace(".pdf", ".docx") : url;

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const fullName = `${customer.given_name}_${customer.family_name}`;
    const filename = `${fullName}_${dateStr}.${format}`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.click();
  };

  if (!customer) return null;

  return (
    <Modal show={show} onClose={onClose} title="Customer Invoices">
      <p>
        <strong>Name:</strong> {customer.given_name} {customer.family_name}
      </p>
      <p>
        <strong>Email:</strong> {customer.email_address}
      </p>
      <p>
        <strong>Phone:</strong> {customer.phone_number}
      </p>

      <div className="row mb-3">
        <div className="col">
          <label className="form-label">
            <strong>Start Date:</strong>
          </label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col">
          <label className="form-label">
            <strong>End Date:</strong>
          </label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <ReceiptForm
        issuedBy={issuedBy}
        note={note}
        setIssuedBy={setIssuedBy}
        setNote={setNote}
      />

      <InvoiceList
        customer={customer}
        invoices={invoices}
        setInvoices={setInvoices}
        issuedBy={issuedBy}
      />

      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-primary" onClick={handlePreview}>
          Preview
        </button>
        <button
          className="btn btn-warning"
          onClick={() => handleDownload("docx")}
        >
          <i className="bi bi-download"></i> DOCX
        </button>
        <button
          className="btn btn-warning me-2"
          onClick={() => handleDownload("pdf")}
        >
          <i className="bi bi-download"></i> PDF
        </button>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
