import { parseJsonArray } from "@/lib/utils";

interface Props {
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
}

const TIERS = [
  {
    key: "top" as const,
    label: "Top Notes",
    sub: "First impression · 15–30 min",
    width: "60%",
    color: "text-gold-light",
  },
  {
    key: "heart" as const,
    label: "Heart Notes",
    sub: "Soul of the fragrance · 2–4 hrs",
    width: "80%",
    color: "text-gold-primary",
  },
  {
    key: "base" as const,
    label: "Base Notes",
    sub: "Lasting memory · 6–12 hrs",
    width: "100%",
    color: "text-gold-muted",
  },
];

export default function FragranceNotes({ topNotes, heartNotes, baseNotes }: Props) {
  const notes = {
    top: parseJsonArray(topNotes),
    heart: parseJsonArray(heartNotes),
    base: parseJsonArray(baseNotes),
  };

  return (
    <section className="py-16 border-t border-border-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <span className="block text-[10px] tracking-[0.4em] uppercase text-gold-primary mb-2">
            Composition
          </span>
          <h2
            className="font-display font-light text-3xl sm:text-4xl text-text-primary"
            style={{ letterSpacing: "0.06em" }}
          >
            Fragrance Notes
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Pyramid */}
          <div className="lg:w-1/2 flex flex-col items-center gap-0">
            {TIERS.map(({ key, label, sub, width, color }) => (
              <div
                key={key}
                className="flex flex-col items-center py-6 border-b border-border-primary last:border-b-0"
                style={{ width }}
              >
                <p className={`text-[10px] tracking-[0.3em] uppercase mb-1 ${color}`}>
                  {label}
                </p>
                <p className="text-[10px] text-text-muted mb-3">{sub}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {notes[key].map((note) => (
                    <span
                      key={note}
                      className="text-xs px-3 py-1 border border-border-primary text-text-secondary"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Note list */}
          <div className="lg:w-1/2 space-y-8">
            {TIERS.map(({ key, label, color }) => (
              <div key={key}>
                <p className={`text-[10px] tracking-[0.3em] uppercase mb-3 ${color}`}>
                  {label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {notes[key].map((note) => (
                    <span
                      key={note}
                      className="glass-panel px-4 py-2 text-sm text-text-secondary"
                      style={{ borderRadius: "2px" }}
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
