import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import bunLogo from "../../imgs/bun-logo.svg";
import appScreenshot from "../../imgs/app-screenshot.png";

// Syntax highlighting helpers
const Kw = ({ children }: { children: React.ReactNode }) => (
  <span className="text-orange">{children}</span>
);
const Str = ({ children }: { children: React.ReactNode }) => (
  <span className="text-gray">{children}</span>
);
const Cm = ({ children }: { children: React.ReactNode }) => (
  <span className="text-gray opacity-50">{children}</span>
);

const bunFeatures = [
  "All-in-one toolkit",
  "Package manager",
  "TypeScript natively",
  "Bundler",
  "Full-stack dev server",
  "Simple API",
  "Agents love it",
];

const BunSlide = () => (
  <div className="flex flex-col items-center justify-center h-full gap-10">
    <img src={bunLogo} alt="Bun" className="h-24" />

    <p className="text-xl text-gray">
      JavaScript runtime & toolkit
    </p>

    <div className="flex flex-col gap-3">
      {bunFeatures.map((feature) => (
        <div key={feature} className="flex items-center gap-4 text-lg">
          <span className="text-orange">•</span>
          <span className="text-light">{feature}</span>
        </div>
      ))}
    </div>
  </div>
);

const BundleToolSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h2 className="text-2xl font-medium text-light uppercase tracking-[0.15em] mb-8">
      Bundle Tool
    </h2>
    <pre className="text-lg leading-relaxed">
      <Kw>const</Kw> bundle = tool({"{"}
      {"\n"}{"  "}description: <Str>"Build the app"</Str>,
      {"\n"}{"  "}execute: <Kw>async</Kw> {"()"} {"=> {"}
      {"\n"}{"    "}<Kw>const</Kw> result = <Kw>await</Kw> Bun.build({"{"}
      {"\n"}{"      "}entrypoints: [<Str>"index.html"</Str>],
      {"\n"}{"      "}outdir: <Str>"./build"</Str>,
      {"\n"}{"    "}{"}"})
      {"\n"}
      {"\n"}{"    "}<Kw>if</Kw> (!result.success) {"{"}
      {"\n"}{"      "}<Kw>return</Kw> {"{"} error: result.logs {"}"}
      {"\n"}{"    "}{"}"}
      {"\n"}
      {"\n"}{"    "}<Kw>return</Kw> {"{"} success: <Kw>true</Kw> {"}"}
      {"\n"}{"  "}{"}"}
      {"\n"}{"}"})
    </pre>
  </div>
);

// Skeleton text line
const SkeletonLine = ({ width }: { width: string }) => (
  <div className={`h-3 bg-gray/30 rounded-sm ${width}`} />
);

// Chat message skeleton
const ChatMessage = ({
  isUser,
  children,
}: {
  isUser?: boolean;
  children: React.ReactNode;
}) => (
  <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
    <div
      className={`px-3 py-2 rounded-sm max-w-[85%] ${
        isUser ? "bg-orange/20" : "bg-gray/10"
      }`}
    >
      {children}
    </div>
  </div>
);

// Tool call badge
const ToolCall = ({ name }: { name: string }) => (
  <div className="flex justify-start">
    <div className="px-3 py-1.5 rounded-sm border border-orange/30 bg-orange/5">
      <span className="text-orange text-xs font-mono">⚡ {name}()</span>
    </div>
  </div>
);

// Animation steps for preview
const previewSteps = ["idle", "bundle", "url", "fly", "loaded", "done"];

