import { motion } from "motion/react";

const conclusions = [
  {
    number: "01",
    text: "Great ideas stick. They can stay with us for years, quietly shaping our creative path.",
  },
  {
    number: "02",
    text: "Great technology amplifies those ideas and unlocks new ways to express them.",
  },
];

const ConclusionsSlide = ({ step }: { step: number }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="w-full max-w-lg flex flex-col gap-8">
      <div className="flex gap-4">
        <span className="text-base invisible">01</span>
        <span className="text-muted text-lg uppercase tracking-[0.15em]">Conclusions</span>
      </div>

      <div className="flex flex-col gap-6">
        {conclusions.map((item, i) => (
          <motion.div
            key={item.number}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: step > i ? 1 : 0,
              y: step > i ? 0 : 10,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex gap-4"
          >
            <span className="text-muted text-base">{item.number}</span>
            <p className="text-primary text-base">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export const slides = [
  { slide: { component: ConclusionsSlide, steps: 2 }, title: "Conclusions" },
];
