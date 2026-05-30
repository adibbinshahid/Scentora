import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  customerName: string;
  isVerified: boolean;
  createdAt: Date;
}

interface Props {
  reviews: Review[];
  productId: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= rating ? "text-gold-primary fill-gold-primary" : "text-text-muted"}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection({ reviews }: Props) {
  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="py-16 border-t border-border-primary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="block text-[10px] tracking-[0.4em] uppercase text-gold-primary mb-2">
              Client Reviews
            </span>
            <h2
              className="font-display font-light text-3xl sm:text-4xl text-text-primary"
              style={{ letterSpacing: "0.06em" }}
            >
              What Our Clients Say
            </h2>
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <Stars rating={Math.round(avg)} />
              <span className="text-2xl font-display text-text-primary">
                {avg.toFixed(1)}
              </span>
              <span className="text-sm text-text-muted">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-text-muted text-sm">No reviews yet. Be the first.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((review) => (
              <div key={review.id} className="glass-panel p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-text-primary font-medium">
                      {review.customerName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Stars rating={review.rating} />
                      {review.isVerified && (
                        <span className="text-[9px] tracking-[0.15em] uppercase text-green-400">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-text-muted shrink-0">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
