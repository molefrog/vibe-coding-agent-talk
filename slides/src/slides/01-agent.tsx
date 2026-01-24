import { motion, AnimatePresence } from "motion/react";

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

// Inline code/command style
const Cmd = ({ children }: { children: React.ReactNode }) => (
  <span className="text-gray bg-bg px-1.5 py-0.5 rounded-sm font-mono">{children}</span>
);

// Empty cell for grid alignment
const Empty = () => <div />;

const AgentTimelineSlide = ({ step }: { step: number }) => (
  <div className="flex flex-col gap-6 items-center justify-center h-full">
    <div className="relative w-full max-w-2xl">
      {/* Vertical divider */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray/20" />

      <div className="grid grid-cols-2 gap-y-3">
        {/* Headers */}
        <div className="text-orange text-sm font-semibold uppercase tracking-[0.15em] pb-2 text-center px-6">
          Assistant
        </div>
        <div className="text-orange text-sm font-semibold uppercase tracking-[0.15em] pb-2 text-center px-6">
          User
        </div>

        {/* Row 1: User asks */}
        <Empty />
        <div className="px-6">
          <Step visible={step >= 1}>
            <Message>Create a calorie tracker for my cat</Message>
          </Step>
        </div>

        {/* Row 2: Assistant responds with code */}
        <div className="px-6">
          <Step visible={step >= 2}>
            <Message code={`import { useState } from "react"\n\nexport function CatTracker() {\n  const [calories, setCalories] = useState(0)\n  const [entries, setEntries] = useState([])\n\n  return (\n    <div className="tracker">`}>
              Sure! Save this as CatTracker.tsx:
            </Message>
          </Step>
        </div>
        <Empty />

        {/* Row 3: User confirms, asks next */}
        <Empty />
        <div className="px-6">
          <Step visible={step >= 3}>
            <Message>OK, saved it. What's next?</Message>
          </Step>
        </div>

        {/* Row 4: Assistant says build */}
        <div className="px-6">
          <Step visible={step >= 4}>
            <Message>Great! Now run <Cmd>npm run build</Cmd></Message>
          </Step>
        </div>
        <Empty />

        {/* Row 5: User confirms done */}
        <Empty />
        <div className="px-6">
          <Step visible={step >= 5}>
            <Message>
              <span className="text-gray text-sm">[runs the command]</span>
              <br />
              Done!
            </Message>
          </Step>
        </div>
      </div>
    </div>
  </div>
);

// Model pricing table
const pricingData = [
  { model: "Claude Opus 4.5", input: "$5.00", output: "$25.00" },
  { model: "GPT-5.2", input: "$1.75", output: "$14.00" },
  { model: "Gemini 3 Pro", input: "$2.00", output: "$12.00" },
  { model: "DeepSeek V3", input: "$0.27", output: "$1.10" },
  { model: "MiniMax M2.1", input: "$0.30", output: "$1.20" },
];

const ModelPricingSlide = () => (
  <div className="flex flex-col gap-6 items-center justify-center h-full">
    <table className="w-full max-w-2xl text-light font-mono">
      <thead>
        <tr className="text-orange text-sm uppercase tracking-[0.15em]">
          <th className="text-left py-3 pr-12 font-semibold">Model</th>
          <th className="text-right py-3 px-8 font-semibold border-l border-gray/20">Input</th>
          <th className="text-right py-3 pl-8 font-semibold border-l border-gray/20">Output</th>
        </tr>
      </thead>
      <tbody>
        {pricingData.map((row) => (
          <tr key={row.model} className="border-t border-gray/20">
            <td className="py-3 pr-12 text-base">{row.model}</td>
            <td className="py-3 px-8 text-base text-right text-gray border-l border-gray/20">{row.input}</td>
            <td className="py-3 pl-8 text-base text-right text-gray border-l border-gray/20">{row.output}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <p className="text-gray text-sm">
      per 1M tokens ·{" "}
      <a
        href="https://lmarena.ai/leaderboard"
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange hover:underline"
      >
        lmarena.ai/leaderboard
      </a>
    </p>
  </div>
);

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

const CodeOverviewSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h2 className="text-2xl font-medium text-light uppercase tracking-[0.15em] mb-8">
      How It Works
    </h2>
    <pre className="text-lg leading-relaxed">
      <Kw>import</Kw> {"{ anthropic }"} <Kw>from</Kw> <Str>'@ai-sdk/anthropic'</Str>{"\n"}
      <Kw>import</Kw> {"{ Agent, tool }"} <Kw>from</Kw> <Str>'ai'</Str>{"\n"}
      {"\n"}
      <Kw>const</Kw> agent = <Kw>new</Kw> Agent({"{"}
      {"\n"}{"  "}model: anthropic(<Str>'claude-opus-4-5'</Str>),
      {"\n"}{"  "}system: <Str>"You are a coding assistant..."</Str>,
      {"\n"}{"  "}tools: {"{"} write_file, read_file, exec {"}"}
      {"\n"}{"}"})
      {"\n"}
      {"\n"}<Cm>{"// run the agentic loop"}</Cm>
      {"\n"}<Kw>const</Kw> result = <Kw>await</Kw> agent.generate({"{"}
      {"\n"}{"  "}prompt: <Str>"Build me a calorie tracker app"</Str>
      {"\n"}{"}"})
    </pre>
  </div>
);

const ToolExampleSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h2 className="text-2xl font-medium text-light uppercase tracking-[0.15em] mb-8">
      Tool Example
    </h2>
    <pre className="text-lg leading-relaxed">
      <Kw>const</Kw> write_file = tool({"{"}
      {"\n"}{"  "}description: <Str>"Write content to a file"</Str>,
      {"\n"}{"  "}parameters: z.object({"{"}
      {"\n"}{"    "}path: z.string(),
      {"\n"}{"    "}content: z.string(),
      {"\n"}{"  "}{"}"}),
      {"\n"}{"  "}execute: <Kw>async</Kw> {"({ path, content })"} {"=> {"}
      {"\n"}{"    "}<Kw>await</Kw> Bun.write(path, content)
      {"\n"}{"    "}<Kw>return</Kw> {"{"} success: <Kw>true</Kw> {"}"}
      {"\n"}{"  "}{"}"}
      {"\n"}{"}"})
    </pre>
  </div>
);

const ToolCallSlide = ({ step }: { step: number }) => (
  <div className="flex flex-col gap-6 items-center justify-center h-full">
    <h2 className="text-2xl font-medium text-light uppercase tracking-[0.15em] mb-2">
      Tool Calling
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
          User
        </div>
        <div className="text-orange text-sm font-semibold uppercase tracking-[0.15em] pb-2 text-center px-5">
          Computer
        </div>

        {/* Row 1: User asks */}
        <Empty />
        <div className="px-5">
          <Step visible={step >= 1}>
            <Message>Create a calorie tracker for my cat</Message>
          </Step>
        </div>
        <Empty />

        {/* Row 2: Assistant says will write */}
        <div className="px-5">
          <Step visible={step >= 2}>
            <Message>Sure! I'll create that for you.</Message>
          </Step>
        </div>
        <Empty />
        <Empty />

        {/* Row 3: Tool executes on computer */}
        <Empty />
        <Empty />
        <div className="px-5">
          <Step visible={step >= 3}>
            <Message code={`write_file({\n  path: "CatTracker.tsx",\n  content: "import..."\n})\n\n→ { success: true }`}>
              <span className="text-gray text-sm">[tool call]</span>
            </Message>
          </Step>
        </div>

        {/* Row 4: Assistant confirms */}
        <div className="px-5">
          <Step visible={step >= 4}>
            <Message>Done! Your CatTracker component is ready.</Message>
          </Step>
        </div>
        <Empty />
        <Empty />
      </div>
    </div>

    <Step visible={step >= 5}>
      <p className="text-gray text-base mt-4">Same conversation, but automatic.</p>
    </Step>
  </div>
);

// Framework card
const FrameworkCard = ({
  name,
  url,
  highlight,
}: {
  name: string;
  url: string;
  highlight?: boolean;
}) => (
  <div className="bg-light rounded-sm px-5 py-3 flex items-center gap-4">
    <div className={`text-lg font-semibold ${highlight ? "text-orange" : "text-bg"}`}>
      {highlight && "→ "}{name}
    </div>
    <div className="text-dark-gray text-sm">{url}</div>
  </div>
);

const FrameworksSlide = ({ step }: { step: number }) => {
  const dimmed = step >= 2;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-md">
        {/* Python */}
        <motion.div
          className="mb-8"
          animate={{ opacity: dimmed ? 0.15 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="text-orange text-sm font-semibold uppercase tracking-[0.15em] mb-3">
            Python
          </div>
          <div className="flex flex-col gap-2">
            <FrameworkCard name="LangChain" url="langchain.com" />
            <FrameworkCard name="LangGraph" url="langchain.com/langgraph" />
            <FrameworkCard name="LlamaIndex" url="llamaindex.ai" />
          </div>
        </motion.div>

        {/* JavaScript */}
        <div>
          <div className="text-orange text-sm font-semibold uppercase tracking-[0.15em] mb-3">
            JavaScript
          </div>
          <div className="flex flex-col gap-2">
            <motion.div
              animate={{ opacity: dimmed ? 0.15 : 1 }}
              transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
            >
              <FrameworkCard name="LangChain.js" url="js.langchain.com" />
            </motion.div>
            <motion.div
              animate={{ opacity: dimmed ? 0.15 : 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            >
              <FrameworkCard name="OpenAI Agents SDK" url="openai.github.io/openai-agents-js" />
            </motion.div>
            <FrameworkCard name="Mastra" url="mastra.ai" highlight />
            <FrameworkCard name="Vercel AI SDK" url="sdk.vercel.ai" highlight />
          </div>
        </div>
      </div>
    </div>
  );
};

export const slides = [
  { slide: { component: AgentTimelineSlide, steps: 5 }, title: "Chat Timeline" },

  { slide: { component: ToolCallSlide, steps: 5 }, title: "Tool Calling" },

  { slide: `╔══════════════════════════════════════════╗
║                                          ║
║   Agent = LLM + System Prompt + Tools    ║
║                                          ║
╚══════════════════════════════════════════╝`, title: "Definition" },

  { slide: { component: FrameworksSlide, steps: 2 }, title: "Frameworks" },

  { slide: <ModelPricingSlide key="model-pricing" />, title: "Model Pricing" },

  { slide: <CodeOverviewSlide key="code-overview" />, title: "Code Structure" },

  { slide: <ToolExampleSlide key="tool-example" />, title: "Tool Example" },
];
