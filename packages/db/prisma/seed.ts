import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Users ───────────────────────────────────────────────────────────────
  const adminHash    = await bcrypt.hash("2342",        12);
  const viewHash     = await bcrypt.hash("adminview",   12);
  const customerHash = await bcrypt.hash("customer123", 12);

  await prisma.user.upsert({
    where:  { email: "admin" },
    update: { name: "Admin", passwordHash: adminHash, role: "ADMIN" },
    create: { email: "admin", name: "Admin", passwordHash: adminHash, role: "ADMIN", emailVerified: new Date() },
  });

  await prisma.user.upsert({
    where:  { email: "adminview@scentora.demo" },
    update: { name: "adminview", passwordHash: viewHash, role: "ADMIN_VIEW" },
    create: { email: "adminview@scentora.demo", name: "adminview", passwordHash: viewHash, role: "ADMIN_VIEW", emailVerified: new Date() },
  });

  await prisma.user.upsert({
    where:  { email: "customer@gmail.com" },
    update: { name: "Jean Laurent", passwordHash: customerHash, role: "CUSTOMER" },
    create: {
      email: "customer@gmail.com", name: "Jean Laurent",
      passwordHash: customerHash, role: "CUSTOMER", emailVerified: new Date(),
    },
  });

  console.log("✓ Users");

  // ── Categories ──────────────────────────────────────────────────────────
  const noire = await prisma.category.upsert({
    where:  { slug: "la-collection-noire" },
    update: {},
    create: { name: "La Collection Noire",   slug: "la-collection-noire" },
  });
  const blanche = await prisma.category.upsert({
    where:  { slug: "la-collection-blanche" },
    update: {},
    create: { name: "La Collection Blanche", slug: "la-collection-blanche" },
  });
  const dor = await prisma.category.upsert({
    where:  { slug: "la-collection-dor" },
    update: {},
    create: { name: "La Collection d'Or",    slug: "la-collection-dor" },
  });

  console.log("✓ Categories");

  // ── Products ────────────────────────────────────────────────────────────
  const products = [
    {
      slug: "Midnight-Oud", name: "Midnight Oud", concentration: "EDP Intense",
      gender: "UNISEX", family: "Woody Spiced", categoryId: noire.id,
      isFeatured: true, isBestseller: true,
      description: "An intense, rich, woody-spiced tribute to the sacred resin. Smoke, dark woods, and sweet resins.",
      story: "For centuries, agarwood has been burned in holy places.",
      topNotes:   JSON.stringify(["Cardamom", "Rosewood", "Sichuan Pepper"]),
      heartNotes: JSON.stringify(["Oud", "Sandalwood", "Vetiver"]),
      baseNotes:  JSON.stringify(["Tonka Bean", "Amber", "Vanilla", "Leather"]),
      images: JSON.stringify(["/uploads/1780130606028-lxh1xow111.webp", "/uploads/1780130609970-tuq9y0l2r4f.png"]),
      metaTitle: "Midnight Oud EDP Intense — Sacred Oud & Sandalwood",
      metaDesc:  "Shop Midnight Oud, an opulent fragrance built on pure agarwood, warm cardamom, and sweet tonka bean.",
      variants: [
        { sku: "OM-EDPI-50",  size: "50ml",  price: 195.00, stock: 12 },
        { sku: "OM-EDPI-100", size: "100ml", price: 295.00, stock: 18 },
      ],
    },
    {
      slug: "Eclat-Dor", name: "Eclat D'or", concentration: "EDT",
      gender: "UNISEX", family: "Citrus Aromatic", categoryId: blanche.id,
      isFeatured: false, isBestseller: false,
      description: "An ultra-bright, sparkling citrus aromatic scent that bursts with lemon verbena, fresh grapefruit, and cooling mint.",
      story: "Inspired by the sun-drenched terraced hills of the French Riviera.",
      topNotes:   JSON.stringify(["Lemon Verbena", "Grapefruit", "Mint", "Bergamot"]),
      heartNotes: JSON.stringify(["Green Tea", "White Lily", "Ginger"]),
      baseNotes:  JSON.stringify(["Cedarwood", "Clear Musk", "Ambergris"]),
      images: JSON.stringify(["/uploads/1780130523408-jyx3l9jelnr.webp", "/uploads/1780130530056-ni8nc1gyq3m.png"]),
      metaTitle: "Eclat D'or Eau de Toilette — Riviera Citrus",
      metaDesc:  "Experience the vibrant citrus freshness of Eclat D'or EDT.",
      variants: [
        { sku: "VC-EDT-50",  size: "50ml",  price: 140.00, stock: 30 },
        { sku: "VC-EDT-100", size: "100ml", price: 210.00, stock: 22 },
      ],
    },
    {
      slug: "Night-Chai", name: "Night Chai", concentration: "EDP",
      gender: "FEMALE", family: "Floral Spiced", categoryId: blanche.id,
      isFeatured: false, isBestseller: true,
      description: "A rich, majestic floral spiced tribute to the Turkish rose, warmed by pink pepper and balanced by green papyrus.",
      story: "Walking through a rose garden at twilight, the petals heavy with dew.",
      topNotes:   JSON.stringify(["Turkish Rose", "Pink Pepper", "Pear"]),
      heartNotes: JSON.stringify(["Rose Absolute", "Raspberry Blossom", "Patchouli"]),
      baseNotes:  JSON.stringify(["Papyrus", "Amber", "White Woods", "Musk"]),
      images: JSON.stringify(["/uploads/1780130406470-se8gel8ze5l.webp", "/uploads/1780130413673-wi27y8xvsol.png"]),
      metaTitle: "Night Chai EDP — Velvet Rose & Pink Pepper",
      metaDesc:  "A majestic spicy floral fragrance featuring Turkish rose petals and patchouli.",
      variants: [
        { sku: "RI-EDP-50",  size: "50ml",  price: 175.00, stock: 15 },
        { sku: "RI-EDP-100", size: "100ml", price: 260.00, stock: 10 },
      ],
    },
    {
      slug: "Amber-Oud", name: "Amber Oud", concentration: "EDT",
      gender: "MALE", family: "Woody Aromatic", categoryId: dor.id,
      isFeatured: true, isBestseller: false,
      description: "A sophisticated earthy-woody fragrance showing the warm, golden side of Haitian vetiver with grapefruit, flint, and cedar.",
      story: "Where the earth meets the sun.",
      topNotes:   JSON.stringify(["Grapefruit", "Orange", "Flint Accord"]),
      heartNotes: JSON.stringify(["Vetiver", "Geranium", "Patchouli", "Sichuan Pepper"]),
      baseNotes:  JSON.stringify(["Benzoin", "Cedarwood", "Oakmoss", "Musk"]),
      images: JSON.stringify(["/uploads/1780130318504-7ng5316dne.webp", "/uploads/1780130324441-4dry62iab5m.png"]),
      metaTitle: "Amber Oud EDT — Haitian Vetiver & Grapefruit",
      metaDesc:  "Explore Amber Oud, a high-contrast mineral and woody Eau de Toilette.",
      variants: [
        { sku: "VD-EDT-50",  size: "50ml",  price: 150.00, stock: 20 },
        { sku: "VD-EDT-100", size: "100ml", price: 225.00, stock: 15 },
      ],
    },
    {
      slug: "Amber-Mystique", name: "Amber Mystique", concentration: "EDP",
      gender: "UNISEX", family: "Amber Balsamic", categoryId: dor.id,
      isFeatured: true, isBestseller: false,
      description: "A rich, resinous amber perfume featuring dense vanilla, dry labdanum, benzoin, and warm spices.",
      story: "Like amber resin trapped in time.",
      topNotes:   JSON.stringify(["Coriander", "Nutmeg", "Labdanum"]),
      heartNotes: JSON.stringify(["Amber Accord", "Benzoin", "Styrax", "Clove"]),
      baseNotes:  JSON.stringify(["Patchouli", "Sandalwood", "Vanilla Bean", "Musk"]),
      images: JSON.stringify(["/uploads/1780128473728-o7aischxelm.webp", "/uploads/1780128486209-qpkdjb7jny.png"]),
      metaTitle: "Amber Mystique EDP — Velvet Amber & Madagascar Vanilla",
      metaDesc:  "Indulge in Amber Mystique EDP. A heavy, warm, resinous amber fragrance.",
      variants: [
        { sku: "AE-EDP-50",  size: "80ml",  price: 170.00, stock: 0  },
        { sku: "AE-EDP-100", size: "200ml", price: 255.00, stock: 12 },
      ],
    },
    {
      slug: "Nocturne-Amber", name: "Nocturne Amber", concentration: "EDP",
      gender: "UNISEX", family: "Woody Creamy", categoryId: dor.id,
      isFeatured: true, isBestseller: false,
      description: "A creamy, comforting woody fragrance that infuses cardamom and coconut milk with powdery iris and Australian sandalwood.",
      story: "Warm wood meets tropical creaminess.",
      topNotes:   JSON.stringify(["Coconut Milk", "Cardamom", "Violet Leaf"]),
      heartNotes: JSON.stringify(["Sandalwood", "Iris", "Papyrus"]),
      baseNotes:  JSON.stringify(["Amber", "Cedarwood", "Vanilla Bean", "Leather"]),
      images: JSON.stringify(["/uploads/1780130703285-5e6p3cgcvp.webp", "/uploads/1780130776325-6l81iwx0hrc.png"]),
      metaTitle: "Nocturne Amber EDP — Creamy Sandalwood & Cardamom",
      metaDesc:  "Discover Nocturne Amber EDP. A highly addictive blend of milky sandalwood, soft iris, and spicy cardamom.",
      variants: [
        { sku: "SN-EDP-50",  size: "50ml",  price: 165.00, stock: 14 },
        { sku: "SN-EDP-100", size: "100ml", price: 245.00, stock: 9  },
      ],
    },
    {
      slug: "Amber-Obscura", name: "Amber Obscura", concentration: "EDP Intense",
      gender: "UNISEX", family: "Smoky Balsamic", categoryId: noire.id,
      isFeatured: false, isBestseller: true,
      description: "A dark, smoky, spiritual scent combining high-grade frankincense with patchouli, dark leather, and myrrh.",
      story: "The atmosphere of a cold, ancient stone chapel filled with the smoke of holy incense.",
      topNotes:   JSON.stringify(["Incense", "Cypress", "Pink Pepper"]),
      heartNotes: JSON.stringify(["Patchouli", "Iris", "Myrrh", "Cedar"]),
      baseNotes:  JSON.stringify(["White Musk", "Honey Accord", "Leather", "Amber"]),
      images: JSON.stringify(["/uploads/1780128320379-jry88clw4o.webp", "/uploads/1780128327373-ywg25dqv1ki.png"]),
      metaTitle: "Amber Obscura EDP Intense — Frankincense, Myrrh & Leather",
      metaDesc:  "A spiritual, smoky scent of frankincense resin, dark leather, myrrh, and cold forest wood.",
      variants: [
        { sku: "ES-EDPI-50",  size: "50ml",  price: 180.00, stock: 16 },
        { sku: "ES-EDPI-100", size: "100ml", price: 270.00, stock: 7  },
      ],
    },
    {
      slug: "Aura-Dor", name: "Aura D'or", concentration: "EDT",
      gender: "UNISEX", family: "Marine Aromatic", categoryId: blanche.id,
      isFeatured: false, isBestseller: false,
      description: "A crisp marine scent of sea salt, coastal herbs, driftwood, and warm beach sand.",
      story: "Standing on a rugged clifftop as the waves crash below.",
      topNotes:   JSON.stringify(["Sea Salt Accord", "Sea Breeze", "Bergamot"]),
      heartNotes: JSON.stringify(["Sage", "Seaweed", "Driftwood", "Iris"]),
      baseNotes:  JSON.stringify(["Ambrette Seed", "Cedarwood", "Fir Balsam", "Musk"]),
      images: JSON.stringify(["/uploads/1780128388129-pdmwu7gs1jc.webp", "/uploads/1780128393821-vo09pt1jht.png"]),
      metaTitle: "Aura D'or EDT — Coastal Sage & Sea Salt",
      metaDesc:  "Breathe in the mineral freshness of Aura D'or EDT.",
      variants: [
        { sku: "FS-EDT-50",  size: "50ml",  price: 145.00, stock: 18 },
        { sku: "FS-EDT-100", size: "100ml", price: 215.00, stock: 10 },
      ],
    },
    {
      slug: "Sovereign", name: "Sovereign", concentration: "EDP",
      gender: "FEMALE", family: "Solar Floral", categoryId: dor.id,
      isFeatured: true, isBestseller: true,
      description: "A warm, sun-kissed citrus floral scent wrapping ylang-ylang and tiare flowers in solar amber and sweet coconut.",
      story: "The golden hour. Sovereign captures the warmth of sunlight on bare skin.",
      topNotes:   JSON.stringify(["Mandarin", "Bitter Orange", "Coconut", "Bergamot"]),
      heartNotes: JSON.stringify(["Ylang-Ylang", "Tiare Flower", "Jasmine", "Frangipani"]),
      baseNotes:  JSON.stringify(["Solar Amber Accord", "Vanilla", "Sand Musk"]),
      images: JSON.stringify(["/uploads/1779782628241-qstdmz3sw0g.png", "/uploads/1779782632465-irsuymrdgw.png"]),
      metaTitle: "Sovereign EDP — Solar Ylang-Ylang & Exotic Tiare",
      metaDesc:  "Step into the golden warmth of Sovereign EDP.",
      variants: [
        { sku: "SO-EDP-50",  size: "50ml",  price: 155.00, stock: 15 },
        { sku: "SO-EDP-100", size: "100ml", price: 230.00, stock: 8  },
      ],
    },
  ];

  for (const { variants, ...prod } of products) {
    const created = await prisma.product.upsert({
      where:  { slug: prod.slug },
      update: { ...prod },
      create: { ...prod },
    });

    for (const v of variants) {
      await prisma.variant.upsert({
        where:  { sku: v.sku },
        update: { price: v.price, stock: v.stock, size: v.size },
        create: { ...v, productId: created.id },
      });
    }
  }

  console.log("✓ Products & Variants (9)");

  // ── Coupons ─────────────────────────────────────────────────────────────
  const coupons = [
    { code: "AURUM10",  type: "PERCENTAGE",   value: 10, minOrderValue: 100, isActive: true },
    { code: "NOIR50",   type: "FIXED_AMOUNT",  value: 50, minOrderValue: 200, isActive: true },
    { code: "FREESHIP", type: "FREE_SHIPPING", value: 0,  minOrderValue: 50,  isActive: true },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where:  { code: c.code },
      update: { isActive: c.isActive },
      create: c,
    });
  }

  console.log("✓ Coupons");
  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
