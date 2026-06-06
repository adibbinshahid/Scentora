import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FIRST_NAMES = ["Sophie", "James", "Amira", "Theo", "Elena", "Marcus", "Celine", "Kai", "Nina", "Ethan",
  "Lena", "Omar", "Clara", "Ivan", "Fatima", "Hugo", "Zara", "Leo", "Anya", "Sam",
  "Priya", "David", "Yasmin", "Finn", "Isla", "Nour", "Max", "Rosa", "Ali", "Mia"];
const LAST_NAMES = ["Mitchell", "Karim", "Laurent", "Petrov", "Vasquez", "Rahman", "Dubois", "Weber",
  "Andersson", "Brown", "Thompson", "Hassan", "Jensen", "Novak", "Zayed", "Rossi",
  "Park", "Chen", "Garcia", "Müller", "Tanaka", "Osei", "Silva", "Kowalski", "Ali"];
const STREETS = ["14 Rue Saint-Honoré", "87 King Street", "23 Al Wasl Road", "5 Sloane Square",
  "112 Madison Ave", "8 Via Condotti", "34 Sukhumvit Rd", "19 Orchard Blvd",
  "67 Collins Street", "3 Bayswater Rd", "201 West 57th St", "45 Boulevard Haussmann"];
const CITIES = ["Paris", "London", "Dubai", "New York", "Milan", "Bangkok", "Singapore", "Melbourne", "Tokyo", "Toronto"];
const COUNTRIES = ["FR", "GB", "AE", "US", "IT", "TH", "SG", "AU", "JP", "CA"];
const STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "DELIVERED", "DELIVERED"] as const;

function pick<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AN-${ts}-${rand}`;
}

function randomAddress(firstName: string, lastName: string) {
  const idx = Math.floor(Math.random() * CITIES.length);
  return {
    name: `${firstName} ${lastName}`,
    street: pick(STREETS),
    city: CITIES[idx],
    state: CITIES[idx],
    zipCode: String(10000 + Math.floor(Math.random() * 89999)),
    country: COUNTRIES[idx],
    phone: `+${1 + Math.floor(Math.random() * 98)} ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  };
}

async function main() {
  const variants = await prisma.variant.findMany({
    include: { product: { select: { name: true, isActive: true } } },
    where: { product: { isActive: true } },
  });

  if (variants.length === 0) {
    console.log("No active product variants found. Seed products first.");
    return;
  }

  const now = Date.now();
  const ORDER_COUNT = 40;
  let created = 0;

  for (let i = 0; i < ORDER_COUNT; i++) {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 99)}@example.com`;
    const address = randomAddress(firstName, lastName);

    // 1-3 items per order
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const chosenVariants = [...variants].sort(() => Math.random() - 0.5).slice(0, itemCount);

    const subtotal = chosenVariants.reduce((sum, v) => {
      const qty = Math.floor(Math.random() * 2) + 1;
      return sum + (v.salePrice ?? v.price) * qty;
    }, 0);

    const shippingCost = subtotal >= 200 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    const status = pick(STATUSES);
    const daysAgo = Math.floor(Math.random() * 90);
    const createdAt = new Date(now - daysAgo * 86_400_000);

    const addrJson = JSON.stringify(address);

    await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        guestEmail: email,
        status,
        subtotal,
        discountAmount: 0,
        shippingCost,
        tax,
        total,
        shippingAddress: addrJson,
        billingAddress: addrJson,
        createdAt,
        items: {
          create: chosenVariants.map((v) => ({
            variantId: v.id,
            productName: v.product.name,
            variantSize: v.size,
            price: v.salePrice ?? v.price,
            quantity: Math.floor(Math.random() * 2) + 1,
          })),
        },
      },
    });

    created++;
    process.stdout.write(`\r  Created ${created}/${ORDER_COUNT} orders…`);
  }

  console.log(`\nDone. ${created} orders seeded.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
