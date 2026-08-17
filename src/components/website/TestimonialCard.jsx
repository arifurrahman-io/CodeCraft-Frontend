import { Star } from "lucide-react";
import { motion } from "framer-motion";

const TestimonialCard = ({ testimonial, index = 0 }) => {
  const rating = Math.min(5, Math.max(0, Number(testimonial.rating || 0)));

  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="h-full flex flex-col border-t-2 border-border pt-7"
    >
      <div className="flex items-center gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < rating
                ? "fill-amber-400 text-amber-400"
                : "text-border-strong"
            }`}
          />
        ))}
      </div>

      <p className="text-ink leading-relaxed mb-6 flex-1 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5] overflow-hidden">
        &ldquo;{testimonial.review}&rdquo;
      </p>

      <footer className="flex items-center gap-3 mt-auto">
        {testimonial.photo && (
          <img
            src={testimonial.photo}
            alt=""
            className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
          />
        )}
        <div className="min-w-0">
          <cite className="not-italic block text-sm font-semibold text-ink truncate">
            {testimonial.clientName}
          </cite>
          <p className="truncate text-xs text-ink-muted">
            {[testimonial.designation, testimonial.company]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </footer>
    </motion.blockquote>
  );
};

export default TestimonialCard;
