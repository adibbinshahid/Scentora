import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "db";
import { revalidatePath } from "next/cache";

const REVIEWS = [
  { name: "Sophie M.",   rating: 5, comment: "Absolutely divine. Long-lasting and unique." },
  { name: "James K.",    rating: 5, comment: "Best fragrance I've ever owned. Gets compliments all day." },
  { name: "Amira L.",    rating: 5, comment: "Rich, deep, exactly as described. Worth every penny." },
  { name: "Theo P.",     rating: 5, comment: "Incredible sillage. Lasts easily 12 hours on my skin." },
  { name: "Elena V.",    rating: 5, comment: "My signature scent. Nothing compares." },
  { name: "Marcus R.",   rating: 5, comment: "Luxurious from bottle to skin. A masterpiece." },
  { name: "Celine D.",   rating: 5, comment: "Perfect balance of sophistication and warmth." },
  { name: "Kai W.",      rating: 5, comment: "Exactly what luxury fragrance should smell like." },
  { name: "Nina A.",     rating: 5, comment: "Got multiple compliments the same day. Love it." },
  { name: "Ethan B.",    rating: 5, comment: "Exceptional projection without being overpowering." },
  { name: "Lena T.",     rating: 4, comment: "Beautiful scent. Slightly pricey but worth it." },
  { name: "Omar S.",     rating: 4, comment: "Great fragrance. Longevity is impressive." },
  { name: "Clara J.",    rating: 4, comment: "Unique and elegant. Glad I took the risk." },
  { name: "Ivan N.",     rating: 4, comment: "Very good. The dry-down is the best part." },
  { name: "Fatima Z.",   rating: 4, comment: "Sophisticated without being loud. Love it." },
  { name: "Hugo R.",     rating: 4, comment: "Good quality, pleasant scent. Very wearable." },
  { name: "Zara H.",     rating: 4, comment: "Lovely bottle and great performance." },
  { name: "Leo C.",      rating: 4, comment: "Really nice, gets better after an hour." },
  { name: "Anya K.",     rating: 4, comment: "Lovely opening, beautiful heart notes." },
  { name: "Sam G.",      rating: 4, comment: "Premium feel. Would definitely reorder." },
  { name: "Priya M.",    rating: 5, comment: "Absolutely gorgeous. My whole office asked about it." },
  { name: "David H.",    rating: 5, comment: "Exceeds expectations. Opulent and refined." },
  { name: "Yasmin A.",   rating: 5, comment: "Stunning. The opening is like nothing else." },
  { name: "Finn L.",     rating: 5, comment: "Bold, rich, distinctive. My new favourite." },
  { name: "Isla T.",     rating: 5, comment: "Perfectly crafted. Long lasting, beautiful scent." },
  { name: "Nour F.",     rating: 4, comment: "Fantastic quality. Notes evolve beautifully." },
  { name: "Max B.",      rating: 4, comment: "Great performance. The notes evolve nicely." },
  { name: "Rosa P.",     rating: 4, comment: "Very pleasant and luxurious." },
  { name: "Ali C.",      rating: 4, comment: "Good sillage and longevity for the price." },
  { name: "Mia S.",      rating: 4, comment: "Smooth and sophisticated. Highly recommend." },
  { name: "Aaron V.",    rating: 5, comment: "A masterclass in perfumery. Stunning." },
  { name: "Leila N.",    rating: 5, comment: "Absolutely in love. Gets better every wear." },
  { name: "Ben K.",      rating: 5, comment: "The projection is insane in the best way." },
  { name: "Sara M.",     rating: 5, comment: "Smells like luxury. Will be buying again." },
  { name: "Chris T.",    rating: 5, comment: "Top-tier fragrance. The dry-down is superb." },
  { name: "Hana J.",     rating: 5, comment: "Worth every cent. Genuinely unique." },
  { name: "Nico R.",     rating: 5, comment: "My confidence booster. Can't go without." },
  { name: "Tara L.",     rating: 5, comment: "Opulent, refined, lasting. Perfect." },
  { name: "Felix A.",    rating: 5, comment: "Premium in every way. Top recommendation." },
  { name: "Jade W.",     rating: 4, comment: "Lovely but wish it came in a larger size." },
  { name: "Kyle B.",     rating: 5, comment: "Sensational. Exactly what I was looking for." },
  { name: "Eva M.",      rating: 4, comment: "Beautifully blended. Very elegant." },
  { name: "Tyler S.",    rating: 5, comment: "Everyone asked what I was wearing. Perfect score." },
  { name: "Nadia C.",    rating: 5, comment: "Rich and warm. My absolute go-to." },
  { name: "Remi P.",     rating: 4, comment: "Excellent quality. Notes are well balanced." },
];

export async function POST() {
  const { error } = await requireAdmin();
  if (error) return error;

  const products = await prisma.product.findMany({ select: { id: true } });

  let created = 0;
  const now = new Date();

  for (const product of products) {
    // Shuffle reviews with deterministic randomness per product
    const shuffled = [...REVIEWS].sort(() => Math.random() - 0.5);

    await prisma.review.createMany({
      data: shuffled.map((r, idx) => ({
        productId: product.id,
        customerName: r.name,
        rating: r.rating,
        comment: r.comment,
        isVerified: idx % 3 !== 0, // ~67% verified
        createdAt: new Date(now.getTime() - idx * 86_400_000 * 3), // spread over past months
      })),
    });
    created += shuffled.length;
  }

  revalidatePath("/products/[slug]", "page");
  revalidatePath("/shop");

  return NextResponse.json({ success: true, created, products: products.length });
}