const PreviewLayoutSlide = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const step = previewSteps[stepIndex];

  useEffect(() => {
    const delays: Record<string, number> = {
      idle: 1500,
      bundle: 1200,
      url: 1000,
      fly: 800,
      loaded: 2500,
      done: 2000,
    };

    const timeout = setTimeout(() => {
      setStepIndex((i) => (i + 1) % previewSteps.length);
    }, delays[step]);

    return () => clearTimeout(timeout);
  }, [stepIndex, step]);

  const showBundleActive = step === "bundle" || step === "url";
  const showUrl = step === "url" || step === "fly";
  const urlFlying = step === "fly";
  const showPreview = stepIndex >= 4;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Main container */}
      <div className="flex gap-4 w-full max-w-4xl h-96 p-4 relative">
        {/* Left: Chat */}
        <div className="flex-1 flex flex-col border border-gray/20 rounded-sm overflow-hidden">
          <div className="px-3 py-2 border-b border-gray/20 bg-dark-gray/50">
            <span className="text-xs text-gray uppercase tracking-wider">Chat</span>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-3 overflow-hidden">
            {/* User message */}
            <ChatMessage isUser>
              <SkeletonLine width="w-32" />
            </ChatMessage>

            {/* Assistant message */}
            <ChatMessage>
              <div className="flex flex-col gap-1.5">
                <SkeletonLine width="w-40" />
                <SkeletonLine width="w-28" />
              </div>
            </ChatMessage>

            {/* Tool call - bundle */}
            <div className="flex justify-start">
              <motion.div
                className={`px-3 py-1.5 rounded-sm border ${
                  showBundleActive
                    ? "border-orange bg-orange/10"
                    : "border-orange/30 bg-orange/5"
                }`}
                animate={{ scale: showBundleActive ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-orange text-xs font-mono">⚡ bundle()</span>
              </motion.div>
            </div>

            {/* URL result */}
            <AnimatePresence>
              {showUrl && !urlFlying && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="px-2 py-1 rounded-sm bg-dark-gray">
                    <span className="text-xs text-gray font-mono">→ /build/a3f2/index.html</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Assistant message */}
            <ChatMessage>
              <div className="flex flex-col gap-1.5">
                <SkeletonLine width="w-36" />
              </div>
            </ChatMessage>
          </div>
        </div>

        {/* Flying URL */}
        <AnimatePresence>
          {urlFlying && (
            <motion.div
              initial={{ x: -100, y: 50, opacity: 1 }}
              animate={{ x: 100, y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="px-3 py-1.5 rounded-sm bg-orange text-bg text-xs font-mono">
                /build/a3f2/index.html
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: Preview iframe */}
        <div className="flex-1 flex flex-col border border-gray/20 rounded-sm overflow-hidden">
          <div className="px-3 py-2 border-b border-gray/20 bg-dark-gray/50">
            <span className="text-xs text-gray uppercase tracking-wider">Preview</span>
          </div>
          <div className="flex-1 flex items-center justify-center bg-dark-gray/30 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!showPreview ? (
                <motion.div
                  key="placeholder"
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="text-gray/50 text-sm mb-2">{"<iframe>"}</div>
                  <div className="w-24 h-16 border border-dashed border-gray/30 rounded-sm flex items-center justify-center">
                    <span className="text-gray/40 text-xs">widget</span>
                  </div>
                </motion.div>
              ) : (
                <motion.img
                  key="preview"
                  src={appScreenshot}
                  alt="App preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full object-cover"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="mt-6 text-sm text-gray/50">
        {step === "idle" && "User requests a change..."}
        {step === "bundle" && "Calling bundle()..."}
        {step === "url" && "Build complete!"}
        {step === "fly" && "Loading preview..."}
        {(step === "loaded" || step === "done") && "Preview updated via iframe src"}
      </div>
    </div>
  );
};

// Section divider
const SectionDivider = () => (
  <div className="flex items-center justify-center h-full">
    <div className="bg-light rounded-sm px-12 py-8">
      <h2 className="text-3xl font-semibold text-bg uppercase tracking-[0.15em]">
        Build <span className="text-orange">&</span> Preview
      </h2>
    </div>
  </div>
);

export const slides = [
  { slide: <SectionDivider key="section-divider" />, title: "Build & Preview" },

  { slide: <PreviewLayoutSlide key="preview-layout" />, title: "Preview Layout" },

  { slide: <BunSlide key="bun" />, title: "Bun" },

  { slide: <BundleToolSlide key="bundle-tool" />, title: "Bundle Tool" },
];
