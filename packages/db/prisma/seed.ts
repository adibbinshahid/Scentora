import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Users ───────────────────────────────────────────────────────────────
  const adminHash      = await bcrypt.hash("2342",        12);
  const viewHash       = await bcrypt.hash("adminview",   12);
  const customerHash   = await bcrypt.hash("customer123", 12);

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
      addresses: {
        create: {
          street: "75 Rue du Faubourg Saint-Honoré", city: "Paris",
          state: "Île-de-France", zipCode: "75008", country: "France",
          phone: "+33 1 42 68 53 00", isDefault: true,
        },
      },
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
      slug: "scentora", name: "Scentora", concentration: "EDP Intense",
      gender: "UNISEX", family: "Oriental Woody", categoryId: noire.id,
      isFeatured: true, isBestseller: true,
      description: "Our signature masterpiece. An intoxicating, dark, opulent blend of raw spices, deep midnight rose, and rare agarwood wrapped in a liquid gold shroud.",
      story: "Born in the dead of winter, Scentora represents the contrast between absolute dark and the brilliant, warm glow of gold.",
      topNotes:   JSON.stringify(["Saffron", "Black Pepper", "Incense"]),
      heartNotes: JSON.stringify(["Midnight Rose", "Oud", "Sandalwood"]),
      baseNotes:  JSON.stringify(["Amber", "Patchouli", "Liquid Gold Accord", "Vanilla"]),
      images: JSON.stringify(["/images/products/scentora-1.jpg", "/images/products/scentora-2.jpg", "/images/products/scentora-3.jpg", "/images/products/scentora-4.jpg"]),
      metaTitle: "Scentora EDP Intense — Luxury Signature Fragrance",
      metaDesc:  "Discover Scentora EDP Intense, the signature luxury fragrance featuring oud, midnight rose, and gold accents.",
      variants: [
        { sku: "SC-EDPI-50",  size: "50ml",  price: 185.00, stock: 15 },
        { sku: "SC-EDPI-100", size: "100ml", price: 275.00, stock: 8  },
      ],
    },
    {
      slug: "nuit-blanche", name: "Nuit Blanche", concentration: "EDP",
      gender: "FEMALE", family: "Floral Musk", categoryId: blanche.id,
      isFeatured: true, isBestseller: false,
      description: "A luminous, clean, yet seductive floral-musk fragrance mimicking the crisp air of a sleepless night in Paris.",
      story: "Under the silver moonlight, Paris hums with quiet anticipation.",
      topNotes:   JSON.stringify(["Bergamot", "Neroli", "Aldehydes"]),
      heartNotes: JSON.stringify(["White Jasmine", "Tuberose", "White Lily"]),
      baseNotes:  JSON.stringify(["White Musk", "Cedarwood", "Cashmeran", "Vanilla"]),
      images: JSON.stringify(["/images/products/nuit-blanche-1.jpg", "/images/products/nuit-blanche-2.jpg", "/images/products/nuit-blanche-3.jpg", "/images/products/nuit-blanche-4.jpg"]),
      metaTitle: "Nuit Blanche Eau de Parfum — Crisp Luminous Floral Musk",
      metaDesc:  "Nuit Blanche EDP is a fresh yet sensual blend of white jasmine, neroli, and cashmere musk.",
      variants: [
        { sku: "NB-EDP-50",  size: "50ml",  price: 160.00, stock: 25 },
        { sku: "NB-EDP-100", size: "100ml", price: 240.00, stock: 3  },
      ],
    },
    {
      slug: "oud-mystique", name: "Oud Mystique", concentration: "EDP Intense",
      gender: "UNISEX", family: "Woody Spiced", categoryId: noire.id,
      isFeatured: false, isBestseller: true,
      description: "An intense, rich, woody-spiced tribute to the sacred resin. Smoke, dark woods, and sweet resins.",
      story: "For centuries, agarwood has been burned in holy places.",
      topNotes:   JSON.stringify(["Cardamom", "Rosewood", "Sichuan Pepper"]),
      heartNotes: JSON.stringify(["Oud", "Sandalwood", "Vetiver"]),
      baseNotes:  JSON.stringify(["Tonka Bean", "Amber", "Vanilla", "Leather"]),
      images: JSON.stringify(["/images/products/oud-mystique-1.jpg", "/images/products/oud-mystique-2.jpg", "/images/products/oud-mystique-3.jpg", "/images/products/oud-mystique-4.jpg"]),
      metaTitle: "Oud Mystique EDP Intense — Sacred Oud & Sandalwood",
      metaDesc:  "Shop Oud Mystique, an opulent fragrance built on pure Cambodian agarwood, warm cardamom, and sweet tonka bean.",
      variants: [
        { sku: "OM-EDPI-50",  size: "50ml",  price: 195.00, stock: 12 },
        { sku: "OM-EDPI-100", size: "100ml", price: 295.00, stock: 18 },
      ],
    },
    {
      slug: "verveine-celeste", name: "Verveine Céleste", concentration: "EDT",
      gender: "UNISEX", family: "Citrus Aromatic", categoryId: blanche.id,
      isFeatured: false, isBestseller: false,
      description: "An ultra-bright, sparkling citrus aromatic scent that bursts with lemon verbena, fresh grapefruit, and cooling mint.",
      story: "Inspired by the sun-drenched terraced hills of the French Riviera.",
      topNotes:   JSON.stringify(["Lemon Verbena", "Grapefruit", "Mint", "Bergamot"]),
      heartNotes: JSON.stringify(["Green Tea", "White Lily", "Ginger"]),
      baseNotes:  JSON.stringify(["Cedarwood", "Clear Musk", "Ambergris"]),
      images: JSON.stringify(["/images/products/verveine-celeste-1.jpg", "/images/products/verveine-celeste-2.jpg", "/images/products/verveine-celeste-3.jpg", "/images/products/verveine-celeste-4.jpg"]),
      metaTitle: "Verveine Céleste Eau de Toilette — Riviera Lemon Verbena",
      metaDesc:  "Experience the vibrant citrus freshness of Verveine Céleste EDT.",
      variants: [
        { sku: "VC-EDT-50",  size: "50ml",  price: 140.00, stock: 30 },
        { sku: "VC-EDT-100", size: "100ml", price: 210.00, stock: 22 },
      ],
    },
    {
      slug: "cuir-imperial", name: "Cuir Impérial", concentration: "EDP",
      gender: "MALE", family: "Leather Oriental", categoryId: noire.id,
      isFeatured: true, isBestseller: true,
      description: "A commanding leather oriental fragrance that contrasts sweet raspberry with smoky birchwood, black suede, and rich amber.",
      story: "A nod to the private chambers of royal estates.",
      topNotes:   JSON.stringify(["Raspberry", "Saffron", "Thyme"]),
      heartNotes: JSON.stringify(["Olibanum", "Night Jasmine", "Birchwood"]),
      baseNotes:  JSON.stringify(["Leather", "Black Suede", "Amber", "Woody Notes"]),
      images: JSON.stringify(["/images/products/cuir-imperial-1.jpg", "/images/products/cuir-imperial-2.jpg", "/images/products/cuir-imperial-3.jpg", "/images/products/cuir-imperial-4.jpg"]),
      metaTitle: "Cuir Impérial EDP — Suede, Saffron & Raspberry",
      metaDesc:  "Step into power with Cuir Impérial EDP.",
      variants: [
        { sku: "CI-EDP-50",  size: "50ml",  price: 190.00, stock: 4  },
        { sku: "CI-EDP-100", size: "100ml", price: 280.00, stock: 14 },
      ],
    },
    {
      slug: "rose-imperiale", name: "Rosé Impériale", concentration: "EDP",
      gender: "FEMALE", family: "Floral Spiced", categoryId: blanche.id,
      isFeatured: false, isBestseller: true,
      description: "A rich, majestic floral spiced tribute to the Turkish rose, warmed by pink pepper and balanced by green papyrus.",
      story: "Walking through a rose garden at twilight, the petals heavy with dew.",
      topNotes:   JSON.stringify(["Turkish Rose", "Pink Pepper", "Pear"]),
      heartNotes: JSON.stringify(["Rose Absolute", "Raspberry Blossom", "Patchouli"]),
      baseNotes:  JSON.stringify(["Papyrus", "Amber", "White Woods", "Musk"]),
      images: JSON.stringify(["/images/products/rose-imperiale-1.jpg", "/images/products/rose-imperiale-2.jpg", "/images/products/rose-imperiale-3.jpg", "/images/products/rose-imperiale-4.jpg"]),
      metaTitle: "Rosé Impériale EDP — Velvet Turkish Rose & Pink Pepper",
      metaDesc:  "A majestic spicy floral fragrance featuring Turkish rose petals, patchouli, and clean cedarwood.",
      variants: [
        { sku: "RI-EDP-50",  size: "50ml",  price: 175.00, stock: 15 },
        { sku: "RI-EDP-100", size: "100ml", price: 260.00, stock: 10 },
      ],
    },
    {
      slug: "vetiver-dore", name: "Vetiver Doré", concentration: "EDT",
      gender: "MALE", family: "Woody Aromatic", categoryId: dor.id,
      isFeatured: false, isBestseller: false,
      description: "A sophisticated earthy-woody fragrance showing the warm, golden side of Haitian vetiver with grapefruit, flint, and cedar.",
      story: "Where the earth meets the sun.",
      topNotes:   JSON.stringify(["Grapefruit", "Orange", "Flint Accord"]),
      heartNotes: JSON.stringify(["Vetiver", "Geranium", "Patchouli", "Sichuan Pepper"]),
      baseNotes:  JSON.stringify(["Benzoin", "Cedarwood", "Oakmoss", "Musk"]),
      images: JSON.stringify(["/images/products/vetiver-dore-1.jpg", "/images/products/vetiver-dore-2.jpg", "/images/products/vetiver-dore-3.jpg", "/images/products/vetiver-dore-4.jpg"]),
      metaTitle: "Vetiver Doré EDT — Haitian Vetiver & Grapefruit",
      metaDesc:  "Explore Vetiver Doré, a high-contrast mineral and woody Eau de Toilette.",
      variants: [
        { sku: "VD-EDT-50",  size: "50ml",  price: 150.00, stock: 20 },
        { sku: "VD-EDT-100", size: "100ml", price: 225.00, stock: 15 },
      ],
    },
    {
      slug: "ambre-extreme", name: "Ambre Extrême", concentration: "EDP",
      gender: "UNISEX", family: "Amber Balsamic", categoryId: dor.id,
      isFeatured: true, isBestseller: false,
      description: "A rich, resinous amber perfume featuring dense vanilla, dry labdanum, benzoin, and warm spices.",
      story: "Like amber resin trapped in time.",
      topNotes:   JSON.stringify(["Coriander", "Nutmeg", "Labdanum"]),
      heartNotes: JSON.stringify(["Amber Accord", "Benzoin", "Styrax", "Clove"]),
      baseNotes:  JSON.stringify(["Patchouli", "Sandalwood", "Vanilla Bean", "Musk"]),
      images: JSON.stringify(["/images/products/ambre-extreme-1.jpg", "/images/products/ambre-extreme-2.jpg", "/images/products/ambre-extreme-3.jpg", "/images/products/ambre-extreme-4.jpg"]),
      metaTitle: "Ambre Extrême EDP — Velvet Amber & Madagascar Vanilla",
      metaDesc:  "Indulge in Ambre Extrême EDP. A heavy, warm, resinous amber fragrance.",
      variants: [
        { sku: "AE-EDP-50",  size: "50ml",  price: 170.00, stock: 0  },
        { sku: "AE-EDP-100", size: "100ml", price: 255.00, stock: 12 },
      ],
    },
    {
      slug: "santal-nectar", name: "Santal Nectar", concentration: "EDP",
      gender: "UNISEX", family: "Woody Creamy", categoryId: dor.id,
      isFeatured: false, isBestseller: false,
      description: "A creamy, comforting woody fragrance that infuses cardamom and coconut milk with powdery iris and Australian sandalwood.",
      story: "Warm wood meets tropical creaminess.",
      topNotes:   JSON.stringify(["Coconut Milk", "Cardamom", "Violet Leaf"]),
      heartNotes: JSON.stringify(["Sandalwood", "Iris", "Papyrus"]),
      baseNotes:  JSON.stringify(["Amber", "Cedarwood", "Vanilla Bean", "Leather"]),
      images: JSON.stringify(["/images/products/santal-nectar-1.jpg", "/images/products/santal-nectar-2.jpg", "/images/products/santal-nectar-3.jpg", "/images/products/santal-nectar-4.jpg"]),
      metaTitle: "Santal Nectar EDP — Creamy Sandalwood & Cardamom",
      metaDesc:  "Discover Santal Nectar EDP. A highly addictive blend of milky sandalwood, soft iris, and spicy cardamom.",
      variants: [
        { sku: "SN-EDP-50",  size: "50ml",  price: 165.00, stock: 14 },
        { sku: "SN-EDP-100", size: "100ml", price: 245.00, stock: 9  },
      ],
    },
    {
      slug: "encens-sacre", name: "Encens Sacré", concentration: "EDP Intense",
      gender: "UNISEX", family: "Smoky Balsamic", categoryId: noire.id,
      isFeatured: false, isBestseller: false,
      description: "A dark, smoky, spiritual scent combining high-grade frankincense with patchouli, dark leather, and myrrh.",
      story: "The atmosphere of a cold, ancient stone chapel filled with the smoke of holy incense.",
      topNotes:   JSON.stringify(["Incense", "Cypress", "Pink Pepper"]),
      heartNotes: JSON.stringify(["Patchouli", "Iris", "Myrrh", "Cedar"]),
      baseNotes:  JSON.stringify(["White Musk", "Honey Accord", "Leather", "Amber"]),
      images: JSON.stringify(["/images/products/encens-sacre-1.jpg", "/images/products/encens-sacre-2.jpg", "/images/products/encens-sacre-3.jpg", "/images/products/encens-sacre-4.jpg"]),
      metaTitle: "Encens Sacré EDP Intense — Frankincense, Myrrh & Leather",
      metaDesc:  "A spiritual, smoky scent of frankincense resin, dark leather, myrrh, and cold forest wood.",
      variants: [
        { sku: "ES-EDPI-50",  size: "50ml",  price: 180.00, stock: 16 },
        { sku: "ES-EDPI-100", size: "100ml", price: 270.00, stock: 7  },
      ],
    },
    {
      slug: "fleur-de-sel", name: "Fleur de Sel", concentration: "EDT",
      gender: "UNISEX", family: "Marine Aromatic", categoryId: blanche.id,
      isFeatured: false, isBestseller: false,
      description: "A crisp marine scent of sea salt, coastal herbs, driftwood, and warm beach sand.",
      story: "Standing on a rugged clifftop as the waves crash below.",
      topNotes:   JSON.stringify(["Sea Salt Accord", "Sea Breeze", "Bergamot"]),
      heartNotes: JSON.stringify(["Sage", "Seaweed", "Driftwood", "Iris"]),
      baseNotes:  JSON.stringify(["Ambrette Seed", "Cedarwood", "Fir Balsam", "Musk"]),
      images: JSON.stringify(["/images/products/fleur-de-sel-1.jpg", "/images/products/fleur-de-sel-2.jpg", "/images/products/fleur-de-sel-3.jpg", "/images/products/fleur-de-sel-4.jpg"]),
      metaTitle: "Fleur de Sel EDT — Coastal Sage & Sea Salt",
      metaDesc:  "Breathe in the mineral freshness of Fleur de Sel EDT.",
      variants: [
        { sku: "FS-EDT-50",  size: "50ml",  price: 145.00, stock: 18 },
        { sku: "FS-EDT-100", size: "100ml", price: 215.00, stock: 10 },
      ],
    },
    {
      slug: "soleil-dor", name: "Soleil d'Or", concentration: "EDP",
      gender: "FEMALE", family: "Solar Floral", categoryId: dor.id,
      isFeatured: true, isBestseller: false,
      description: "A warm, sun-kissed citrus floral scent wrapping ylang-ylang and tiare flowers in solar amber and sweet coconut.",
      story: "The golden hour. Soleil d'Or captures the warmth of sunlight on bare skin.",
      topNotes:   JSON.stringify(["Mandarin", "Bitter Orange", "Coconut", "Bergamot"]),
      heartNotes: JSON.stringify(["Ylang-Ylang", "Tiare Flower", "Jasmine", "Frangipani"]),
      baseNotes:  JSON.stringify(["Solar Amber Accord", "Vanilla", "Sand Musk"]),
      images: JSON.stringify(["/images/products/soleil-dor-1.jpg", "/images/products/soleil-dor-2.jpg", "/images/products/soleil-dor-3.jpg", "/images/products/soleil-dor-4.jpg"]),
      metaTitle: "Soleil d'Or EDP — Solar Ylang-Ylang & Exotic Tiare",
      metaDesc:  "Step into the golden warmth of Soleil d'Or EDP.",
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
        update: { price: v.price, stock: v.stock },
        create: { ...v, productId: created.id },
      });
    }
  }

  console.log("✓ Products & Variants (12)");

  // ── Coupons ─────────────────────────────────────────────────────────────
  const coupons = [
    { code: "AURUM10",  type: "PERCENTAGE",   value: 10,  minOrderValue: 100, isActive: true },
    { code: "NOIR50",   type: "FIXED_AMOUNT",  value: 50,  minOrderValue: 200, isActive: true },
    { code: "FREESHIP", type: "FREE_SHIPPING", value: 0,   minOrderValue: 50,  isActive: true },
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
