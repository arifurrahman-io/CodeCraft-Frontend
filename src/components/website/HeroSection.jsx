import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import { COMPANY } from '@/utils/constants';
import { getSettings } from '@/services/settingsService';

const HeroSection = ({
  title = 'Building Digital Excellence',
  subtitle = 'We craft premium software solutions that transform businesses',
  description = 'From web applications to mobile apps, we bring your digital vision to life with cutting-edge technology and innovative solutions.',
  ctaText = 'Get Started',
  ctaLink = '/contact',
  secondaryCtaText = 'View Our Work',
  secondaryCtaLink = '/projects',
  features = [
    'Expert Development Team',
    'Modern Technology Stack',
    'On-time Delivery',
    'Post-project Support',
  ],
}) => {
  const [company, setCompany] = useState(COMPANY);

  useEffect(() => {
    getSettings().then((response) => {
      if (response.data?.company) setCompany(response.data.company);
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }} />
        </div>

        {/* Glow Effects */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        
        {/* Radial Gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/10 to-transparent rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-sm text-cyan-400">Available for new projects</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 leading-tight mb-6">
              {title}
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {company.name}
                </span>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-4">
              {subtitle}
            </p>

            <p className="text-slate-400 mb-8 max-w-xl">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to={ctaLink}>
                <Button size="lg" icon={ArrowRight} iconPosition="right">
                  {ctaText}
                </Button>
              </Link>
              <Link to={secondaryCtaLink}>
                <Button variant="outline" size="lg">
                  {secondaryCtaText}
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Code Block Visual */}
              <div className="glass rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex">
                    <span className="text-slate-500 w-6">1</span>
                    <span className="text-purple-400">const</span>
                    <span className="text-slate-100"> </span>
                    <span className="text-cyan-400">createSolution</span>
                    <span className="text-slate-100"> = </span>
                    <span className="text-yellow-400">async</span>
                    <span className="text-slate-100"> () ={'>'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-6">2</span>
                    <span className="text-slate-100"> </span>
                    <span className="text-purple-400">await</span>
                    <span className="text-slate-100"> </span>
                    <span className="text-cyan-400">build</span>
                    <span className="text-slate-100">(</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-6">3</span>
                    <span className="text-slate-100"> </span>
                    <span className="text-slate-100"> </span>
                    <span className="text-green-400">'web-app'</span>
                    <span className="text-slate-100">, </span>
                    <span className="text-green-400">'mobile-app'</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-6">4</span>
                    <span className="text-slate-100"> </span>
                    <span className="text-slate-100"> </span>
                    <span className="text-green-400">'saas-product'</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-6">5</span>
                    <span className="text-slate-100"> </span>
                    <span className="text-purple-400">await</span>
                    <span className="text-slate-100"> </span>
                    <span className="text-cyan-400">deliver</span>
                    <span className="text-slate-100">(</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-6">6</span>
                    <span className="text-slate-100"> </span>
                    <span className="text-slate-100"> </span>
                    <span className="text-purple-400">true</span>
                    <span className="text-slate-100">);</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-6">7</span>
                    <span className="text-slate-100">{"};"}</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 glass rounded-xl p-4 border border-slate-700/50 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 text-xl">✓</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Project Delivered</p>
                    <p className="text-xs text-slate-500">On-time</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 glass rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-cyan-500 text-xl">⚡</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">50+ Projects</p>
                    <p className="text-xs text-slate-500">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-slate-500 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
