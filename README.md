# 🧾 Donation Receipt Generator with Square API & Node.js

This web app allows you to manage customers, view donation orders, generate receipts in PDF or DOCX format, and send receipts via email (Gmail) or preview/download them. It integrates with the **Square API**, **Mail**, and **Bootstrap UI**.

---

## 📦 Features

- 🔐 Secure customer data management
- 🧾 Generate donation receipts with customizable date ranges and advanced settings
- 📄 Export receipts as **PDF** or **DOCX**
- 📤 Send receipts via **Gmail** (app password required)
- 📅 Search customers using name, email and phone number
- 📊 View all past invoices, download or delete them

---

## 🛠 Technologies

- **Frontend:** React + Bootstrap 5
- **Backend:** Node.js + Express
- **DOCX Generator:** `docx-templates`
- **DOCX to PDF Converter:** `docx2pdf-converter`
- **Email Service:** Nodemailer + Gmail App Password
- **Payment Platform:** Square API (sandbox mode)
- **Authentication:** Firebase

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
https://github.com/NamAnhLeGH/PayTrace.git
cd PayTrace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file at the root with the following:

```env
PORT=3000

# Square
SQUARE_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
SQUARE_LOCATION_ID=YOUR_LOCATION_ID
SQUARE_APPLICATION_ID=YOUR_SANDBOX_APP_ID

# Gmail for Nodemailer
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASS=your-16-char-app-password

NODE_ENV=development
# NODE_ENV=production
```

To get a Gmail app password: [Generate App Password](https://myaccount.google.com/apppasswords)
Note: Switch to production by uncommenting NODE_ENV=production and commenting out NODE_ENV=development for API endpoint update.


---

## 💳 Square API Notes

Ensure your Square application is in **Sandbox** mode for testing. Use the following test nonce to simulate card payment:

```bash
cnon:card-nonce-ok
```

> You can create mock orders using Square's [Orders API](https://developer.squareup.com/reference/square/orders-api).

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

## 🔐 Firebase Authentication Setup

1. Go to [**Firebase Console**](https://console.firebase.google.com/).
2. Select your project (e.g., **`paytrace-34004`**).
3. Click the ⚙️ **Settings** icon (top left of the sidebar) and choose **Project settings**.
4. Scroll down to the **"Your apps"** section.
5. If you've already registered a web app, you'll see a config snippet like this:

   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     // etc.
   };


6. Replace that snippet with the one found in:
```bash
src/firebase/firebase.ts
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

Access it at [http://localhost:5173](http://localhost:5173)

---

## 🛡 Security Notes

- Do **NOT** hardcode tokens in source code.
- Use `.env` and keep it out of version control.
- Consider deploying behind HTTPS in production.

---

## 📖 License

MIT License © 2025 Nam Anh Le
