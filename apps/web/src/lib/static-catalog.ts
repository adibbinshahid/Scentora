export type StaticProduct = {
  id: string;
  name: string;
  slug: string;
  concentration: string;
  family: string;
  gender: string;
  images: string[];
  variants: Array<{ id: string; size: string; price: number; salePrice: number | null; stock: number; sku: string }>;
  avgRating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestseller: boolean;
  categorySlug: string;
  isActive: boolean;
  description: string;
};

export const STATIC_PRODUCTS: StaticProduct[] = [
  {
    id: "scentora", name: "Scentora", slug: "scentora",
    concentration: "EDP Intense", family: "Oriental Woody", gender: "UNISEX",
    categorySlug: "la-collection-noire", isFeatured: true, isBestseller: true, isActive: true,
    description: "Our signature masterpiece. An intoxicating, dark, opulent blend of raw spices, deep midnight rose, and rare agarwood wrapped in a liquid gold shroud.",
    images: [
      "/uploads/1780128320379-jry88clw4o.webp",
      "/uploads/1780128327373-ywg25dqv1ki.png",
    ],
    variants: [
      { id: "SC-EDPI-50",  size: "50ml",  price: 185, salePrice: null, stock: 15, sku: "SC-EDPI-50"  },
      { id: "SC-EDPI-100", size: "100ml", price: 275, salePrice: null, stock: 8,  sku: "SC-EDPI-100" },
    ],
    avgRating: 0, reviewCount: 0,
  },
  {
    id: "nuit-blanche", name: "Nuit Blanche", slug: "nuit-blanche",
    concentration: "EDP", family: "Floral Musk", gender: "FEMALE",
    categorySlug: "la-collection-blanche", isFeatured: true, isBestseller: false, isActive: true,
    description: "A luminous, clean, yet seductive floral-musk fragrance mimicking the crisp air of a sleepless night in Paris.",
    images: [
      "/uploads/1780128388129-pdmwu7gs1jc.webp",
      "/uploads/1780128393821-vo09pt1jht.png",
    ],
    variants: [
      { id: "NB-EDP-50",  size: "50ml",  price: 160, salePrice: null, stock: 25, sku: "NB-EDP-50"  },
      { id: "NB-EDP-100", size: "100ml", price: 240, salePrice: null, stock: 3,  sku: "NB-EDP-100" },
    ],
    avgRating: 0, reviewCount: 0,
  },
  {
    id: "oud-mystique", name: "Oud Mystique", slug: "oud-mystique",
    concentration: "EDP Intense", family: "Woody Spiced", gender: "UNISEX",
    categorySlug: "la-collection-noire", isFeatured: false, isBestseller: true, isActive: true,
    description: "An intense, rich, woody-spiced tribute to the sacred resin. Smoke, dark woods, and sweet resins.",
    images: [
      "/uploads/1780128473728-o7aischxelm.webp",
      "/uploads/1780128486209-qpkdjb7jny.png",
    ],
    variants: [
      { id: "OM-EDPI-50",  size: "50ml",  price: 195, salePrice: null, stock: 12, sku: "OM-EDPI-50"  },
      { id: "OM-EDPI-100", size: "100ml", price: 295, salePrice: null, stock: 18, sku: "OM-EDPI-100" },
    ],
    avgRating: 0, reviewCount: 0,
  },
  {
    id: "verveine-celeste", name: "Verveine Céleste", slug: "verveine-celeste",
    concentration: "EDT", family: "Citrus Aromatic", gender: "UNISEX",
    categorySlug: "la-collection-blanche", isFeatured: false, isBestseller: false, isActive: true,
    description: "An ultra-bright, sparkling citrus aromatic scent that bursts with lemon verbena, fresh grapefruit, and cooling mint.",
    images: [
      "/uploads/1780130318504-7ng5316dne.webp",
      "/uploads/1780130324441-4dry62iab5m.png",
    ],
    variants: [
      { id: "VC-EDT-50",  size: "50ml",  price: 140, salePrice: null, stock: 30, sku: "VC-EDT-50"  },
      { id: "VC-EDT-100", size: "100ml", price: 210, salePrice: null, stock: 22, sku: "VC-EDT-100" },
    ],
    avgRating: 0, reviewCount: 0,
  },
  {
    id: "cuir-imperial", name: "Cuir Impérial", slug: "cuir-imperial",
    concentration: "EDP", family: "Leather Oriental", gender: "MALE",
    categorySlug: "la-collection-noire", isFeatured: true, isBestseller: true, isActive: true,
    description: "A commanding leather oriental fragrance that contrasts sweet raspberry with smoky birchwood, black suede, and rich amber.",
    images: [
      "/uploads/1780130406470-se8gel8ze5l.webp",
      "/uploads/1780130413673-wi27y8xvsol.png",
    ],
    variants: [
      { id: "CI-EDP-50",  size: "50ml",  price: 190, salePrice: null, stock: 4,  sku: "CI-EDP-50"  },
      { id: "CI-EDP-100", size: "100ml", price: 280, salePrice: null, stock: 14, sku: "CI-EDP-100" },
    ],
    avgRating: 0, reviewCount: 0,
  },
  {
    id: "rose-imperiale", name: "Rosé Impériale", slug: "rose-imperiale",
    concentration: "EDP", family: "Floral Spiced", gender: "FEMALE",
    categorySlug: "la-collection-blanche", isFeatured: false, isBestseller: true, isActive: true,
    description: "A rich, majestic floral spiced tribute to the Turkish rose, warmed by pink pepper and balanced by green papyrus.",
    images: [
      "/uploads/1780130523408-jyx3l9jelnr.webp",
      "/uploads/1780130530056-ni8nc1gyq3m.png",
    ],
    variants: [
      { id: "RI-EDP-50",  size: "50ml",  price: 175, salePrice: null, stock: 15, sku: "RI-EDP-50"  },
      { id: "RI-EDP-100", size: "100ml", price: 260, salePrice: null, stock: 10, sku: "RI-EDP-100" },
    ],
    avgRating: 0, reviewCount: 0,
  },
  {
    id: "vetiver-dore", name: "Vetiver Doré", slug: "vetiver-dore",
    concentration: "EDT", family: "Woody Aromatic", gender: "MALE",
    categorySlug: "la-collection-dor", isFeatured: false, isBestseller: false, isActive: true,
    description: "A sophisticated earthy-woody fragrance showing the warm, golden side of Haitian vetiver with grapefruit, flint, and cedar.",
    images: [
      "/uploads/1780130606028-lxh1xow111.webp",
      "/uploads/1780130609970-tuq9y0l2r4f.png",
    ],
    variants: [
      { id: "VD-EDT-50",  size: "50ml",  price: 150, salePrice: null, stock: 20, sku: "VD-EDT-50"  },
      { id: "VD-EDT-100", size: "100ml", price: 225, salePrice: null, stock: 15, sku: "VD-EDT-100" },
    ],
    avgRating: 0, reviewCount: 0,
  },
  {
    id: "ambre-extreme", name: "Ambre Extrême", slug: "ambre-extreme",
    concentration: "EDP", family: "Amber Balsamic", gender: "UNISEX",
    categorySlug: "la-collection-dor", isFeatured: true, isBestseller: false, isActive: true,
    description: "A rich, resinous amber perfume featuring dense vanilla, dry labdanum, benzoin, and warm spices.",
    images: [
      "/uploads/1780130703285-5e6p3cgcvp.webp",
      "/uploads/1780130776325-6l81iwx0hrc.png",
    ],
    variants: [
      { id: "AE-EDP-50",  size: "50ml",  price: 170, salePrice: null, stock: 0,  sku: "AE-EDP-50"  },
      { id: "AE-EDP-100", size: "100ml", price: 255, salePrice: null, stock: 12, sku: "AE-EDP-100" },
    ],
    avgRating: 0, reviewCount: 0,
  },
  {
    id: "santal-nectar", name: "Santal Nectar", slug: "santal-nectar",
    concentration: "EDP", family: "Woody Creamy", gender: "UNISEX",
    categorySlug: "la-collection-dor", isFeatured: false, isBestseller: false, isActive: true,
    description: "A creamy, comforting woody fragrance that infuses cardamom and coconut milk with powdery iris and Australian sandalwood.",
    images: [
      "/uploads/1780124838974-gvnrx5qberv.webp",
      "/uploads/1780139409321-tk77ahri6sa.webp",
    ],
    variants: [
      { id: "SN-EDP-50",  size: "50ml",  price: 165, salePrice: null, stock: 14, sku: "SN-EDP-50"  },
      { id: "SN-EDP-100", size: "100ml", price: 245, salePrice: null, stock: 9,  sku: "SN-EDP-100" },
    ],
    avgRating: 0, reviewCount: 0,
  },
  {
    id: "encens-sacre", name: "Encens Sacré", slug: "encens-sacre",
    concentration: "EDP Intense", family: "Smoky Balsamic", gender: "UNISEX",
    categorySlug: "la-collection-noire", isFeatured: false, isBestseller: false, isActive: true,
    description: "A dark, smoky, spiritual scent combining high-grade frankincense with patchouli, dark leather, and myrrh.",
    images: [
      "/uploads/1779782628241-qstdmz3sw0g.png",
      "/uploads/1779782632465-irsuymrdgw.png",
    ],
    variants: [
      { id: "ES-EDPI-50",  size: "50ml",  price: 180, salePrice: null, stock: 16, sku: "ES-EDPI-50"  },
      { id: "ES-EDPI-100", size: "100ml", price: 270, salePrice: null, stock: 7,  sku: "ES-EDPI-100" },
    ],
    avgRating: 0, reviewCount: 0,
  },
  {
    id: "fleur-de-sel", name: "Fleur de Sel", slug: "fleur-de-sel",
    concentration: "EDT", family: "Marine Aromatic", gender: "UNISEX",
    categorySlug: "la-collection-blanche", isFeatured: false, isBestseller: false, isActive: true,
    description: "A crisp marine scent of sea salt, coastal herbs, driftwood, and warm beach sand.",
    images: [
      "/uploads/1779778073542-9olg0betppu.png",
      "/uploads/1779780188392-sdrxv92pb2.png",
    ],
    variants: [
      { id: "FS-EDT-50",  size: "50ml",  price: 145, salePrice: null, stock: 18, sku: "FS-EDT-50"  },
      { id: "FS-EDT-100", size: "100ml", price: 215, salePrice: null, stock: 10, sku: "FS-EDT-100" },
    ],
    avgRating: 0, reviewCount: 0,
  },
  {
    id: "soleil-dor", name: "Soleil d'Or", slug: "soleil-dor",
    concentration: "EDP", family: "Solar Floral", gender: "FEMALE",
    categorySlug: "la-collection-dor", isFeatured: true, isBestseller: false, isActive: true,
    description: "A warm, sun-kissed citrus floral scent wrapping ylang-ylang and tiare flowers in solar amber and sweet coconut.",
    images: [
      "/uploads/1779721644678-jofrmjhwgg9.jpeg",
      "/uploads/1779722712384-hn0m5r7n91r.png",
    ],
    variants: [
      { id: "SO-EDP-50",  size: "50ml",  price: 155, salePrice: null, stock: 15, sku: "SO-EDP-50"  },
      { id: "SO-EDP-100", size: "100ml", price: 230, salePrice: null, stock: 8,  sku: "SO-EDP-100" },
    ],
    avgRating: 0, reviewCount: 0,
  },
];

export const STATIC_CATEGORIES = [
  { id: "cat-noire",   name: "La Collection Noire",   slug: "la-collection-noire"   },
  { id: "cat-blanche", name: "La Collection Blanche", slug: "la-collection-blanche" },
  { id: "cat-dor",     name: "La Collection d'Or",    slug: "la-collection-dor"     },
];
