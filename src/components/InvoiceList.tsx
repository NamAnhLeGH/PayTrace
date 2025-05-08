import { Customer } from "../types";

type Props = {
  customer: Customer;
  invoices: string[];
  setInvoices: React.Dispatch<React.SetStateAction<string[]>>;
  issuedBy: string;
};

const InvoiceList = ({ customer, invoices, setInvoices, issuedBy }: Props) => {
  const handleDelete = async (filename: string) => {
    const base = filename.replace(/\.(docx|pdf)$/, "");
    await fetch(`/api/invoices/${base}`, { method: "DELETE" });
    setInvoices((prev: string[]) =>
      prev.filter((url: string) => !url.includes(base))
    );
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const handleSendEmail = async (filename: string) => {
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: issuedBy,
          to: customer.email_address,
          subject: "Your Donation Receipt",
          text: "Attached is your donation receipt.",
          html: "<p>Thank you for your donation!</p>",
          attachmentUrl: `http://localhost:3000/tmp/${filename}`,
        }),
      });

      if (res.ok) {
        alert("✅ Email sent successfully!");
      } else {
        const { error } = await res.json();
        alert("❌ Failed to send email: " + error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error occurred while sending email.");
    }
  };

  const handleSendText = (filename: string) => {
    console.log("Send text message for:", filename);
    // Implementation for SMS service would go here
  };

  return (
    <div className="mt-3">
      {invoices.length !== 0 && <strong>Existing Invoices:</strong>}
      <ul>
        {invoices.map((url, i) => {
          const filename = url.split("/").pop()!;
          return (
            <li
              key={i}
              className="d-flex justify-content-between align-items-center"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "1rem" }}
              >
                {filename}
              </a>
              <div>
                <button
                  className="btn btn-link text-primary"
                  onClick={() => handleDownload(url, filename)}
                >
                  <i className="bi bi-download"></i>
                </button>
                <button
                  className="btn btn-link text-danger"
                  onClick={() => handleDelete(filename)}
                >
                  <i className="bi bi-trash3"></i>
                </button>
                <button
                  className="btn btn-link text-success"
                  onClick={() => handleSendEmail(filename)}
                >
                  <i className="bi bi-envelope-at"></i>
                </button>
                <button
                  className="btn btn-link text-success"
                  onClick={() => handleSendText(filename)}
                >
                  <i className="bi bi-telephone-forward"></i>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default InvoiceList;
