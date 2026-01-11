import { NextResponse } from "next/server";
import {
  getAdminOrdersCount,
  clearAdminOrders,
} from "@/lib/adminNotifications";

export async function GET() {
  return NextResponse.json({
    newOrders: getAdminOrdersCount(),
  });
}

export async function DELETE() {
  clearAdminOrders();
  return NextResponse.json({ success: true });
}