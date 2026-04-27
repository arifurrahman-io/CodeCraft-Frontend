import { motion } from "framer-motion";
import { TECH_STACK } from "@/utils/constants";

const TechStackSection = () => {
  return (
    <section className="py-16 md:py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Our <span className="text-cyan-500">Tech Stack</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We use modern, battle-tested technologies to build scalable and
            performant applications
          </p>
        </motion.div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {TECH_STACK.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                  <span className="text-2xl">
                    {tech.icon === "react" && "⚛️"}
                    {tech.icon === "vue" && "💚"}
                    {tech.icon === "angular" && "🅰️"}
                    {tech.icon === "nodejs" && "🟢"}
                    {tech.icon === "python" && "🐍"}
                    {tech.icon === "typescript" && "🔷"}
                    {tech.icon === "mongodb" && "🍃"}
                    {tech.icon === "postgresql" && "🐘"}
                    {tech.icon === "aws" && "☁️"}
                    {tech.icon === "docker" && "🐳"}
                    {tech.icon === "kubernetes" && "☸️"}
                    {tech.icon === "graphql" && "◼️"}
                  </span>
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-100 transition-colors">
                  {tech.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
