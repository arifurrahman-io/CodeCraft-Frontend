import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

const TestimonialCard = ({ testimonial, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="h-full glass rounded-2xl p-6 border border-slate-700/50">
        {/* Quote Icon */}
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
          <Quote className="w-6 h-6 text-cyan-500" />
        </div>

        {/* Content */}
        <p className="text-slate-300 mb-6 italic">"{testimonial.review}"</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-slate-600"
              }`}
            />
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center gap-4">
          <img
            src={testimonial.photo}
            alt={testimonial.clientName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="text-base font-semibold text-slate-100">
              {testimonial.clientName}
            </h4>
            <p className="text-sm text-slate-500">{testimonial.designation}</p>
            <p className="text-sm text-cyan-500">{testimonial.company}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
