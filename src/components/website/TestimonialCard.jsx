import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

const TestimonialCard = ({ testimonial, index = 0 }) => {
  const rating = Math.min(5, Math.max(0, Number(testimonial.rating || 0)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="flex h-full flex-col rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 ring-1 ring-cyan-400/20">
            <Quote className="h-5 w-5 text-cyan-400" />
          </div>

          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="mb-5 overflow-hidden text-sm leading-6 text-slate-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
          "{testimonial.review}"
        </p>

        <div className="mt-auto flex items-center gap-3 border-t border-slate-800 pt-4">
          <img
            src={testimonial.photo}
            alt={testimonial.clientName}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-800"
          />
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-slate-100">
              {testimonial.clientName}
            </h4>
            <p className="truncate text-xs text-slate-500">
              {testimonial.designation}
            </p>
            {testimonial.company && (
              <p className="truncate text-xs font-medium text-cyan-400">
                {testimonial.company}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
