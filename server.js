require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*', methods: ['POST', 'GET'] }));
app.use(express.json());

/* ── Transporter ── */
const transporter = nodemailer.createTransport({
  host:   'smtp.gmail.com',
  port:   465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

transporter.verify((err) => {
  if (err) console.error('[GhostRider] SMTP error:', err.message);
  else console.log('[GhostRider] SMTP connected and ready');
});

/* ── Invitation HTML ── */
function buildInvitationHtml(senderName, senderInitials) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0ede8;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0ede8;">
<tr><td align="center" style="padding:40px 16px;">
<table width="540" cellpadding="0" cellspacing="0" border="0" style="max-width:540px;">

  <!-- Sender pill -->
  <tr>
    <td align="center" style="padding:0 0 20px;">
      <table cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:40px;padding:8px 20px 8px 8px;">
        <tr><td valign="middle">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td align="center" valign="middle" style="width:38px;height:38px;border-radius:50%;background-color:#c8a032;font-family:Georgia,serif;font-size:13px;font-weight:700;font-style:italic;color:#ffffff;text-align:center;line-height:38px;">${senderInitials}</td>
            <td style="padding-left:10px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1a2535;">${senderName}</p>
              <p style="margin:2px 0 0;font-family:Arial,sans-serif;font-size:10px;color:#a09880;letter-spacing:0.5px;">sent you something special</p>
            </td>
          </tr></table>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Main card -->
  <tr>
    <td style="border-radius:10px;overflow:hidden;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:10px;overflow:hidden;">

        <!-- Dark hero -->
        <tr>
          <td align="center" style="background-color:#1a2535;padding:36px 44px 32px;">
            <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:10px;color:#c8a032;font-weight:700;letter-spacing:4px;text-transform:uppercase;">You are invited</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:700;color:#ffffff;line-height:1.4;">A moment worth celebrating together</h1>
            <table cellpadding="0" cellspacing="0" border="0" style="margin:18px auto 0;">
              <tr><td style="width:48px;height:2px;background-color:#c8a032;font-size:0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 44px 32px;">
            <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:#333333;line-height:1.85;">Hi there,</p>
            <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:#444444;line-height:1.85;">
              <strong style="color:#1a2535;">${senderName}</strong> is reaching out personally because your presence matters.
              This is not just any occasion — it is a gathering of people who mean something, and you are one of them.
            </p>
            <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:14px;color:#444444;line-height:1.85;">
              Take a moment to open your invitation and see what awaits you.
            </p>
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="border-radius:5px;background-color:#c8a032;">
                <a href="https://occasion.rf.gd/" target="_blank" style="display:inline-block;padding:15px 40px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#ffffff;letter-spacing:2px;text-transform:uppercase;text-decoration:none;border-radius:5px;">Open Invitation</a>
              </td>
              <td width="12">&nbsp;</td>
              <td style="border-radius:5px;border:1.5px solid #1a2535;">
                <a href="https://occasion.rf.gd/" target="_blank" style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#1a2535;letter-spacing:2px;text-transform:uppercase;text-decoration:none;border-radius:5px;">RSVP Now</a>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Quote -->
        <tr>
          <td style="background-color:#f9f7f3;border-top:1px solid #ece8de;border-bottom:1px solid #ece8de;padding:22px 44px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td width="3" style="background-color:#c8a032;border-radius:2px;font-size:0;">&nbsp;</td>
              <td style="padding-left:16px;">
                <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:14px;font-style:italic;color:#666666;line-height:1.8;">"I thought of you specifically for this. It would not feel the same without you there."</p>
                <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#b0a898;font-weight:600;letter-spacing:1px;text-transform:uppercase;">${senderName}</p>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Links -->
        <tr>
          <td align="center" style="padding:16px 44px 22px;background-color:#ffffff;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="padding:0 12px;"><a href="https://occasion.rf.gd/" style="font-family:Arial,sans-serif;font-size:11px;color:#7a9e8a;font-weight:700;text-decoration:none;">Invitation</a></td>
              <td style="color:#d8d4cc;">·</td>
              <td style="padding:0 12px;"><a href="https://occasion.rf.gd/" style="font-family:Arial,sans-serif;font-size:11px;color:#7a9e8a;font-weight:700;text-decoration:none;">RSVP</a></td>
              <td style="color:#d8d4cc;">·</td>
              <td style="padding:0 12px;"><a href="https://occasion.rf.gd/" style="font-family:Arial,sans-serif;font-size:11px;color:#7a9e8a;font-weight:700;text-decoration:none;">Message</a></td>
            </tr></table>
          </td>
        </tr>

      </table>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td align="center" style="padding:22px 0 0;">
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;color:#b8b0a4;line-height:1.9;">
        <strong style="color:#9a9288;">${senderName}</strong> sent you this invitation personally.<br>
        If you did not expect this, you can safely ignore it.
      </p>
      <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#c8c0b4;">
        <a href="https://occasion.rf.gd/" style="color:#a09880;text-decoration:none;">Unsubscribe</a>
        &nbsp;·&nbsp; Seattle, WA 98121
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/* ── Hello HTML ── */
function buildHelloHtml(senderName, senderInitials) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f2f2f2;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f2f2;">
<tr><td align="center" style="padding:40px 16px;">
<table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#ffffff;border-radius:8px;overflow:hidden;">

  <tr><td style="height:4px;background-color:#1a2535;font-size:0;">&nbsp;</td></tr>

  <tr>
    <td style="padding:36px 40px 28px;">
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr>
        <td align="center" valign="middle" style="width:44px;height:44px;border-radius:50%;background-color:#c8a032;font-family:Georgia,serif;font-size:14px;font-weight:700;font-style:italic;color:#ffffff;text-align:center;line-height:44px;">${senderInitials}</td>
        <td style="padding-left:12px;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#1a2535;">${senderName}</p>
          <p style="margin:2px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#aaaaaa;">is saying hello</p>
        </td>
      </tr></table>
      <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:14px;color:#555555;line-height:1.85;">Hi there,</p>
      <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:14px;color:#555555;line-height:1.85;">
        <strong style="color:#1a2535;">${senderName}</strong> wanted to reach out and say hello.
        Hope you are doing well — look out for something coming your way shortly.
      </p>
      <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;color:#555555;line-height:1.85;">Talk soon.</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#1a2535;">${senderName}</p>
    </td>
  </tr>

  <tr><td style="height:4px;background-color:#c8a032;font-size:0;">&nbsp;</td></tr>

  <tr>
    <td align="center" style="padding:14px 40px;background-color:#f9f9f9;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#aaaaaa;line-height:1.8;">
        You received this because ${senderName} wanted to get in touch.<br>
        <a href="https://occasion.rf.gd/" style="color:#888888;text-decoration:none;">Unsubscribe</a>
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/* ── Health check ── */
app.get('/', (req, res) => {
  res.json({ status: 'Ghostrider Mailer backend running. No EmailJS.' });
});

/* ── Send single ── */
app.post('/send', async (req, res) => {
  const { sender_name, sender_initials, from_email, to_email, subject, template } = req.body;

  if (!sender_name || !from_email || !to_email || !subject) {
    return res.status(400).json({ ok: false, error: 'Missing required fields.' });
  }

  const html = template === 'hello'
    ? buildHelloHtml(sender_name, sender_initials || '?')
    : buildInvitationHtml(sender_name, sender_initials || '?');

  try {
    const info = await transporter.sendMail({
      from:    `"${sender_name}" <${process.env.GMAIL_USER}>`,
      replyTo: from_email,
      to:      to_email,
      subject: subject,
      html:    html,
    });
    console.log(`[GhostRider] Sent ${template || 'invitation'} to ${to_email} | ${info.messageId}`);
    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('[GhostRider] Error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* ── Send bulk ── */
app.post('/send-bulk', async (req, res) => {
  const { sender_name, sender_initials, from_email, recipients, subject, template } = req.body;

  if (!sender_name || !from_email || !recipients || !Array.isArray(recipients) || !subject) {
    return res.status(400).json({ ok: false, error: 'Missing required fields.' });
  }

  const html = template === 'hello'
    ? buildHelloHtml(sender_name, sender_initials || '?')
    : buildInvitationHtml(sender_name, sender_initials || '?');

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
      console.error(`[GhostRider] Failed ${to_email}:`, err.message);
      results.push({ to: to_email, ok: false, error: err.message });
    }
  }

  const allOk = results.every(r => r.ok);
  res.status(allOk ? 200 : 207).json({ ok: allOk, results });
});

app.listen(PORT, () => {
  console.log(`[GhostRider] Running on port ${PORT}`);
  console.log(`[GhostRider] Sending from: ${process.env.GMAIL_USER}`);
});
