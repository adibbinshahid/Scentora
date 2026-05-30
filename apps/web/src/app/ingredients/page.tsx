import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import { getSiteContent } from "@/lib/content";
import { c } from "@/lib/content-helpers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ingredients",
  description: "Rare, responsibly sourced ingredients at the heart of every Scentora fragrance.",
};

const INGREDIENTS = [
  {
    name: "Oud",
    origin: "Laos & Cambodia",
    family: "Woody Oriental",
    desc: "Extracted from the resinous heartwood of Aquilaria trees, oud is among the rarest and most prized raw materials in perfumery. Its deep, smoky, and animalic warmth forms the backbone of our most opulent creations.",
    note: "Base note",
    color: "rgba(201,168,76,0.15)",
    border: "rgba(201,168,76,0.25)",
  },
  {
    name: "Rose de Mai",
    origin: "Grasse, France",
    family: "Floral",
    desc: "Harvested by hand during a narrow window each May in the fields of Grasse, Rose de Mai absolute is honeyed, lush, and infinitely complex. Fewer than 300 kilograms are produced globally each year.",
    note: "Heart note",
    color: "rgba(180,60,80,0.10)",
    border: "rgba(180,60,80,0.20)",
  },
  {
    name: "Ambergris",
    origin: "Atlantic Ocean",
    family: "Animalic Marine",
    desc: "A rare ocean-derived substance that forms naturally over decades. Ambergris lends an extraordinary depth, warmth, and fixative quality — elongating the life of a fragrance on skin like no synthetic can replicate.",
    note: "Base note",
    color: "rgba(140,120,80,0.10)",
    border: "rgba(140,120,80,0.20)",
  },
  {
    name: "Jasmine Sambac",
    origin: "India",
    family: "Floral",
    desc: "Richer and more indolic than its European cousin, Jasmine Sambac blooms only at night and must be harvested before dawn. Its white floral signature carries a distinctive animalic undertone that gives depth to any heart accord.",
    note: "Heart note",
    color: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.12)",
  },
  {
    name: "Vetiver",
    origin: "Haiti",
    family: "Woody Earthy",
    desc: "Steam-distilled from the roots of a wild grass grown in Haitian soil, vetiver is smoky, woody, and grounding. Haitian vetiver is considered the finest in the world for its dry, almost rum-like earthiness.",
    note: "Base note",
    color: "rgba(40,80,30,0.10)",
    border: "rgba(40,80,30,0.20)",
  },
  {
    name: "Iris Pallida",
    origin: "Tuscany, Italy",
    family: "Powdery Floral",
    desc: "The rhizomes of Iris Pallida must be aged for three years before extraction. The resulting orris butter is buttery, violet-like, and carrot-powdery — one of the most expensive natural ingredients in perfumery by weight.",
    note: "Heart note",
    color: "rgba(80,40,140,0.10)",
    border: "rgba(80,40,140,0.20)",
  },
  {
    name: "Sandalwood",
    origin: "Mysore, India",
    family: "Creamy Woody",
    desc: "Mysore sandalwood is the gold standard — creamy, milky, and softly sweet. Our sourcing partners harvest only from trees of legal maturity under CITES regulations, ensuring sustainability and exceptional quality.",
    note: "Base note",
    color: "rgba(180,140,80,0.10)",
    border: "rgba(180,140,80,0.20)",
  },
  {
    name: "Bergamot",
    origin: "Calabria, Italy",
    family: "Citrus Aromatic",
    desc: "Cold-pressed from the rind of a small citrus fruit grown exclusively in Calabria, Italy, bergamot is the essential top-note signature of classical perfumery — bright, floral, and slightly bitter-sweet.",
    note: "Top note",
    color: "rgba(80,120,40,0.10)",
    border: "rgba(80,120,40,0.20)",
  },
];

export default async function IngredientsPage() {
  const content = await getSiteContent();

  return (
    <>
      <NavbarServer />
      <main className="min-h-screen pt-28 pb-24 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Hero header */}
          <div className="mb-16 text-center">
            <p className="text-[9px] tracking-[0.35em] uppercase text-gold-primary mb-4">Our Craft</p>
            <h1
              className="font-display font-light text-4xl sm:text-5xl text-text-primary mb-5"
              style={{ letterSpacing: "0.06em" }}
            >
              Rare Ingredients
            </h1>
            <p className="text-[14px] text-text-muted max-w-lg mx-auto leading-relaxed">
              Every Scentora fragrance begins with the finest raw materials on earth — sourced ethically, handled with precision, blended with intention.
            </p>
            <div className="mt-8 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.40), transparent)" }} />
          </div>

          {/* Sourcing badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {["Ethically Sourced", "CITES Compliant", "No Synthetics Shortcuts", "Small-Batch Extraction"].map((badge) => (
              <span
                key={badge}
                className="text-[9px] tracking-[0.18em] uppercase px-4 py-2 rounded-full"
                style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.20)", color: "rgba(201,168,76,0.85)" }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Ingredient grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INGREDIENTS.map((ing, i) => (
              <div
                key={ing.name}
                className="group relative rounded-2xl p-6 flex flex-col"
                style={{
                  background: ing.color,
                  border: `1px solid ${ing.border}`,
                  transition: "border-color 0.3s",
                }}
              >
                {/* Note badge */}
                <span
                  className="self-start text-[8px] tracking-[0.20em] uppercase px-2.5 py-1 rounded-full mb-4"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.40)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {ing.note}
                </span>

                <h2 className="font-display text-[19px] text-text-primary mb-1" style={{ letterSpacing: "0.04em" }}>
                  {ing.name}
                </h2>
                <p className="text-[9px] tracking-[0.18em] uppercase text-gold-primary mb-4">
                  {ing.origin}
                </p>
                <p className="text-[11.5px] text-text-muted leading-relaxed flex-1">
                  {ing.desc}
                </p>

                <div
                  className="mt-5 pt-4 flex items-center gap-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: ing.border }}
                  />
                  <span className="text-[9px] tracking-[0.14em] uppercase text-text-muted">{ing.family}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Philosophy block */}
          <div
            className="mt-16 p-10 rounded-2xl text-center"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.07) 0%, transparent 60%)",
              border: "1px solid rgba(201,168,76,0.18)",
            }}
          >
            <h2 className="font-display font-light text-2xl text-text-primary mb-4" style={{ letterSpacing: "0.06em" }}>
              Our Philosophy
            </h2>
            <p className="text-[13px] text-text-muted max-w-xl mx-auto leading-relaxed">
              {c(content, "about_ingredient_philosophy",
                "We believe luxury has a responsibility. Every ingredient in our collection is traceable, harvested within legal and ecological limits, and sourced from partners who share our commitment to the land and the people who tend it."
              )}
            </p>
          </div>
        </div>
      </main>
      <FooterServer />
    </>
  );
}
