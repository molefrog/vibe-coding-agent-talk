import { useState } from "react";
import { motion } from "motion/react";

const FicusSlide = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      onClick={() => expanded && setExpanded(false)}
    >
      {!expanded ? (
        <motion.button
          layoutId="ficus-container"
          className="bg-border px-6 py-3 rounded-sm"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-muted">⚡</span>
            Open Ficus
          </motion.span>
        </motion.button>
      ) : (
        <motion.div
          layoutId="ficus-container"
          className="fixed top-8 left-8 right-8 bottom-22 bg-border rounded-sm shadow-fullscreen overflow-hidden"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.iframe
            src="https://ficus.io/"
            className="w-full h-full border-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
        </motion.div>
      )}
    </div>
  );
};

export const slides = [
  { slide: <FicusSlide key="ficus" />, title: "Ficus — Real-time Interactive Experiences" },
];
