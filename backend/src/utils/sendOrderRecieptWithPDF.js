import nodemailer from 'nodemailer';
import { generateInvoicePDF } from './pdf.js';

export const sendOrderReceiptWithPDF = async ({ to, name, orderId, items, totalAmount }) => {
  const buffer = await generateInvoicePDF(items, orderId, name, totalAmount);

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or SMTP config
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Hatma" <${process.env.MAIL_USER}>`,
    to,
    subject: `Your Hatma Order Receipt #${orderId}`,
    html: `
      <div style="font-family:sans-serif">
        <h2>Hi ${name},</h2>
        <p>Thanks for your purchase! Please find your order receipt attached.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total:</strong> NGN ${totalAmount.toLocaleString()}</p>
        <p>Need help? Contact us at support@hatma.com</p>
        <br>
        <strong>- The Hatma Team</strong>
      </div>
    `,
    attachments: [
      {
        filename: `Hatma-Receipt-${orderId}.pdf`,
        content: buffer,
        contentType: 'application/pdf',
      },
    ],
  });
};
