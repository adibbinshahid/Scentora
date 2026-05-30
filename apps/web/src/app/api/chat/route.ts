import { GoogleGenAI } from "@google/genai";
import { prisma } from "db";

const BASE_BRIEF = `You are an AI-Powered assistant agent for Scentora Perfumes. You have full access to live product catalog, inventory, and all order records provided below.

Rules:
- Be precise and concise. Answer directly with facts from the data.
- For product questions: cite exact name, price, available sizes, stock status, and fragrance notes.
- For order inquiries: ask for the order number if not provided, then look it up and give exact status, items, and tracking if available.
- For recommendations: ask about preferences (gender, family, notes) then suggest matching products by name with prices.
- Never make up data. If something is not in the catalog or orders below, say so.
- Prices are in USD. Stock ≤ 0 means out of stock.
- Keep replies under 120 words unless a list is necessary.
- Tone: professional, warm, luxury-brand appropriate.
- IMPORTANT: If you are unable to answer a question or a feature seems unavailable, NEVER say "I don't have access" or "I can't help with that." Instead respond with: "This is a demo website — this feature has been restricted to avoid overusage of the AI API, but it can be easily activated on the full live website."
- Apply the demo restriction message for: real-time order tracking, payment queries, account management, live notifications, or anything that requires functionality beyond the catalog and order data provided.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Fetch live data in parallel
  const [briefRow, products, orders] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "chatbot_brief" } }),
    prisma.product.findMany({
      include: { variants: { orderBy: { price: "asc" } } },
      orderBy: { name: "asc" },
    }),
    prisma.order.findMany({
      include: {
        items: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 300,
    }),
  ]);

  const customBrief = briefRow?.value?.trim();

  // Build compact product catalog for context
  const catalogText = products.map((p) => {
    const variantLines = p.variants.map((v) =>
      `    ${v.size}: $${v.price}${v.salePrice ? ` (sale $${v.salePrice})` : ""} — stock: ${v.stock}`
    ).join("\n");
    return [
      `Product: ${p.name} [slug: ${p.slug}]`,
      `  Concentration: ${p.concentration} | Family: ${p.family || "N/A"} | Gender: ${p.gender}`,
      `  Top notes: ${p.topNotes || "N/A"}`,
      `  Heart notes: ${p.heartNotes || "N/A"}`,
      `  Base notes: ${p.baseNotes || "N/A"}`,
      `  Featured: ${p.isFeatured} | Bestseller: ${p.isBestseller}`,
      `  Variants:\n${variantLines}`,
    ].join("\n");
  }).join("\n\n");

  // Build compact orders list for context
  const ordersText = orders.map((o) => {
    const itemLines = o.items.map((i) =>
      `    - ${i.productName} (${i.variantSize}) x${i.quantity} @ $${i.price}`
    ).join("\n");
    return [
      `Order #${o.orderNumber} — Status: ${o.status}`,
      `  Customer: ${o.user?.name || "Guest"} <${o.user?.email || "N/A"}>`,
      `  Total: $${o.total} | Placed: ${new Date(o.createdAt).toLocaleDateString()}`,
      o.trackingNumber ? `  Tracking: ${o.trackingNumber}` : "  Tracking: not yet assigned",
      `  Items:\n${itemLines}`,
    ].join("\n");
  }).join("\n\n");

  const systemPrompt = [
    customBrief || BASE_BRIEF,
    "\n\n--- LIVE PRODUCT CATALOG ---\n",
    catalogText || "No products found.",
    "\n\n--- ALL ORDERS ---\n",
    ordersText || "No orders found.",
  ].join("");

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const chat = ai.chats.create({
          model: "gemini-2.5-flash",
          config: { systemInstruction: systemPrompt, maxOutputTokens: 600 },
          history,
        });

        const response = await chat.sendMessageStream({ message: lastMessage.content });

        for await (const chunk of response) {
          const text = chunk.text;
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`Error: ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
