import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "motion/react";
import {
  allSlides,
  isSteppedSlide,
  getSlideSteps,
  getChapterForSlide,
  unwrapSlide,
} from "./slides";

// Parse URL: "3" -> { slide: 3, step: 1 }, "3-2" -> { slide: 3, step: 2 }
function parseSlideUrl(param: string): { slide: number; step: number } {
  const parts = param.split("-");
  const slide = parseInt(parts[0]) || 1;
  const step = parts[1] ? parseInt(parts[1]) || 1 : 1;
  return { slide, step };
}

// Build URL: slide 3 with 1 step -> "3", slide 3 step 2 -> "3-2"
function buildSlideUrl(slideNum: number, step: number, totalSteps: number): string {
  if (totalSteps === 1) {
    return `/${slideNum}`;
  }
  return `/${slideNum}-${step}`;
}

export default function App() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/:slide");

  // Parse current location
  const { slide: slideNum, step } = match ? parseSlideUrl(params.slide) : { slide: 1, step: 1 };

  const slideIndex = Math.max(0, Math.min(slideNum - 1, allSlides.length - 1));
  const currentSlide = allSlides[slideIndex];
  const totalSteps = getSlideSteps(currentSlide);
  const currentStep = Math.max(1, Math.min(step, totalSteps));

  // Redirect to /1 if no slide specified
  useEffect(() => {
    if (!match) {
      setLocation("/1", { replace: true });
    }
  }, [match, setLocation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        // Next step or next slide
        if (currentStep < totalSteps) {
          // Go to next step
          setLocation(buildSlideUrl(slideNum, currentStep + 1, totalSteps));
        } else if (slideIndex < allSlides.length - 1) {
          // Go to next slide
          const nextSlide = allSlides[slideIndex + 1];
          const nextSteps = getSlideSteps(nextSlide);
          setLocation(buildSlideUrl(slideNum + 1, 1, nextSteps));
        }
      } else if (e.key === "ArrowLeft") {
        // Previous step or previous slide
        if (currentStep > 1) {
          // Go to previous step
          setLocation(buildSlideUrl(slideNum, currentStep - 1, totalSteps));
        } else if (slideIndex > 0) {
          // Go to previous slide (last step)
          const prevSlide = allSlides[slideIndex - 1];
          const prevSteps = getSlideSteps(prevSlide);
          setLocation(buildSlideUrl(slideNum - 1, prevSteps, prevSteps));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slideIndex, slideNum, currentStep, totalSteps, setLocation]);

  // Render slide (unwrap titled slides first)
  const renderSlide = () => {
    const slide = unwrapSlide(currentSlide);

    if (typeof slide === "string") {
      return <pre className="text-xl whitespace-pre-wrap text-center max-w-5xl">{slide}</pre>;
    }

    if (isSteppedSlide(slide)) {
      const Component = slide.component;
      return (
        <div className="w-full max-w-6xl">
          <Component step={currentStep} />
        </div>
      );
    }

    // Regular ReactNode
    return <div className="w-full max-w-6xl">{slide}</div>;
  };

  // Format slide number for display
  const displayNumber = totalSteps > 1 ? `${slideNum}-${currentStep}` : `${slideNum}`;
  const { chapter, title } = getChapterForSlide(slideIndex);

  // Build chapter display: "Chapter: Title" or just "Chapter" or just "Title"
  const chapterDisplay = chapter && title ? `${chapter}: ${title}` : chapter || title;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-16">
      {renderSlide()}
      <div className="fixed bottom-6 left-8 h-8 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {chapterDisplay && (
            <motion.div
              key={chapterDisplay}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="text-xl text-primary uppercase tracking-[0.12em] bg-bg px-2 py-1 -mx-2 -my-1 rounded-sm"
            >
              {chapterDisplay}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="fixed bottom-6 right-6 text-base text-muted bg-bg px-2 py-1 rounded-sm">
        {displayNumber} / {allSlides.length}
      </div>
    </div>
  );
}
