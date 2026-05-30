import { prisma } from "db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      variants: { orderBy: { price: "asc" } },
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const ids = products.map((p) => p.id);
  const reviewStats = await prisma.review.groupBy({
    by: ["productId"],
    where: { productId: { in: ids } },
    _avg: { rating: true },
  });
  const avgMap = new Map(reviewStats.map((s) => [s.productId, s._avg.rating ?? 0]));

  const headers = ["Product", "Concentration", "Variants / Price", "Stock", "Reviews & Rating", "Status", "Edit", "Delete"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary" style={{ letterSpacing: "0.05em" }}>Products</h1>
          <p className="text-sm text-text-muted mt-1">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors"
        >
          <Plus size={13} /> Add Product
        </Link>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-primary">
              {headers.map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-text-muted font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary">
            {products.map((p) => {
              const minPrice = p.variants[0]?.price ?? 0;
              const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
              const avg = avgMap.get(p.id) ?? 0;
              const count = p._count.reviews;
              return (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-text-primary font-medium">{p.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{p.concentration}</td>
                  <td className="px-4 py-3">
                    <span className="text-text-secondary">{p.variants.length} sizes</span>
                    <span className="text-text-muted text-xs block">from {formatPrice(minPrice)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={totalStock <= 5 ? "text-red-400" : totalStock <= 15 ? "text-amber-400" : "text-green-400"}>
                      {totalStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {count > 0 ? (
                      <>
                        <div className="flex items-center gap-1 mb-0.5">
                          <Star size={11} className="text-gold-primary fill-gold-primary shrink-0" />
                          <span className="text-text-primary font-medium text-xs">{avg.toFixed(1)}</span>
                        </div>
                        <span className="text-[11px] text-text-muted">{count} reviews</span>
                      </>
                    ) : (
                      <span className="text-text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      {p.isFeatured && <span className="text-[9px] px-1.5 py-0.5 bg-gold-primary/10 text-gold-primary border border-border-gold uppercase tracking-wider">Featured</span>}
                      {p.isBestseller && <span className="text-[9px] px-1.5 py-0.5 bg-purple-400/10 text-purple-400 border border-purple-400/20 uppercase tracking-wider">Best</span>}
                      {!p.isActive && <span className="text-[9px] px-1.5 py-0.5 bg-red-400/10 text-red-400 border border-red-400/20 uppercase tracking-wider">Hidden</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-text-muted hover:text-gold-primary transition-colors"
                    >
                      <Pencil size={11} /> Edit
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <DeleteProductButton id={p.id} name={p.name} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
