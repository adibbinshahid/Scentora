import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database (SQLite mode)...");

  // 1. Clean existing records
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared database.");

  // 2. Create Users
  const adminPasswordHash = await bcrypt.hash("admin", 12);
  await prisma.user.create({
    data: {
      email: "admin",
      name: "Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  const customerPasswordHash = await bcrypt.hash("customer123", 12);
  await prisma.user.create({
    data: {
      email: "customer@gmail.com",
      name: "Jean Laurent",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      emailVerified: new Date(),
      addresses: {
        create: {
          street: "75 Rue du Faubourg Saint-Honoré",
          city: "Paris",
          state: "Île-de-France",
          zipCode: "75008",
          country: "France",
          phone: "+33 1 42 68 53 00",
          isDefault: true,
        },
      },
    },
  });

  console.log("Created users.");

  // 3. Create Categories
  const noireCategory = await prisma.category.create({
    data: { name: "La Collection Noire", slug: "la-collection-noire" },
  });
  const blancheCategory = await prisma.category.create({
    data: { name: "La Collection Blanche", slug: "la-collection-blanche" },
  });
  const dorCategory = await prisma.category.create({
    data: { name: "La Collection d'Or", slug: "la-collection-dor" },
  });

  console.log("Created categories.");

  // 4. Create Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "AURUM10",
        type: "PERCENTAGE",
        value: 10.00,
        minOrderValue: 100.00,
        isActive: true,
      },
      {
        code: "NOIR50",
        type: "FIXED_AMOUNT",
        value: 50.00,
        minOrderValue: 200.00,
        isActive: true,
      },
      {
        code: "FREESHIP",
        type: "FREE_SHIPPING",
        value: 0.00,
        minOrderValue: 50.00,
        isActive: true,
      },
    ],
  });

  console.log("Created coupons.");

  // 5. Create Products with Variants & Reviews
  const productsData = [
    {
      name: "Scentora",
      slug: "scentora",
      description: "Our signature masterpiece. An intoxicating, dark, opulent blend of raw spices, deep midnight rose, and rare agarwood wrapped in a liquid gold shroud.",
      story: "Born in the dead of winter, Scentora represents the contrast between absolute dark and the brilliant, warm glow of gold. Crafted by master perfumers, it is a statement of power, presence, and ineffable luxury.",
      concentration: "EDP Intense",
      gender: "UNISEX",
      family: "Oriental Woody",
      topNotes: JSON.stringify(["Saffron", "Black Pepper", "Incense"]),
      heartNotes: JSON.stringify(["Midnight Rose", "Oud", "Sandalwood"]),
      baseNotes: JSON.stringify(["Amber", "Patchouli", "Liquid Gold Accord", "Vanilla"]),
      images: JSON.stringify([
        "/images/products/scentora-1.jpg",
        "/images/products/scentora-2.jpg",
        "/images/products/scentora-3.jpg",
        "/images/products/scentora-4.jpg"
      ]),
      categoryId: noireCategory.id,
      isFeatured: true,
      isBestseller: true,
      metaTitle: "Scentora EDP Intense — Luxury Signature Fragrance",
      metaDesc: "Discover Scentora EDP Intense, the signature luxury fragrance featuring oud, midnight rose, and gold accents. Buy directly from the official store.",
      variants: [
        { size: "50ml", sku: "SC-EDPI-50", price: 185.00, stock: 15 },
        { size: "100ml", sku: "SC-EDPI-100", price: 275.00, stock: 8 },
      ],
      reviews: [
        { customerName: "Sophia V.", rating: 5, comment: "Absolutely captivating. The oud is so smooth and the rose adds a hauntingly beautiful layer. Lasts 12+ hours.", isVerified: true },
        { customerName: "Marcus E.", rating: 5, comment: "The gold accord is real. It smells expensive, bold, and regal. Truly a masterpiece.", isVerified: true },
      ],
    },
    {
      name: "Nuit Blanche",
      slug: "nuit-blanche",
      description: "A luminous, clean, yet seductive floral-musk fragrance mimicking the crisp air of a sleepless night in Paris.",
      story: "Under the silver moonlight, Paris hums with quiet anticipation. Nuit Blanche is the scent of clean white sheets, fresh flowers on a vanity, and the musk of skin-to-skin touch at dawn.",
      concentration: "EDP",
      gender: "FEMALE",
      family: "Floral Musk",
      topNotes: JSON.stringify(["Bergamot", "Neroli", "Aldehydes"]),
      heartNotes: JSON.stringify(["White Jasmine", "Tuberose", "White Lily"]),
      baseNotes: JSON.stringify(["White Musk", "Cedarwood", "Cashmeran", "Vanilla"]),
      images: JSON.stringify([
        "/images/products/nuit-blanche-1.jpg",
        "/images/products/nuit-blanche-2.jpg",
        "/images/products/nuit-blanche-3.jpg",
        "/images/products/nuit-blanche-4.jpg"
      ]),
      categoryId: blancheCategory.id,
      isFeatured: true,
      isBestseller: false,
      metaTitle: "Nuit Blanche Eau de Parfum — Crisp Luminous Floral Musk",
      metaDesc: "Nuit Blanche EDP is a fresh yet sensual blend of white jasmine, neroli, and cashmere musk. Perfect for elegant days and nights.",
      variants: [
        { size: "50ml", sku: "NB-EDP-50", price: 160.00, stock: 25 },
        { size: "100ml", sku: "NB-EDP-100", price: 240.00, stock: 3 },
      ],
      reviews: [
        { customerName: "Elena R.", rating: 5, comment: "So clean yet so deep. It makes me feel incredibly elegant. I get compliments every time I wear it.", isVerified: true },
      ],
    },
    {
      name: "Oud Mystique",
      slug: "oud-mystique",
      description: "An intense, rich, woody-spiced tribute to the sacred resin. Smoke, dark woods, and sweet resins.",
      story: "For centuries, agarwood has been burned in holy places. Oud Mystique captures the spiritual, smoky essence of high-grade Cambodian oud mixed with sweet spices.",
      concentration: "EDP Intense",
      gender: "UNISEX",
      family: "Woody Spiced",
      topNotes: JSON.stringify(["Cardamom", "Rosewood", "Sichuan Pepper"]),
      heartNotes: JSON.stringify(["Oud", "Sandalwood", "Vetiver"]),
      baseNotes: JSON.stringify(["Tonka Bean", "Amber", "Vanilla", "Leather"]),
      images: JSON.stringify([
        "/images/products/oud-mystique-1.jpg",
        "/images/products/oud-mystique-2.jpg",
        "/images/products/oud-mystique-3.jpg",
        "/images/products/oud-mystique-4.jpg"
      ]),
      categoryId: noireCategory.id,
      isFeatured: false,
      isBestseller: true,
      metaTitle: "Oud Mystique EDP Intense — Sacred Oud & Sandalwood",
      metaDesc: "Shop Oud Mystique, an opulent fragrance built on pure Cambodian agarwood, warm cardamom, and sweet tonka bean.",
      variants: [
        { size: "50ml", sku: "OM-EDPI-50", price: 195.00, stock: 12 },
        { size: "100ml", sku: "OM-EDPI-100", price: 295.00, stock: 18 },
      ],
      reviews: [
        { customerName: "Tariq K.", rating: 5, comment: "Very authentic oud smell, not synthetic at all. Spiced, slightly sweet, and incredibly masculine.", isVerified: true },
      ],
    },
    {
      name: "Verveine Céleste",
      slug: "verveine-celeste",
      description: "An ultra-bright, sparkling citrus aromatic scent that bursts with lemon verbena, fresh grapefruit, and cooling mint.",
      story: "Inspired by the sun-drenched terraced hills of the French Riviera. Verveine Céleste is a crystalline breeze on a warm summer afternoon.",
      concentration: "EDT",
      gender: "UNISEX",
      family: "Citrus Aromatic",
      topNotes: JSON.stringify(["Lemon Verbena", "Grapefruit", "Mint", "Bergamot"]),
      heartNotes: JSON.stringify(["Green Tea", "White Lily", "Ginger"]),
      baseNotes: JSON.stringify(["Cedarwood", "Clear Musk", "Ambergris"]),
      images: JSON.stringify([
        "/images/products/verveine-celeste-1.jpg",
        "/images/products/verveine-celeste-2.jpg",
        "/images/products/verveine-celeste-3.jpg",
        "/images/products/verveine-celeste-4.jpg"
      ]),
      categoryId: blancheCategory.id,
      isFeatured: false,
      isBestseller: false,
      metaTitle: "Verveine Céleste Eau de Toilette — Riviera Lemon Verbena",
      metaDesc: "Experience the vibrant citrus freshness of Verveine Céleste EDT. A refreshing mix of verbena, mint, and green tea.",
      variants: [
        { size: "50ml", sku: "VC-EDT-50", price: 140.00, stock: 30 },
        { size: "100ml", sku: "VC-EDT-100", price: 210.00, stock: 22 },
      ],
      reviews: [],
    },
    {
      name: "Cuir Impérial",
      slug: "cuir-imperial",
      description: "A commanding leather oriental fragrance that contrasts sweet raspberry with smoky birchwood, black suede, and rich amber.",
      story: "A nod to the private chambers of royal estates, Cuir Impérial is the smell of heavy leather armchairs, aged books, and fine tobacco.",
      concentration: "EDP",
      gender: "MALE",
      family: "Leather Oriental",
      topNotes: JSON.stringify(["Raspberry", "Saffron", "Thyme"]),
      heartNotes: JSON.stringify(["Olibanum", "Night Jasmine", "Birchwood"]),
      baseNotes: JSON.stringify(["Leather", "Black Suede", "Amber", "Woody Notes"]),
      images: JSON.stringify([
        "/images/products/cuir-imperial-1.jpg",
        "/images/products/cuir-imperial-2.jpg",
        "/images/products/cuir-imperial-3.jpg",
        "/images/products/cuir-imperial-4.jpg"
      ]),
      categoryId: noireCategory.id,
      isFeatured: true,
      isBestseller: true,
      metaTitle: "Cuir Impérial EDP — Suede, Saffron & Raspberry",
      metaDesc: "Step into power with Cuir Impérial EDP. Seductive leather notes softened by sweet raspberry and warm saffron.",
      variants: [
        { size: "50ml", sku: "CI-EDP-50", price: 190.00, stock: 4 }, // Low stock alert test
        { size: "100ml", sku: "CI-EDP-100", price: 280.00, stock: 14 },
      ],
      reviews: [
        { customerName: "Arthur P.", rating: 5, comment: "Robust leather scent. The raspberry opening is unique and keeps it from being too heavy. Absolute stunner.", isVerified: true },
      ],
    },
    {
      name: "Rosé Impériale",
      slug: "rose-imperiale",
      description: "A rich, majestic floral spiced tribute to the Turkish rose, warmed by pink pepper and balanced by green papyrus.",
      story: "Walking through a rose garden at twilight, the petals heavy with dew. Rosé Impériale is a deep, velvety, spicy rose that commands attention.",
      concentration: "EDP",
      gender: "FEMALE",
      family: "Floral Spiced",
      topNotes: JSON.stringify(["Turkish Rose", "Pink Pepper", "Pear"]),
      heartNotes: JSON.stringify(["Rose Absolute", "Raspberry Blossom", "Patchouli"]),
      baseNotes: JSON.stringify(["Papyrus", "Amber", "White Woods", "Musk"]),
      images: JSON.stringify([
        "/images/products/rose-imperiale-1.jpg",
        "/images/products/rose-imperiale-2.jpg",
        "/images/products/rose-imperiale-3.jpg",
        "/images/products/rose-imperiale-4.jpg"
      ]),
      categoryId: blancheCategory.id,
      isFeatured: false,
      isBestseller: true,
      metaTitle: "Rosé Impériale EDP — Velvet Turkish Rose & Pink Pepper",
      metaDesc: "A majestic spicy floral fragrance featuring Turkish rose petals, patchouli, and clean cedarwood.",
      variants: [
        { size: "50ml", sku: "RI-EDP-50", price: 175.00, stock: 15 },
        { size: "100ml", sku: "RI-EDP-100", price: 260.00, stock: 10 },
      ],
      reviews: [],
    },
    {
      name: "Vetiver Doré",
      slug: "vetiver-dore",
      description: "A sophisticated earthy-woody fragrance showing the warm, golden side of Haitian vetiver with grapefruit, flint, and cedar.",
      story: "Where the earth meets the sun. Vetiver Doré is a fresh, mineral-rich, yet dry woody fragrance inspired by early morning walks through wet fields.",
      concentration: "EDT",
      gender: "MALE",
      family: "Woody Aromatic",
      topNotes: JSON.stringify(["Grapefruit", "Orange", "Flint Accord"]),
      heartNotes: JSON.stringify(["Vetiver", "Geranium", "Patchouli", "Sichuan Pepper"]),
      baseNotes: JSON.stringify(["Benzoin", "Cedarwood", "Oakmoss", "Musk"]),
      images: JSON.stringify([
        "/images/products/vetiver-dore-1.jpg",
        "/images/products/vetiver-dore-2.jpg",
        "/images/products/vetiver-dore-3.jpg",
        "/images/products/vetiver-dore-4.jpg"
      ]),
      categoryId: dorCategory.id,
      isFeatured: false,
      isBestseller: false,
      metaTitle: "Vetiver Doré EDT — Haitian Vetiver & Grapefruit",
      metaDesc: "Explore Vetiver Doré, a high-contrast mineral and woody Eau de Toilette built with vetiver, flint, and citrus notes.",
      variants: [
        { size: "50ml", sku: "VD-EDT-50", price: 150.00, stock: 20 },
        { size: "100ml", sku: "VD-EDT-100", price: 225.00, stock: 15 },
      ],
      reviews: [
        { customerName: "Julien M.", rating: 4, comment: "Very fresh and earthy. The flint note gives it a really cool metallic, mineral edge.", isVerified: true },
      ],
    },
    {
      name: "Ambre Extrême",
      slug: "ambre-extreme",
      description: "A rich, resinous amber perfume featuring dense vanilla, dry labdanum, benzoin, and warm spices.",
      story: "Like amber resin trapped in time. Ambre Extrême is an intensely warm, enveloping, sweet balsamic hug of vanilla, resins, and sandalwood.",
      concentration: "EDP",
      gender: "UNISEX",
      family: "Amber Balsamic",
      topNotes: JSON.stringify(["Coriander", "Nutmeg", "Labdanum"]),
      heartNotes: JSON.stringify(["Amber Accord", "Benzoin", "Styrax", "Clove"]),
      baseNotes: JSON.stringify(["Patchouli", "Sandalwood", "Vanilla Bean", "Musk"]),
      images: JSON.stringify([
        "/images/products/ambre-extreme-1.jpg",
        "/images/products/ambre-extreme-2.jpg",
        "/images/products/ambre-extreme-3.jpg",
        "/images/products/ambre-extreme-4.jpg"
      ]),
      categoryId: dorCategory.id,
      isFeatured: true,
      isBestseller: false,
      metaTitle: "Ambre Extrême EDP — Velvet Amber & Madagascar Vanilla",
      metaDesc: "Indulge in Ambre Extrême EDP. A heavy, warm, resinous amber fragrance highlighted by rich spices and absolute vanilla.",
      variants: [
        { size: "50ml", sku: "AE-EDP-50", price: 170.00, stock: 0 }, // Out of stock waitlist test
        { size: "100ml", sku: "AE-EDP-100", price: 255.00, stock: 12 },
      ],
      reviews: [],
    },
    {
      name: "Santal Nectar",
      slug: "santal-nectar",
      description: "A creamy, comforting woody fragrance that infuses cardamom and coconut milk with powdery iris and Australian sandalwood.",
      story: "Warm wood meets tropical creaminess. Santal Nectar is a smooth, milky, comforting skin scent that lingers like a soft memory.",
      concentration: "EDP",
      gender: "UNISEX",
      family: "Woody Creamy",
      topNotes: JSON.stringify(["Coconut Milk", "Cardamom", "Violet Leaf"]),
      heartNotes: JSON.stringify(["Sandalwood", "Iris", "Papyrus"]),
      baseNotes: JSON.stringify(["Amber", "Cedarwood", "Vanilla Bean", "Leather"]),
      images: JSON.stringify([
        "/images/products/santal-nectar-1.jpg",
        "/images/products/santal-nectar-2.jpg",
        "/images/products/santal-nectar-3.jpg",
        "/images/products/santal-nectar-4.jpg"
      ]),
      categoryId: dorCategory.id,
      isFeatured: false,
      isBestseller: false,
      metaTitle: "Santal Nectar EDP — Creamy Sandalwood & Cardamom",
      metaDesc: "Discover Santal Nectar EDP. A highly addictive blend of milky sandalwood, soft iris, and spicy cardamom.",
      variants: [
        { size: "50ml", sku: "SN-EDP-50", price: 165.00, stock: 14 },
        { size: "100ml", sku: "SN-EDP-100", price: 245.00, stock: 9 },
      ],
      reviews: [],
    },
    {
      name: "Encens Sacré",
      slug: "encens-sacre",
      description: "A dark, smoky, spiritual scent combining high-grade frankincense with patchouli, dark leather, and myrrh.",
      story: "The atmosphere of a cold, ancient stone chapel filled with the smoke of holy incense. Encens Sacré is dry, meditative, and dark.",
      concentration: "EDP Intense",
      gender: "UNISEX",
      family: "Smoky Balsamic",
      topNotes: JSON.stringify(["Incense", "Cypress", "Pink Pepper"]),
      heartNotes: JSON.stringify(["Patchouli", "Iris", "Myrrh", "Cedar"]),
      baseNotes: JSON.stringify(["White Musk", "Honey Accord", "Leather", "Amber"]),
      images: JSON.stringify([
        "/images/products/encens-sacre-1.jpg",
        "/images/products/encens-sacre-2.jpg",
        "/images/products/encens-sacre-3.jpg",
        "/images/products/encens-sacre-4.jpg"
      ]),
      categoryId: noireCategory.id,
      isFeatured: false,
      isBestseller: false,
      metaTitle: "Encens Sacré EDP Intense — Frankincense, Myrrh & Leather",
      metaDesc: "A spiritual, smoky scent of frankincense resin, dark leather, myrrh, and cold forest wood.",
      variants: [
        { size: "50ml", sku: "ES-EDPI-50", price: 180.00, stock: 16 },
        { size: "100ml", sku: "ES-EDPI-100", price: 270.00, stock: 7 },
      ],
      reviews: [],
    },
    {
      name: "Fleur de Sel",
      slug: "fleur-de-sel",
      description: "A crisp marine scent of sea salt, coastal herbs, driftwood, and warm beach sand.",
      story: "Standing on a rugged clifftop as the waves crash below, spraying salty mist into the air. Fleur de Sel is refreshing, mineral-dry, and breezy.",
      concentration: "EDT",
      gender: "UNISEX",
      family: "Marine Aromatic",
      topNotes: JSON.stringify(["Sea Salt Accord", "Sea Breeze", "Bergamot"]),
      heartNotes: JSON.stringify(["Sage", "Seaweed", "Driftwood", "Iris"]),
      baseNotes: JSON.stringify(["Ambrette Seed", "Cedarwood", "Fir Balsam", "Musk"]),
      images: JSON.stringify([
        "/images/products/fleur-de-sel-1.jpg",
        "/images/products/fleur-de-sel-2.jpg",
        "/images/products/fleur-de-sel-3.jpg",
        "/images/products/fleur-de-sel-4.jpg"
      ]),
      categoryId: blancheCategory.id,
      isFeatured: false,
      isBestseller: false,
      metaTitle: "Fleur de Sel EDT — Coastal Sage & Sea Salt",
      metaDesc: "Breathe in the mineral freshness of Fleur de Sel EDT, combining marine salt, sage, seaweed, and sun-dried wood.",
      variants: [
        { size: "50ml", sku: "FS-EDT-50", price: 145.00, stock: 18 },
        { size: "100ml", sku: "FS-EDT-100", price: 215.00, stock: 10 },
      ],
      reviews: [
        { customerName: "Chloe H.", rating: 5, comment: "Tears of the sea! It smells exactly like the seaside but so elevated. Not fishy at all, just dry salt and herbs.", isVerified: true },
      ],
    },
    {
      name: "Soleil d'Or",
      slug: "soleil-dor",
      description: "A warm, sun-kissed citrus floral scent wrapping ylang-ylang and tiare flowers in solar amber and sweet coconut.",
      story: "The golden hour. Soleil d'Or captures the warmth of sunlight on bare skin, filled with exotic beach blossoms and sweet vanilla.",
      concentration: "EDP",
      gender: "FEMALE",
      family: "Solar Floral",
      topNotes: JSON.stringify(["Mandarin", "Bitter Orange", "Coconut", "Bergamot"]),
      heartNotes: JSON.stringify(["Ylang-Ylang", "Tiare Flower", "Jasmine", "Frangipani"]),
      baseNotes: JSON.stringify(["Solar Amber Accord", "Vanilla", "Sand Musk"]),
      images: JSON.stringify([
        "/images/products/soleil-dor-1.jpg",
        "/images/products/soleil-dor-2.jpg",
        "/images/products/soleil-dor-3.jpg",
        "/images/products/soleil-dor-4.jpg"
      ]),
      categoryId: dorCategory.id,
      isFeatured: true,
      isBestseller: false,
      metaTitle: "Soleil d'Or EDP — Solar Ylang-Ylang & Exotic Tiare",
      metaDesc: "Step into the golden warmth of Soleil d'Or EDP. An exotic bouquet of tropical florals, sweet coconut, and warm solar amber.",
      variants: [
        { size: "50ml", sku: "SO-EDP-50", price: 155.00, stock: 15 },
        { size: "100ml", sku: "SO-EDP-100", price: 230.00, stock: 8 },
      ],
      reviews: [],
    },
  ];

  for (const prod of productsData) {
    const { variants, reviews, ...prodFields } = prod;

    const createdProduct = await prisma.product.create({
      data: {
        ...prodFields,
        variants: {
          create: variants,
        },
      },
    });

    if (reviews && reviews.length > 0) {
      for (const r of reviews) {
        await prisma.review.create({
          data: {
            ...r,
            productId: createdProduct.id,
          },
        });
      }
    }
  }

  console.log("Successfully seeded database with 12 luxury products (SQLite compatible).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
