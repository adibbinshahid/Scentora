import ProductCard, { type ProductCardData } from "@/components/home/ProductCard";

interface Props {
  products: ProductCardData[];
}

export default function RelatedProducts({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 border-t border-border-primary bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <span className="block text-[10px] tracking-[0.4em] uppercase text-gold-primary mb-2">
            You May Also Like
          </span>
          <h2
            className="font-display font-light text-3xl sm:text-4xl text-text-primary"
            style={{ letterSpacing: "0.06em" }}
          >
            Related Fragrances
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
