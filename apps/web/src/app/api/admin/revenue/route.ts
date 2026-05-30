import { NextResponse } from "next/server";
import { requireAdmin, requireAdminRead } from "@/lib/admin";
import { prisma } from "db";

export async function GET() {
  const { error } = await requireAdminRead();
  if (error) return error;

  const [orders, products, users] = await Promise.all([
    prisma.order.findMany({
      select: { status: true, total: true, subtotal: true, discountAmount: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  const paid = orders.filter((o) => !["CANCELLED", "REFUNDED", "PENDING"].includes(o.status));
  const totalRevenue = paid.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = paid.length > 0 ? totalRevenue / paid.length : 0;

  // Revenue by month (last 6)
  const now = new Date();
  const months: { label: string; revenue: number; orders: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const monthOrders = paid.filter((o) => {
      const od = new Date(o.createdAt);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    });
    months.push({
      label,
      revenue: monthOrders.reduce((s, o) => s + o.total, 0),
      orders: monthOrders.length,
    });
  }

  // Status breakdown
  const statusCount: Record<string, number> = {};
  for (const o of orders) {
    statusCount[o.status] = (statusCount[o.status] ?? 0) + 1;
  }

  // Top products by revenue
  const orderItems = await prisma.orderItem.findMany({
    include: { order: { select: { status: true } } },
  });
  const productRevMap: Record<string, { name: string; revenue: number; qty: number }> = {};
  for (const item of orderItems) {
    if (["CANCELLED", "REFUNDED", "PENDING"].includes(item.order?.status ?? "")) continue;
    const key = item.productName;
    if (!productRevMap[key]) productRevMap[key] = { name: key, revenue: 0, qty: 0 };
    productRevMap[key].revenue += item.price * item.quantity;
    productRevMap[key].qty += item.quantity;
  }
  const topProducts = Object.values(productRevMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    avgOrderValue,
    totalProducts: products,
    totalCustomers: users,
    months,
    statusCount,
    topProducts,
  });
}
