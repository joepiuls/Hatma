import nodemailer from "nodemailer";


export const sendOrderReceipt = async (req, res) => {
  const { to, name, orderId, items, totalAmount } = req.body;


  if (!to || !orderId || !items || !totalAmount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail", // or Mailgun, Outlook, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const itemList = items
    .map((item) => `${item.name} x${item.quantity} - NGN ${item.price}`)
    .join("<br>");

const html = `
<div style="font-family: sans-serif; padding: 20px; color: #333;">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src='https://res.cloudinary.com/dpwbuza4q/image/upload/v1748185020/genwqykfciqp9kgo79xm.png' 
      alt="Hatma Logo" width="120" style="object-fit: contain;" />
    </div>

    <h2 style="color: #facc15;">Hi ${name},</h2>
    <p>Thanks for shopping with <strong>Hatma</strong>! Here's your receipt:</p>
    
    <div style="margin: 20px 0;">
      <table width="100%" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th align="left">Product</th>
            <th align="right">Qty</th>
            <th align="right">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td align="right">${item.quantity}</td>
              <td align="right">NGN ${item.price.toLocaleString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <p style="font-size: 18px;"><strong>Total:</strong> NGN ${totalAmount.toLocaleString()}</p>

    <p>Your order ID: <strong>${orderId}</strong></p>
    <p>We'll notify you once your order ships!</p>
    <hr />
    <p style="font-size: 12px; color: #888;">Hatma Marketplace | Do not reply to this email</p>
  </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Hatma" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your Hatma Order #${orderId} Receipt`,
      html,
    });

    res.json({ message: "Email sent" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
};
