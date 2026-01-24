import { motion } from "motion/react";
import { Highlight } from "../components";
import v0Img from "../../imgs/v0.png";
import lovableImg from "../../imgs/lovable.png";
import boltImg from "../../imgs/bolt.png";
import hackersBg from "../../imgs/hackers-2.webp";

const TitleSlide = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    {/* Background image */}
    <img
      src={hackersBg}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />
    {/* Overlay for better text readability */}
    <div className="absolute inset-0 bg-bg/60" />

    {/* Content */}
    <div
      className="relative z-10 text-center"
      style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)" }}
    >
      <h1 className="text-5xl font-semibold text-light tracking-tight mb-6">
        Let's Build a Vibe-Coding Agent!
      </h1>
      <p className="text-xl text-light mb-2">
        <a
          href="https://molefrog.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange hover:underline"
        >
          Alexey Taktarov →
        </a>
      </p>
      <p className="text-xl text-light">CopenhagenJS · Jan 22, 2026 · Famly</p>
    </div>
  </div>
);

// Text-based tool card (for CLI tools like Claude Code, Cursor)
const ToolCard = ({ name, lines }: { name: string; lines: string[] }) => (
  <div className="flex flex-col gap-3">
    <div className="bg-dark-gray rounded-sm aspect-[4/3] flex items-center justify-center p-4">
      <div className="text-light font-mono text-sm leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre">{line}</div>
        ))}
      </div>
    </div>
    <div className="text-light text-base font-medium text-center uppercase tracking-[0.1em]">
      {name}
    </div>
  </div>
);

// Image-based tool card (for GUI tools like v0, Lovable)
const ImageToolCard = ({ name, src, url }: { name: string; src: string; url?: string }) => {
  const content = (
    <motion.div
      className="flex flex-col gap-3"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="bg-dark-gray rounded-sm aspect-[4/3] overflow-hidden">
        <img src={src} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="text-light text-base font-medium text-center uppercase tracking-[0.1em]">
        {name}
      </div>
    </motion.div>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
        {content}
      </a>
    );
  }

  return content;
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  }),
};

const ToolsSlide = () => (
  <div className="flex flex-col gap-8 items-center justify-center h-full">
    <motion.h2
      className="text-2xl font-medium text-center text-light uppercase tracking-[0.2em]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      You've probably used or heard of
    </motion.h2>

    <div className="grid grid-cols-4 gap-5 w-full max-w-5xl">
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
        <ToolCard
          name="Claude Code / Cursor / Codex"
          lines={["$ claude", "", "> Fix the bug", "  in auth.ts"]}
        />
      </motion.div>
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
        <ImageToolCard name="Bolt" src={boltImg} url="https://bolt.new" />
      </motion.div>
      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
        <ImageToolCard name="v0" src={v0Img} url="https://v0.dev" />
      </motion.div>
      <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
        <ImageToolCard name="Lovable" src={lovableImg} url="https://lovable.dev" />
      </motion.div>
    </div>
  </div>
);

const Card = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="px-5 py-7 rounded-sm bg-light h-full">
    <div className="text-base mb-2 font-semibold text-orange tracking-[0.1em]">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-bg uppercase tracking-[0.08em]">
      {title}
    </h3>
    <p className="text-lg text-dark-gray text-pretty">
      {description}
    </p>
  </div>
);

const WhatWeBuildSlide = ({ step }: { step: number }) => (
  <div className="flex flex-col gap-8 items-center justify-center h-full">
    <h2 className="text-2xl font-medium text-center text-light uppercase tracking-[0.2em]">
      What we need to build
    </h2>

    <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full max-w-3xl">
      <Highlight active={step >= 1} className="h-full">
        <Card number="01" title="Agent" description="The brain — LLM + tools" />
      </Highlight>
      <Highlight active={step >= 2} className="h-full">
        <Card number="02" title="File System" description="Where we store the code" />
      </Highlight>
      <Highlight active={step >= 3} className="h-full">
        <Card number="03" title="Build + Preview" description="How we show the result to user" />
      </Highlight>
      <Highlight active={step >= 4} className="h-full">
        <Card number="04" title="Feedback" description="How agent knows something is wrong" />
      </Highlight>
    </div>
  </div>
);

export const slides = [
  <TitleSlide key="title" />,

  <ToolsSlide key="tools" />,

  <div className="text-4xl font-semibold text-light uppercase tracking-[0.15em]">
    Let's build our own one.
  </div>,

  { slide: { component: WhatWeBuildSlide, steps: 4 }, title: "Anatomy of a Vibe-Coding Agent" },
];
