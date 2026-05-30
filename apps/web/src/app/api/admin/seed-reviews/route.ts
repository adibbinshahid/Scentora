import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "db";
import { revalidatePath } from "next/cache";

const NAMES = [
  "Sophie M.", "James K.", "Amira L.", "Theo P.", "Elena V.", "Marcus R.", "Celine D.",
  "Kai W.", "Nina A.", "Ethan B.", "Lena T.", "Omar S.", "Clara J.", "Ivan N.",
  "Fatima Z.", "Hugo R.", "Zara H.", "Leo C.", "Anya K.", "Sam G.", "Priya M.",
  "David H.", "Yasmin A.", "Finn L.", "Isla T.", "Nour F.", "Max B.", "Rosa P.",
  "Ali C.", "Mia S.", "Aaron V.", "Leila N.", "Ben K.", "Sara M.", "Chris T.",
  "Hana J.", "Nico R.", "Tara L.", "Felix A.", "Jade W.", "Kyle B.", "Eva M.",
  "Tyler S.", "Nadia C.", "Remi P.", "Lucas W.", "Camille B.", "Darius O.", "Stella R.",
  "Aiden F.", "Miriam K.", "Tobias L.", "Ingrid S.", "Cyrus M.", "Lydia H.", "Brennan T.",
  "Yuki A.", "Emre C.", "Valentina G.", "Declan P.", "Soraya N.",
];

const COMMENTS: Record<number, string[]> = {
  1: [
    "Very disappointing. Nothing like the description.",
    "Expected much more for this price point.",
    "Faded within an hour. Not worth it.",
    "The scent is nothing like the sample I tried.",
    "Synthetic and harsh. Not what I expected from a luxury brand.",
    "Barely any projection. Basically smells like nothing on me.",
    "Returned it. The opening was fine but dry-down was awful.",
    "Overpowering in a bad way. Gave me a headache.",
  ],
  2: [
    "Decent opening but fades too quickly.",
    "Not bad but definitely not worth the premium price.",
    "OK fragrance, expected much better longevity.",
    "Smells nice but very generic for a niche perfume.",
    "The bottle is beautiful but the scent underwhelms.",
    "Average performance. Nothing unique about it.",
    "Too linear — no development after the opening.",
    "My skin seems to eat this up. Gone in 2 hours.",
  ],
  3: [
    "Pretty good, not spectacular. Worth trying.",
    "Solid fragrance, just not exceptional.",
    "Nice enough but there are better options at this price.",
    "Pleasant but safe — nothing that stands out.",
    "The sillage is moderate. Good for office wear.",
    "Enjoyable but I was expecting something more complex.",
    "Passable. The dry-down is better than the opening.",
    "Good for the price, nothing more, nothing less.",
    "Smells fine but doesn't feel luxurious enough.",
    "Average longevity. Needs a reapply after 4 hours.",
  ],
  4: [
    "Beautiful scent. Slightly pricey but worth it.",
    "Great fragrance. Longevity is impressive.",
    "Unique and elegant. Glad I took the risk.",
    "Very good. The dry-down is the best part.",
    "Sophisticated without being loud. Love it.",
    "Good quality, pleasant scent. Very wearable.",
    "Lovely bottle and great performance.",
    "Really nice, gets better after an hour.",
    "Lovely opening, beautiful heart notes.",
    "Premium feel. Would definitely reorder.",
    "Fantastic quality. Notes evolve beautifully.",
    "Great performance. The notes evolve nicely.",
    "Very pleasant and luxurious.",
    "Good sillage and longevity for the price.",
    "Smooth and sophisticated. Highly recommend.",
    "Wish it lasted a bit longer but otherwise perfect.",
    "Very complex, takes time to appreciate fully.",
    "Lovely scent, compliment magnet.",
  ],
  5: [
    "Absolutely divine. Long-lasting and unique.",
    "Best fragrance I've ever owned. Gets compliments all day.",
    "Rich, deep, exactly as described. Worth every penny.",
    "Incredible sillage. Lasts easily 12 hours on my skin.",
    "My signature scent. Nothing compares.",
    "Luxurious from bottle to skin. A masterpiece.",
    "Perfect balance of sophistication and warmth.",
    "Exactly what luxury fragrance should smell like.",
    "Got multiple compliments the same day. Love it.",
    "Exceptional projection without being overpowering.",
    "Absolutely gorgeous. My whole office asked about it.",
    "Exceeds expectations. Opulent and refined.",
    "Stunning. The opening is like nothing else.",
    "Bold, rich, distinctive. My new favourite.",
    "Perfectly crafted. Long lasting, beautiful scent.",
    "A masterclass in perfumery. Stunning.",
    "Absolutely in love. Gets better every wear.",
    "The projection is insane in the best way.",
    "Smells like luxury. Will be buying again.",
    "Top-tier fragrance. The dry-down is superb.",
    "Worth every cent. Genuinely unique.",
    "My confidence booster. Can't go without.",
    "Opulent, refined, lasting. Perfect.",
    "Premium in every way. Top recommendation.",
    "Everyone asked what I was wearing. Perfect score.",
    "Rich and warm. My absolute go-to.",
  ],
};

function generateRatings(count: number, targetAvg: number): number[] {
  // Gaussian weights centred on targetAvg — produces realistic distributions
  const weights = [1, 2, 3, 4, 5].map((r) => {
    const dist = r - targetAvg;
    return Math.exp(-(dist * dist) * 0.75);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  const cumulative = weights.map(
    ((sum) => (w: number) => (sum += w / total, sum))(0)
  );

  const ratings: number[] = [];
  for (let i = 0; i < count; i++) {
    const rand = Math.random();
    const rating = cumulative.findIndex((c) => rand <= c) + 1;
    ratings.push(Math.max(1, Math.min(5, rating)));
  }
  return ratings;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST() {
  const { error } = await requireAdmin();
  if (error) return error;

  // Clear existing reviews so re-running is idempotent
  await prisma.review.deleteMany({});

  const products = await prisma.product.findMany({ select: { id: true } });
  const now = Date.now();
  let totalCreated = 0;

  for (const product of products) {
    const count = Math.floor(Math.random() * 31) + 20; // 20–50
    const targetAvg = 3.2 + Math.random() * 1.7;       // 3.2–4.9
    const ratings = generateRatings(count, targetAvg);

    const data = ratings.map((rating, idx) => ({
      productId: product.id,
      customerName: pick(NAMES),
      rating,
      comment: pick(COMMENTS[rating]),
      isVerified: Math.random() > 0.28,
      createdAt: new Date(now - idx * 86_400_000 * (1 + Math.random() * 4)),
    }));

    await prisma.review.createMany({ data });
    totalCreated += data.length;
  }

  revalidateTag("products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/shop", "page");

  return NextResponse.json({
    success: true,
    created: totalCreated,
    products: products.length,
    avgPerProduct: Math.round(totalCreated / products.length),
  });
}
