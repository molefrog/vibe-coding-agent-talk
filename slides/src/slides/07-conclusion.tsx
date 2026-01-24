import { motion, AnimatePresence } from "motion/react";

// Takeaways data
const takeaways = [
  {
    number: "01",
    title: "Learn how agents work",
    subtitle: "We'll all be using them — understanding makes you a better engineer.",
  },
  {
    number: "02",
    title: "The gap is not models — it's tools",
    subtitle: "Better tools = better results.",
  },
  {
    number: "03",
    title: "Choose boring technology",
    subtitle: "Simple, straightforward tools that models understand well.",
  },
];

const TakeawaysSlide = ({ step }: { step: number }) => {
  const current = takeaways[step - 1];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-xl h-32 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="text-center"
          >
            <div className="text-orange text-sm font-semibold uppercase tracking-[0.15em] mb-4">
              {current.number}
            </div>
            <p className="text-2xl text-light mb-3">{current.title}</p>
            <p className="text-gray text-base">{current.subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Contact links
const contactLinks = [
  { label: "Website", url: "molefrog.com", href: "https://molefrog.com" },
  { label: "GitHub", url: "github.com/molefrog", href: "https://github.com/molefrog" },
  { label: "LinkedIn", url: "linkedin.com/in/molefrog", href: "https://linkedin.com/in/molefrog" },
  { label: "X", url: "@mlfrg", href: "https://x.com/mlfrg" },
];

const FinalSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="flex flex-col w-full max-w-md">
      {/* Title row */}
      <div className="py-4 border-b border-gray/20">
        <h2 className="text-2xl font-medium text-light uppercase tracking-relaxed mb-12">
          Let's Build a Vibe-Coding Agent!
        </h2>
        <p className="text-gray text-base mt-1">
          Alexey Taktarov
        </p>
      </div>

      {/* Links */}
      {contactLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between py-3 border-b border-gray/20 hover:border-orange transition-colors group"
        >
          <span className="text-gray text-sm uppercase tracking-wider">{link.label}</span>
          <span className="text-orange">{link.url}</span>
        </a>
      ))}
    </div>
  </div>
);

export const slides = [
  { slide: { component: TakeawaysSlide, steps: 3 }, title: "Takeaways" },
  { slide: <FinalSlide key="final" />, title: "Thanks" },
];
