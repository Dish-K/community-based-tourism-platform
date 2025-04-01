const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateInvoice({ bookingId, amount, businessId, touristId }, filename) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const invoicesDir = path.join(__dirname, '../invoices');

    // Create the invoices directory if it doesn't exist
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const filePath = path.join(invoicesDir, filename);
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Invoice layout
    doc.fontSize(20).text('CBT Platform – Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Booking ID: ${bookingId}`);
    doc.text(`Business ID: ${businessId}`);
    doc.text(`Tourist ID: ${touristId}`);
    doc.text(`Amount: LKR ${amount}.00`);
    doc.text(`Date: ${new Date().toLocaleString()}`);

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

module.exports = generateInvoice;
