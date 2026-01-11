import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await context.params; // ✅ FIX

  // ⚠ TEMP storage bridge (until DB)
  const orders = JSON.parse(
    (global as any).orders_db || "[]"
  );

  const order = orders.find((o: any) => o.id === orderId);

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const buffers: Buffer[] = [];

  doc.on("data", buffers.push.bind(buffers));

  /* 🟣 PI LOGO */
  const logoPath = path.join(
    process.cwd(),
    "public/images/pi-logo.png"
  );

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 60 });
  }

  /* ✅ PAID STAMP */
  if (order.paymentStatus === "Paid") {
    doc
      .fontSize(16)
      .fillColor("green")
      .text("✔ PAID", 0, 50, { align: "right" });
  }

  doc.moveDown(4);

  /* TITLE */
  doc
    .fontSize(20)
    .fillColor("black")
    .text("Invoice", { align: "center" });

  doc.moveDown(2);

  /* DETAILS */
  doc.fontSize(12);
  doc.text(`Order ID: ${order.id}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Customer: ${order.customerName}`);
  doc.text(`Email: ${order.customerEmail}`);
  doc.text(`Payment Method: ${order.paymentMethod}`);
  doc.text(`Payment Reference: ${order.paymentRef || "N/A"}`);

  doc.moveDown(2);

  /* ITEMS */
  doc.fontSize(14).text("Items");
  doc.moveDown(0.5);

  order.items.forEach((item: any) => {
    doc
      .fontSize(12)
      .text(
        `${item.name} × ${item.quantity} — ₦${item.price * item.quantity}`
      );
  });

  doc.moveDown(2);

  /* TOTAL */
  doc
    .fontSize(14)
    .text(`Total: ₦${order.total}`, { align: "right" });

  doc.moveDown(3);

  /* FOOTER */
  doc
    .fontSize(10)
    .fillColor("gray")
    .text(
      "This invoice was generated automatically.\nThank you for your business.",
      { align: "center" }
    );

  doc.end();

  const pdfBuffer = Buffer.concat(buffers);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${order.id}.pdf`,
    },
  });
}