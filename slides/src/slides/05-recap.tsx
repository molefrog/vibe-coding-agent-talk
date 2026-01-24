import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// All tools the agent uses
const fileTools = [
  { id: "ls", name: "ls" },
  { id: "read_file", name: "read_file" },
  { id: "write_file", name: "write_file" },
  { id: "edit_file", name: "edit_file" },
  { id: "bundle", name: "bundle" },
];

const feedbackTools = [
  { id: "getConsoleLogs", name: "getConsoleLogs" },
  { id: "takeScreenshot", name: "takeScreenshot" },
];

// Simulated agent workflow sequence
const agentSequence = [
  "ls",
  "read_file",
  "write_file",
  "bundle",
  "getConsoleLogs",
  "edit_file",
  "bundle",
  "done", // message + pause
];

const ToolBox = ({
  name,
  isActive,
}: {
  name: string;
  isActive: boolean;
}) => (
  <motion.div
    className={`w-full px-5 py-3 rounded-sm border transition-colors duration-200 ${
      isActive
        ? "bg-dark-gray border-orange"
        : "bg-dark-gray/30 border-gray/20"
    }`}
    animate={{ opacity: isActive ? 1 : 0.3 }}
    transition={{ duration: 0.2 }}
  >
    <div className={`text-base font-mono ${isActive ? "text-orange" : "text-gray"}`}>
      {name}
    </div>
  </motion.div>
);

