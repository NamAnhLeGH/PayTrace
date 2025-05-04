# 🧾 Donation Receipt Generator with Square API & Node.js

This web app allows you to manage customers, view donation orders, generate receipts in PDF or DOCX format, and send receipts via email (Gmail) or preview/download them. It integrates with the **Square API**, **Mail**, and **Bootstrap UI**.

---

## 📦 Features

- 🔐 Secure customer data management
- 🧾 Generate donation receipts with customizable date ranges and notes
- 📄 Export receipts as **PDF** or **DOCX**
- 📤 Send receipts via **Gmail** (app password required)
- 📅 Filter customers using Bootstrap modal
- 📊 View all past invoices, download or delete them

---

## 🛠 Technologies

- **Frontend:** React + Bootstrap 5
- **Backend:** Node.js + Express
- **PDF/DOCX Generator:** `pdf-lib` + `docx-templates`
- **Email Service:** Nodemailer + Gmail App Password
- **Payment Platform:** Square API (sandbox mode)

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourname/square-donation-receipts.git
cd square-donation-receipts
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file at the root with the following:

```env
PORT=3000

# Square
SQUARE_ACCESS_TOKEN=YOUR_SANDBOX_ACCESS_TOKEN
SQUARE_LOCATION_ID=YOUR_LOCATION_ID
SQUARE_APPLICATION_ID=YOUR_SANDBOX_APP_ID

# Gmail for Nodemailer
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASS=your-16-char-app-password
```

To get a Gmail app password: [Generate App Password](https://myaccount.google.com/apppasswords)

---

## 💳 Square API Notes

Ensure your Square application is in **Sandbox** mode for testing. Use the following test nonce to simulate card payment:

```bash
cnon:card-nonce-ok
```

> You can create mock orders using Square's [Orders API](https://developer.squareup.com/reference/square/orders-api).

---

## 📂 Folder Structure

```
.
├── public/
├── server/
│   ├── routes/
│   ├── templates/
│   └── index.js
├── src/
│   ├── components/
│   │   ├── Modal.tsx
│   │   ├── InvoiceModal.tsx
│   │   ├── InvoiceList.tsx
│   │   ├── FilterModal.tsx
│   │   └── CustomerTable.tsx
│   ├── types.ts
│   └── App.tsx
└── .env
```

---

## 📫 Sending Emails

Receipts can be emailed to customers using Gmail's SMTP:

```ts
POST /api/send-email

{
  "from": "Temple Admin",
  "to": "john@example.com",
  "subject": "Your Donation Receipt",
  "text": "Attached is your receipt.",
  "html": "<p>Thank you!</p>",
  "attachmentUrl": "http://localhost:3000/tmp/receipt.pdf"
}
```

---

## 📄 Example Receipt Format

Receipts are named like:

```
receipt-<customer_id>-<start>-<end>.pdf
e.g. receipt-88QWVK8VB82NASVE6QBWMXPJNR-03May25-12May25.pdf
```

---

## 🧪 Run the App

```bash
npm run dev
```

Access it at [http://localhost:3000](http://localhost:3000)

---

## 🛡 Security Notes

- Do **NOT** hardcode tokens in source code.
- Use `.env` and keep it out of version control.
- Consider deploying behind HTTPS in production.

---

## 🧠 Future Enhancements

- Add Twilio or WhatsApp API for sending receipts via SMS or chat
- Stripe support (alternative to Square)
- Admin login with role-based access
- Export receipts in bulk (zip)

---

## 📖 License

MIT License © 2025 Your Name
