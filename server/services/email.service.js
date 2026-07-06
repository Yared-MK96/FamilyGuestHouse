import transporter from "../config/mail.js";

// ─────────────────────────────────────────────
// ✅ Booking Confirmation
// ─────────────────────────────────────────────
export const sendBookingConfirmation = async (booking) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: booking.email,
    subject: "✅ Booking Confirmed – Family Guest House",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:#1a3c5e;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Family Guest House</h1>
          <p style="color:#a8c4e0;margin:4px 0 0;">Booking Confirmed</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:16px;">Hello <strong>${booking.name}</strong>,</p>
          <p>Thank you for choosing <strong>Family Guest House</strong>. Your booking is confirmed!</p>

          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <tr style="background:#f5f7fa;">
              <td style="padding:10px 14px;font-weight:bold;width:40%;">Room</td>
              <td style="padding:10px 14px;">${booking.room}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;font-weight:bold;">Check-In</td>
              <td style="padding:10px 14px;">${booking.checkIn}</td>
            </tr>
            <tr style="background:#f5f7fa;">
              <td style="padding:10px 14px;font-weight:bold;">Check-Out</td>
              <td style="padding:10px 14px;">${booking.checkOut}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;font-weight:bold;">Guests</td>
              <td style="padding:10px 14px;">${booking.guests}</td>
            </tr>
            <tr style="background:#f5f7fa;">
              <td style="padding:10px 14px;font-weight:bold;">Total</td>
              <td style="padding:10px 14px;font-size:18px;color:#1a3c5e;"><strong>${booking.total} ETB</strong></td>
            </tr>
          </table>

          <p>We look forward to welcoming you!</p>
          <p style="color:#888;font-size:13px;margin-top:32px;">Family Guest House &nbsp;|&nbsp; +251 900 000 000</p>
        </div>
      </div>
    `,
  });
};

// ─────────────────────────────────────────────
// ✅ Payment Receipt
// ─────────────────────────────────────────────
export const sendPaymentReceipt = async (payment) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: payment.email,
    subject: "💳 Payment Receipt – Family Guest House",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:#1a3c5e;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Family Guest House</h1>
          <p style="color:#a8c4e0;margin:4px 0 0;">Payment Receipt</p>
        </div>
        <div style="padding:32px;">
          <p>Hello <strong>${payment.name}</strong>,</p>
          <p>We have received your payment. Here are the details:</p>

          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <tr style="background:#f5f7fa;">
              <td style="padding:10px 14px;font-weight:bold;">Transaction Ref</td>
              <td style="padding:10px 14px;">${payment.txRef}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;font-weight:bold;">Amount Paid</td>
              <td style="padding:10px 14px;font-size:18px;color:#1a3c5e;"><strong>${payment.amount} ETB</strong></td>
            </tr>
            <tr style="background:#f5f7fa;">
              <td style="padding:10px 14px;font-weight:bold;">Payment Date</td>
              <td style="padding:10px 14px;">${payment.date}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;font-weight:bold;">Status</td>
              <td style="padding:10px 14px;color:green;font-weight:bold;">Successful ✅</td>
            </tr>
          </table>

          <p style="color:#888;font-size:13px;margin-top:32px;">Family Guest House &nbsp;|&nbsp; +251 900 000 000</p>
        </div>
      </div>
    `,
  });
};

// ─────────────────────────────────────────────
// ✅ Booking Cancellation
// ─────────────────────────────────────────────
export const sendBookingCancellation = async (booking) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: booking.email,
    subject: "❌ Booking Cancelled – Family Guest House",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:#c0392b;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Family Guest House</h1>
          <p style="color:#f5b7b1;margin:4px 0 0;">Booking Cancelled</p>
        </div>
        <div style="padding:32px;">
          <p>Hello <strong>${booking.name}</strong>,</p>
          <p>Your booking has been <strong>cancelled</strong>. We're sorry to see you go.</p>

          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <tr style="background:#f5f7fa;">
              <td style="padding:10px 14px;font-weight:bold;">Room</td>
              <td style="padding:10px 14px;">${booking.room}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;font-weight:bold;">Check-In</td>
              <td style="padding:10px 14px;">${booking.checkIn}</td>
            </tr>
            <tr style="background:#f5f7fa;">
              <td style="padding:10px 14px;font-weight:bold;">Check-Out</td>
              <td style="padding:10px 14px;">${booking.checkOut}</td>
            </tr>
          </table>

          <p>If this was a mistake, please contact us or rebook on our website.</p>
          <p style="color:#888;font-size:13px;margin-top:32px;">Family Guest House &nbsp;|&nbsp; +251 900 000 000</p>
        </div>
      </div>
    `,
  });
};

// ─────────────────────────────────────────────
// ✅ Password Reset
// ─────────────────────────────────────────────
export const sendPasswordReset = async ({ email, name, resetUrl }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "🔑 Password Reset – Family Guest House",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:#1a3c5e;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Family Guest House</h1>
          <p style="color:#a8c4e0;margin:4px 0 0;">Password Reset Request</p>
        </div>
        <div style="padding:32px;">
          <p>Hello <strong>${name}</strong>,</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>

          <div style="text-align:center;margin:32px 0;">
            <a href="${resetUrl}"
               style="background:#1a3c5e;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-size:16px;font-weight:bold;">
              Reset Password
            </a>
          </div>

          <p style="color:#888;font-size:13px;">This link expires in <strong>1 hour</strong>. If you didn't request this, please ignore this email.</p>
          <p style="color:#888;font-size:13px;margin-top:32px;">Family Guest House &nbsp;|&nbsp; +251 900 000 000</p>
        </div>
      </div>
    `,
  });
};

// ─────────────────────────────────────────────
// ✅ Contact Form Notification (sent to hotel admin)
// ─────────────────────────────────────────────
export const sendContactNotification = async ({ name, email, phone, message }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER, // notify the hotel admin
    subject: `📬 New Contact Message from ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:#1a3c5e;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Family Guest House</h1>
          <p style="color:#a8c4e0;margin:4px 0 0;">New Contact Form Submission</p>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr style="background:#f5f7fa;">
              <td style="padding:10px 14px;font-weight:bold;width:30%;">Name</td>
              <td style="padding:10px 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;font-weight:bold;">Email</td>
              <td style="padding:10px 14px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr style="background:#f5f7fa;">
              <td style="padding:10px 14px;font-weight:bold;">Phone</td>
              <td style="padding:10px 14px;">${phone || "—"}</td>
            </tr>
          </table>

          <p style="font-weight:bold;">Message:</p>
          <div style="background:#f5f7fa;padding:16px;border-radius:6px;line-height:1.7;">
            ${message}
          </div>

          <p style="color:#888;font-size:13px;margin-top:32px;">Reply directly to <a href="mailto:${email}">${email}</a></p>
        </div>
      </div>
    `,
  });
};