const AgentRecapSlide = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const currentTool = agentSequence[stepIndex];
  const showMessage = currentTool === "done";

  useEffect(() => {
    const isDone = agentSequence[stepIndex] === "done";
    const delay = isDone ? 3000 : 1200; // longer pause on "done"

    const timeout = setTimeout(() => {
      setStepIndex((i) => (i + 1) % agentSequence.length);
    }, delay);

    return () => clearTimeout(timeout);
  }, [stepIndex]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {/* Agent block */}
      <div className="bg-orange text-bg px-10 py-5 rounded-sm">
        <div className="text-2xl font-semibold uppercase tracking-[0.15em]">Agent</div>
      </div>

      {/* Arrow */}
      <div className="text-gray text-3xl">↓</div>

      {/* Tools grid */}
      <div className="flex gap-16">
        {/* File tools */}
        <div className="flex flex-col gap-2 w-48">
          <div className="text-orange text-sm font-semibold uppercase tracking-[0.15em] mb-2">
            File System
          </div>
          {fileTools.map((tool) => (
            <ToolBox
              key={tool.id}
              name={tool.name}
              isActive={currentTool === tool.id}
            />
          ))}
        </div>

        {/* Feedback tools */}
        <div className="flex flex-col gap-2 w-48">
          <div className="text-orange text-sm font-semibold uppercase tracking-[0.15em] mb-2">
            Feedback
          </div>
          {feedbackTools.map((tool) => (
            <ToolBox
              key={tool.id}
              name={tool.name}
              isActive={currentTool === tool.id}
            />
          ))}
        </div>
      </div>

      {/* Success message */}
      <div className="h-12 flex items-center">
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-gray px-6 py-3 rounded-sm"
            >
              <span className="text-light text-base">
                ✓ I've successfully built and deployed the project!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Screenshot tool animation sequence
const screenshotSteps = [
  "files",      // Show bundled files
  "browser",    // Browser window appears
  "render",     // Content renders inside
  "flash",      // Screenshot flash
  "capture",    // Image captured
  "send",       // Send to agent
  "done",       // Pause
];

const ScreenshotToolSlide = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const step = screenshotSteps[stepIndex];

  useEffect(() => {
    const delays: Record<string, number> = {
      files: 1500,
      browser: 1200,
      render: 1500,
      flash: 400,
      capture: 1200,
      send: 1500,
      done: 2000,
    };

    const timeout = setTimeout(() => {
      setStepIndex((i) => (i + 1) % screenshotSteps.length);
    }, delays[step]);

    return () => clearTimeout(timeout);
  }, [stepIndex, step]);

  const showFiles = stepIndex >= 0;
  const showBrowser = stepIndex >= 1;
  const showContent = stepIndex >= 2;
  const showFlash = step === "flash";
  const showCapture = stepIndex >= 4;
  const showSend = stepIndex >= 5;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-medium text-light uppercase tracking-[0.15em] mb-8">
        Screenshot Tool
      </h2>

      <div className="flex items-center gap-8">
        {/* Agent */}
        <motion.div
          className="flex flex-col items-center gap-3"
          animate={{ opacity: 1 }}
        >
          <div className="bg-orange text-bg px-6 py-3 rounded-sm">
            <div className="text-lg font-semibold uppercase tracking-[0.1em]">Agent</div>
          </div>

          {/* Bundled files */}
          <AnimatePresence>
            {showFiles && !showBrowser && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex flex-col gap-1 mt-2"
              >
                <div className="text-xs text-gray font-mono">index.html</div>
                <div className="text-xs text-gray font-mono">bundle.js</div>
                <div className="text-xs text-gray font-mono">styles.css</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Arrow to browser */}
        <motion.div
          className="text-gray text-2xl"
          animate={{ opacity: showBrowser ? 1 : 0.3 }}
        >
          →
        </motion.div>

        {/* Browser window */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: showBrowser ? 1 : 0,
            scale: showBrowser ? 1 : 0.9,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Browser chrome */}
          <div className="w-64 border border-gray/30 rounded-sm overflow-hidden bg-dark-gray">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray/10 border-b border-gray/20">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-gray/60">localhost:3000</span>
              </div>
            </div>

            {/* Browser content */}
            <div className="h-36 p-4 flex items-center justify-center relative">
              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <div className="text-light text-sm mb-2">🐱</div>
                    <div className="text-xs text-gray">Cat Tracker</div>
                    <div className="mt-2 w-20 h-2 bg-orange/30 rounded-full mx-auto" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Flash overlay */}
              <AnimatePresence>
                {showFlash && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 bg-white"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Captured image indicator */}
          <AnimatePresence>
            {showCapture && !showSend && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2"
              >
                <div className="text-orange text-xs font-mono">📷 captured!</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Arrow back to agent */}
        <motion.div
          className="text-gray text-2xl"
          animate={{ opacity: showSend ? 1 : 0.3 }}
        >
          →
        </motion.div>

        {/* Screenshot result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: showSend ? 1 : 0,
            scale: showSend ? 1 : 0.9,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-20 h-14 border-2 border-orange/50 rounded-sm bg-dark-gray flex items-center justify-center">
            <span className="text-xs text-gray">PNG</span>
          </div>
          <div className="text-xs text-orange font-mono">base64</div>
        </motion.div>
      </div>

      {/* Step indicator */}
      <div className="mt-10 text-sm text-gray/50">
        {step === "files" && "Agent has bundled files..."}
        {step === "browser" && "Opening in headless browser..."}
        {step === "render" && "Rendering the app..."}
        {step === "flash" && "📸"}
        {step === "capture" && "Screenshot captured!"}
        {step === "send" && "Sending image to model..."}
        {step === "done" && "Model can now \"see\" the UI"}
      </div>
    </div>
  );
};

// What we built recap
const recapItems = [
  { num: "01", title: "Agent", desc: "AI SDK + Claude" },
  { num: "02", title: "File System", desc: "Local folder + Bun" },
  { num: "03", title: "Preview", desc: "iframe + hot reload" },
  { num: "04", title: "Feedback", desc: "Console + Screenshots" },
];

const WhatWeBuiltSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h2 className="text-2xl font-medium text-light uppercase tracking-[0.15em] mb-10">
      What We Built
    </h2>

    <div className="flex flex-col w-full max-w-xl">
      {recapItems.map((item, i) => (
        <div
          key={item.num}
          className={`flex items-center gap-6 py-4 ${
            i < recapItems.length - 1 ? "border-b border-gray/20" : ""
          }`}
        >
          <span className="text-orange font-semibold tracking-wider">{item.num}</span>
          <span className="text-light text-lg font-medium w-36">{item.title}</span>
          <span className="text-gray text-base">{item.desc}</span>
        </div>
      ))}
    </div>
  </div>
);

export const slides = [
  { slide: <AgentRecapSlide key="agent-recap" />, title: "Full Picture" },
  { slide: <ScreenshotToolSlide key="screenshot-tool" />, title: "Screenshot Tool" },
  { slide: <WhatWeBuiltSlide key="what-we-built" />, title: "What We Built" },
];
