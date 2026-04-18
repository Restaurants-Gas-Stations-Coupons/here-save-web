import { jsPDF } from 'jspdf';

/**
 * Build a PDF receipt and trigger download in the browser.
 * @param {Record<string, unknown>} tx Normalized redemption row from the dashboard mapper.
 */
export function downloadRedemptionBillPdf(tx) {
    if (!tx || tx.id == null) return;

    const inr = (n) => {
        const v = Number(n);
        if (!Number.isFinite(v)) return '₹0.00';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        }).format(v);
    };

    const billLabel = tx.billNumber ? String(tx.billNumber) : `Redemption #${tx.id}`;
    const outletName = String(tx.outletName || 'Outlet');
    const outletAddr = String(tx.outletAddress || '—');
    const couponTitle = String(tx.couponTitle || tx.couponId || 'Coupon');
    const fuel = String(tx.fuelType || '—');
    const dateStr = String(tx.date || '—');
    const timeStr = String(tx.time || '—');

    const billAmt = inr(tx.billAmount);
    const discAmt = inr(tx.discountAmount);
    const netAmt = inr(
        tx.finalAmount != null
            ? tx.finalAmount
            : Number(tx.billAmount || 0) - Number(tx.discountAmount || 0),
    );
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 56;
    const lh = 20;
    const left = 48;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(outletName, left, y);
    y += lh;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(outletAddr, left, y);
    y += lh;
    doc.text(`Bill / ref: ${billLabel}`, left, y);
    y += 16;
    doc.text(`Date: ${dateStr}   Time: ${timeStr}`, left, y);
    y += 28;

    const section = (title) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(title, left, y);
      y += 14;
      doc.setDrawColor(200);
      doc.line(left, y, 550, y);
      y += 16;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
    };

    const row = (label, value) => {
      doc.text(label, left, y);
      doc.text(String(value), 550, y, { align: 'right' });
      y += 18;
    };

    section('Bill details');
    row('Fuel / service', fuel);
    row('Bill amount', billAmt);
    y += 8;

    section('Coupon');
    row('Title', couponTitle);
    row('Discount', `- ${discAmt}`);
    y += 8;

    section('Summary');
    row('Bill amount', billAmt);
    row('Discount', `- ${discAmt}`);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    row('Net payable', netAmt);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Here & Save - digital receipt', left, 790);
    doc.save(`here-save-bill-${tx.id}.pdf`);
}
