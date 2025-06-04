import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import axios from 'axios';

// Configuration constants
const CONFIG = {
  MARGIN: 50,
  LOGO_WIDTH: 120,
  QR_WIDTH: 100,
  COLORS: {
    PRIMARY: '#000000',
    SECONDARY: '#666666',
    ERROR: '#ff0000',
    ACCENT: '#2c3e50'
  },
  FONTS: {
    TITLE: 18,
    HEADER: 16,
    BODY: 12,
    SMALL: 10
  },
  CONTACT_INFO: 'support@hatma.com | +234 800 000 0000'
};

export async function generateInvoicePDF({
  items,
  orderId,
  customerName,
  totalAmount,
  orderDate = new Date(),
  logoUrl = '',
  baseFrontendUrl = ''
}) {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ 
      margin: CONFIG.MARGIN,
      autoFirstPage: false
    });

    // Buffer collection setup
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    try {
      doc.addPage();

      // Load and draw logo
      try {
        const { data: logoData } = await axios.get(logoUrl, { responseType: 'arraybuffer' });
        const logoBuffer = Buffer.from(logoData, 'binary');
        const logoX = (doc.page.width - CONFIG.LOGO_WIDTH) / 2;
        doc.image(logoBuffer, logoX, 40, { width: CONFIG.LOGO_WIDTH });
      } catch (err) {
        doc.fontSize(CONFIG.FONTS.SMALL)
           .fillColor(CONFIG.COLORS.ERROR)
           .text('Logo failed to load', { align: 'center' });
      }

      // Header Section
      doc.moveDown(4)
         .fontSize(CONFIG.FONTS.TITLE)
         .fillColor(CONFIG.COLORS.ACCENT)
         .text('Hatma Order Receipt', { align: 'center' })
         .moveDown();

      // Order Details
      const formattedDate = new Date(orderDate).toLocaleString('en-NG', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const details = [
        `Order ID: ${orderId}`,
        `Customer: ${customerName}`,
        `Date: ${formattedDate}`
      ];

      details.forEach(text => {
        doc.fontSize(CONFIG.FONTS.BODY)
           .fillColor(CONFIG.COLORS.PRIMARY)
           .text(text);
      });

      // Items Table
      doc.moveDown()
         .fontSize(CONFIG.FONTS.HEADER)
         .fillColor(CONFIG.COLORS.ACCENT)
         .text('Items:', { underline: true })
         .moveDown(0.5);

      const startX = CONFIG.MARGIN;
      const colWidths = { item: 250, price: 100, total: 100 };

      // Table Header
      doc.font('Helvetica-Bold')
         .text('Item', startX, doc.y)
         .text('Price', startX + colWidths.item, doc.y)
         .text('Total', startX + colWidths.item + colWidths.price, doc.y)
         .moveDown(0.5);

      // Table Rows
      doc.font('Helvetica').fontSize(CONFIG.FONTS.BODY);
      items?.map((item, index) => {
        if (doc.y > doc.page.height - 100) {
          doc.addPage();
          doc.moveDown(2);
        }

        const lineY = doc.y;
        const totalLine = item.price * item.quantity;

        doc.text(`${item.name} x${item.quantity}`, startX, lineY)
           .text(`NGN ${item.price.toLocaleString()}`, startX + colWidths.item, lineY)
           .text(`NGN ${totalLine.toLocaleString()}`, startX + colWidths.item + colWidths.price, lineY)
           .moveDown();

        // Add separator
        if (index < items.length - 1) {
          doc.moveTo(startX, doc.y - 5)
             .lineTo(doc.page.width - CONFIG.MARGIN, doc.y - 5)
             .strokeColor(CONFIG.COLORS.SECONDARY)
             .lineWidth(0.5)
             .stroke();
        }
      });

      // Total Section
      doc.fontSize(CONFIG.FONTS.HEADER)
         .fillColor(CONFIG.COLORS.ACCENT)
         .text(`Total Paid: NGN ${totalAmount?.toLocaleString()}`, {
           align: 'right',
           indent: -CONFIG.MARGIN
         });

      // QR Code Section
      try {
        const qrData = `${baseFrontendUrl}/order/${orderId}`;
        const qrImage = await QRCode.toDataURL(qrData);
        doc.moveDown(2)
           .fontSize(CONFIG.FONTS.SMALL)
           .fillColor(CONFIG.COLORS.SECONDARY)
           .text('Scan to view your order online:', { align: 'center' });
        
        const qrX = (doc.page.width - CONFIG.QR_WIDTH) / 2;
        doc.image(qrImage, qrX, doc.y + 10, { width: CONFIG.QR_WIDTH });
      } catch (err) {
        doc.fontSize(CONFIG.FONTS.SMALL)
           .fillColor(CONFIG.COLORS.ERROR)
           .text('QR Code generation failed', { align: 'center' });
      }

      // Footer
      doc.moveDown(5)
         .fontSize(CONFIG.FONTS.SMALL)
         .fillColor(CONFIG.COLORS.SECONDARY)
         .text(CONFIG.CONTACT_INFO, { align: 'center' });

      // Finalize PDF
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}