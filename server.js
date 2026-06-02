require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── CORS ── */
app.use(cors({
  origin: [
    process.env.ALLOWED_ORIGIN,
    'http://localhost',
    'http://127.0.0.1',
  ],
  methods: ['POST', 'GET'],
}));

app.use(express.json());

/* ── Nodemailer transporter ── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/* ── Health check ── */
app.get('/', (req, res) => {
  res.json({ status: 'Ghostrider Mailer backend is running.' });
});

/* ── Send endpoint ── */
app.post('/send', async (req, res) => {
  const { sender_name, sender_initials, from_email, to_email, subject, html } = req.body;

  /* Validate required fields */
  if (!sender_name || !from_email || !to_email || !subject || !html) {
    return res.status(400).json({
      ok: false,
      error: 'Missing required fields: sender_name, from_email, to_email, subject, html',
    });
  }

  /* Basic email validation */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(from_email) || !emailRegex.test(to_email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address.' });
  }

  try {
    const info = await transporter.sendMail({
      from:     `"${sender_name}" <${process.env.GMAIL_USER}>`,
      replyTo:  from_email,
      to:       to_email,
      subject:  subject,
      html:     html,
    });

    console.log(`[GhostRider] Sent to ${to_email} | Message ID: ${info.messageId}`);
    res.json({ ok: true, messageId: info.messageId });

  } catch (err) {
    console.error('[GhostRider] Send error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* ── Bulk send endpoint ── */
app.post('/send-bulk', async (req, res) => {
  const { sender_name, sender_initials, from_email, recipients, subject, html } = req.body;

  if (!sender_name || !from_email || !recipients || !Array.isArray(recipients) || !subject || !html) {
    return res.status(400).json({ ok: false, error: 'Missing required fields.' });
  }

  const results = [];

  for (const to_email of recipients) {
    try {
      const info = await transporter.sendMail({
        from:    `"${sender_name}" <${process.env.GMAIL_USER}>`,
        replyTo: from_email,
        to:      to_email,
        subject: subject,
        html:    html,
      });
      console.log(`[GhostRider] Sent to ${to_email} | ${info.messageId}`);
      results.push({ to: to_email, ok: true, messageId: info.messageId });
    } catch (err) {
      console.error(`[GhostRider] Failed to ${to_email}:`, err.message);
      results.push({ to: to_email, ok: false, error: err.message });
    }
  }

  const allOk = results.every(r => r.ok);
  res.status(allOk ? 200 : 207).json({ ok: allOk, results });
});

app.listen(PORT, () => {
  console.log(`[GhostRider] Backend running on port ${PORT}`);
  console.log(`[GhostRider] Sending from: ${process.env.GMAIL_USER}`);
});
