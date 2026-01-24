import appScreenshot from "../../imgs/app-screenshot.png";
import { motion } from "motion/react";

// Timeline message bubble
const Message = ({
  children,
  code,
}: {
  children: React.ReactNode;
  code?: string;
}) => (
  <div className="bg-dark-gray rounded-sm px-4 py-3">
    <div className="text-light text-base">{children}</div>
    {code && (
      <div className="mt-2 relative">
        <pre className="text-sm text-gray font-mono whitespace-pre overflow-hidden max-h-32">{code}</pre>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-dark-gray to-transparent" />
      </div>
    )}
  </div>
);

// Empty cell for grid alignment
const Empty = () => <div />;

// Animated wrapper for step appearance
const Step = ({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) =>
  visible ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {children}
    </motion.div>
  ) : (
    <div className="opacity-0">{children}</div>
  );

const ClientToolsSlide = ({ step }: { step: number }) => (
  <div className="flex flex-col gap-6 items-center justify-center h-full">
    <h2 className="text-2xl font-medium text-light uppercase tracking-[0.15em] mb-2">
      Getting Console Logs
    </h2>
    <div className="relative w-full max-w-4xl">
      {/* Vertical dividers */}
      <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gray/20" />
      <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gray/20" />

      <div className="grid grid-cols-3 gap-y-3">
        {/* Headers */}
        <div className="text-orange text-sm font-semibold uppercase tracking-[0.15em] pb-2 text-center px-5">
          Assistant
        </div>
        <div className="text-orange text-sm font-semibold uppercase tracking-[0.15em] pb-2 text-center px-5">
          Server
        </div>
        <div className="text-orange text-sm font-semibold uppercase tracking-[0.15em] pb-2 text-center px-5">
          Browser
        </div>

        {/* Row 1: Assistant calls tool */}
        <div className="px-5">
          <Step visible={step >= 1}>
            <Message code={`getConsoleLogs()`}>
              <span className="text-gray text-sm">[tool call]</span>
            </Message>
          </Step>
        </div>
        <Empty />
        <Empty />

        {/* Row 2: Server proxies to client */}
        <Empty />
        <div className="px-5">
          <Step visible={step >= 2}>
            <Message>
              <span className="text-gray text-sm">[proxy to client]</span>
            </Message>
          </Step>
        </div>
        <Empty />

        {/* Row 3: Browser executes, collects logs */}
        <Empty />
        <Empty />
        <div className="px-5">
          <Step visible={step >= 3}>
            <Message code={`window.__logs = []\nconsole.log = (...args) => {\n  __logs.push(args)\n}`}>
              <span className="text-gray text-sm">[executes in iframe]</span>
            </Message>
          </Step>
        </div>

        {/* Row 4: Browser returns logs */}
        <Empty />
        <div className="px-5">
          <Step visible={step >= 4}>
            <Message>
              <span className="text-gray text-sm">[returns result]</span>
            </Message>
          </Step>
        </div>
        <Empty />

        {/* Row 5: Assistant receives logs */}
        <div className="px-5">
          <Step visible={step >= 5}>
            <Message code={`[\n  "Error: Cannot read 'map'",\n  "  at App.tsx:24"\n]`}>
              Got it! I see the error.
            </Message>
          </Step>
        </div>
        <Empty />
        <Empty />
      </div>
    </div>

    <Step visible={step >= 6}>
      <p className="text-gray text-base mt-4">Tool executes in browser, not server!</p>
    </Step>
  </div>
);

// Large feedback card with image
const FeedbackImageCard = ({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="px-6 py-8 rounded-sm bg-light h-full flex flex-col">
    <div className="text-base mb-2 font-semibold text-orange tracking-[0.1em]">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-bg uppercase tracking-[0.08em]">
      {title}
    </h3>
    <p className="text-base text-dark-gray text-pretty mb-4">
      {description}
    </p>
    <div
      className="flex-1 rounded-sm overflow-hidden bg-dark-gray"
      style={{ boxShadow: "var(--shadow-ds-border-large)" }}
    >
      {children}
    </div>
  </div>
);

// Mock console logs
const ConsoleMock = () => (
  <div className="p-4 font-mono text-sm leading-relaxed h-full">
    <div className="text-gray">[15:42:03] Starting dev server...</div>
    <div className="text-light">[15:42:04] Ready on http://localhost:3000</div>
    <div className="text-orange">[15:42:15] Warning: Each child should have a unique "key" prop</div>
    <div className="text-red-400">[15:42:18] Error: Cannot read property 'map' of undefined</div>
    <div className="text-gray">{"    "}at App.tsx:24:18</div>
    <div className="text-gray">[15:42:20] Hot reload triggered</div>
  </div>
);

const FeedbackToolsSlide = () => (
  <div className="flex flex-col gap-8 items-center justify-center h-full">
    <h2 className="text-2xl font-medium text-center text-light uppercase tracking-[0.2em]">
      When Things Go Wrong
    </h2>

    <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
      <FeedbackImageCard
        number="01"
        title="Console Logs"
        description="Catch runtime errors and warnings"
      >
        <ConsoleMock />
      </FeedbackImageCard>

      <FeedbackImageCard
        number="02"
        title="Screenshots"
        description="Visual feedback for layout bugs"
      >
        <img src={appScreenshot} alt="App screenshot" className="w-full h-full object-cover" />
      </FeedbackImageCard>
    </div>
  </div>
);

// Screenshot tool options
const screenshotOptions = [
  { name: "html2canvas", desc: "inaccurate, no iframes", recommended: false },
  { name: "Puppeteer", desc: "headless Chrome", recommended: false },
  { name: "Browserless", desc: "Docker, scalable", recommended: true },
];

const ScreenshotToolSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h2 className="text-2xl font-medium text-light uppercase tracking-[0.15em] mb-8">
      Screenshot Tool
    </h2>

    <div className="w-full max-w-md">
      <p className="text-gray text-base mb-6">
        Multimodal models can see images → visual debugging
      </p>

      <div className="flex flex-col gap-2">
        {screenshotOptions.map((opt) => (
          <div
            key={opt.name}
            className="flex items-center justify-between px-4 py-3 border border-gray/20 rounded-sm"
          >
            <span className={`font-mono ${opt.recommended ? "text-orange" : "text-light"}`}>
              {opt.recommended && "→ "}{opt.name}
            </span>
            <span className="text-gray text-sm">{opt.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Section divider
const SectionDivider = () => (
  <div className="flex items-center justify-center h-full">
    <div className="bg-light rounded-sm px-12 py-8">
      <h2 className="text-3xl font-semibold text-bg uppercase tracking-[0.15em]">
        Feedback
      </h2>
    </div>
  </div>
);

export const slides = [
  { slide: <SectionDivider key="section-divider" />, title: "Feedback" },

  { slide: <FeedbackToolsSlide key="feedback-tools" />, title: "Error Handling" },

  { slide: { component: ClientToolsSlide, steps: 6 }, title: "Client-Side Tools" },
];
