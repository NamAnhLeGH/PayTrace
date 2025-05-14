import { useEffect, useState } from "react";
import InvoiceList from "./InvoiceList";
import { Customer, Order, Settings } from "../types";

type Props = {
  customer: Customer;
  settings: Settings;
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "000000";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day); // Treat as local date
  const formattedDay = String(date.getDate()).padStart(2, "0");
  const formattedMonth = date.toLocaleString("en-US", { month: "short" });
  const formattedYear = String(date.getFullYear()).slice(-2);
  return `${formattedDay}${formattedMonth}${formattedYear}`; // e.g. "14May25"
};

const CustomerContainer = ({ customer, settings }: Props) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<string[]>([]);

  const { startDate, endDate, issuedBy, note, selectedEmailOption, customEmail } = settings || {}; // Destructure settings properly

  useEffect(() => {
    const loadData = async () => {
      if (!customer) return;
      const ordersRes = await fetch(`/api/orders?customer_id=${customer.id}`);
      setOrders(await ordersRes.json());
      const invRes = await fetch(`/api/invoices/${customer.id}`);
      setInvoices(await invRes.json());
    };
    if (customer) loadData();
  }, [customer]);

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
    <>
      <h2>
        {customer.given_name} {customer.family_name}
      </h2>

      <p>
        <strong>Email:</strong> {customer.email_address}
      </p>
      <p>
        <strong>Phone:</strong> {customer.phone_number}
      </p>

      <InvoiceList
        customer={customer}
        invoices={invoices}
        setInvoices={setInvoices}
        issuedBy={issuedBy}
        emailOption={selectedEmailOption}
        customEmail={customEmail}
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

      <hr />
    </>
  );
};

export default CustomerContainer;
