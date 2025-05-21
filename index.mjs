import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";
import { createReport } from "docx-templates";
import { execSync } from "child_process";
import nodemailer from "nodemailer";

dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let SQUARE_API_ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "https://connect.squareupsandbox.com"
    : "https://connect.squareup.com";

const resolvePath = (...segments) => path.join(__dirname, ...segments);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(resolvePath("public")));

app.get("/api/customers/search", async (req, res) => {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const url = `${SQUARE_API_ENDPOINT}/v2/customers/search`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Square-Version": "2025-04-16",
    "Content-Type": "application/json",
  };

  const { first, last, email, phone, searchType } = req.query;

  const applySearchType = (fieldValue) => {
    if (!fieldValue) return undefined;
    return searchType === "fuzzy"
      ? { fuzzy: fieldValue }
      : { exact: fieldValue };
  };

  const query = {
    query: {
      filter: {
        email_address: applySearchType(email),
        phone_number: applySearchType(phone),
      },
    },
  };

  let allCustomers = [];
  let cursor = null;

  try {
    do {
      if (cursor) query.query.cursor = cursor;

      const response = await axios.post(url, query, { headers });
      allCustomers = [...allCustomers, ...(response.data.customers || [])];
      cursor = response.data.cursor;
    } while (cursor);

    if (first || last) {
      allCustomers = allCustomers.filter((customer) => {
        const givenName = customer.given_name || "";
        const familyName = customer.family_name || "";

        const firstNameMatch = first
          ? searchType === "fuzzy"
            ? givenName.toLowerCase().includes(first.toLowerCase())
            : givenName.toLowerCase() === first.toLowerCase()
          : true;

        const lastNameMatch = last
          ? searchType === "fuzzy"
            ? familyName.toLowerCase().includes(last.toLowerCase())
            : familyName.toLowerCase() === last.toLowerCase()
          : true;

        return firstNameMatch && lastNameMatch;
      });
    }

    res.json(allCustomers || []);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders", async (req, res) => {
  const customerId = req.query.customer_id;
  const token = process.env.SQUARE_ACCESS_TOKEN;

  try {
    const response = await axios.post(
      `${SQUARE_API_ENDPOINT}/v2/orders/search`,
      {
        location_ids: [process.env.SQUARE_LOCATION_ID],
        query: {
          filter: { customer_filter: { customer_ids: [customerId] } },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Square-Version": "2025-04-16",
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data.orders || []);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch orders", detail: err.message });
  }
});

app.post("/api/generate-donation-receipt", async (req, res) => {
  try {
    const baseFilename = `receipt-${req.body.donator_id}-${req.body.start_date}-${req.body.end_date}`;
    const docxPath = resolvePath("public", "tmp", `${baseFilename}.docx`);
    const pdfPath = resolvePath("public", "tmp", `${baseFilename}.pdf`);

    if (fs.existsSync(pdfPath)) {
      return res.json({ url: `/tmp/${baseFilename}.pdf` });
    }

    const templatePath = resolvePath(
      "public",
      "templates",
      "Donation_Receipt_Template.docx"
    );
    const template = fs.readFileSync(templatePath);

    const report = await createReport({
      template,
      data: req.body,
      cmdDelimiter: ["__", "__"],
    });

    fs.writeFileSync(docxPath, report);

    // Absolute path for soffice command to avoid 127 errors
    console.log(process.platform)
    const soffice =
      process.platform === "win32"
        ? `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`
        : `"/Applications/LibreOffice.app/Contents/MacOS/soffice"`;

    execSync(
      `${soffice} --headless --convert-to pdf --outdir "${path.dirname(
        pdfPath
      )}" "${docxPath}"`,
      { stdio: "ignore" }
    );

    res.json({ url: `/tmp/${baseFilename}.pdf` });
  } catch (err) {
    console.error("PDF generation failed:", err);
    res
      .status(500)
      .json({ error: "Failed to generate PDF", detail: err.message });
  }
});

app.get("/api/invoices/:donatorId", (req, res) => {
  const dirPath = path.join(__dirname, "public", "tmp");
  const donatorId = req.params.donatorId;

  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).json({ error: "Failed to read directory" });

    const matchingFiles = files.filter(
      (f) => f.startsWith(`receipt-${donatorId}`) && f.endsWith(".pdf")
    );
    res.json(matchingFiles.map((f) => `/tmp/${f}`));
  });
});

app.delete("/api/invoices/:base", (req, res) => {
  const base = req.params.base.replace(/[^a-zA-Z0-9-_]/g, ""); // sanitize
  const dir = path.join(__dirname, "public", "tmp");
  const docxPath = path.join(dir, `${base}.docx`);
  const pdfPath = path.join(dir, `${base}.pdf`);

  let errors = [];

  [docxPath, pdfPath].forEach((file) => {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
      } catch (err) {
        errors.push(err.message);
      }
    }
  });

  if (errors.length > 0) {
    return res
      .status(500)
      .json({ error: "Failed to delete some files", detail: errors });
  }

  res.json({ success: true });
});

app.post("/api/send-email", async (req, res) => {
  const { from, to, subject, text, html, attachmentUrl } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const mailOptions = {
      from: `${from} <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html,
      attachments: [
        {
          filename: "receipt.pdf",
          path: attachmentUrl,
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    res.json({ success: true });
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
