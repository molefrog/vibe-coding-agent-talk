import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// File tree data with preview content
const files = [
  {
    name: "app.tsx",
    icon: "◇",
    hint: "← agent writes here",
    preview: `export default function App() {
  return (
    <div className="p-8">
      <h1>Hello Copenhagen!</h1>
    </div>
  )
}`,
  },
  {
    name: "index.tsx",
    icon: "◇",
    preview: `import App from "./app"
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")!)
  .render(<App />)`,
  },
  {
    name: "styles.css",
    icon: "◆",
    preview: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
  },
  {
    name: "package.json",
    icon: "◆",
    preview: `{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "tailwindcss": "^4",
    "motion": "^12",
    "use-sound": "^4",
    "clsx": "^2"
  }
}`,
  },
];

const FileTreeSlide = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const activeFile = files.find((f) => f.name === hovered) || files[0];

  return (
    <div className="grid grid-cols-2 gap-12 items-center h-full w-full max-w-5xl">
      {/* Left: File tree */}
      <div className="flex flex-col justify-center">
        <div className="text-orange text-lg font-semibold uppercase tracking-[0.15em] mb-5">
          project/
        </div>
        <div className="flex flex-col">
          {files.map((file, i) => {
            const isLast = i === files.length - 1;
            const isHovered = hovered === file.name;
            const isMuted = hovered !== null && !isHovered;

            return (
              <div
                key={file.name}
                className={`flex items-center gap-4 cursor-pointer transition-opacity duration-150 text-xl leading-relaxed ${
                  isMuted ? "opacity-30" : "opacity-100"
                }`}
                onMouseEnter={() => setHovered(file.name)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="text-gray">{isLast ? "└──" : "├──"}</span>
                <span className="text-orange">{file.icon}</span>
                <span className="text-light">{file.name}</span>
                {file.hint && <span className="text-gray text-base">{file.hint}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Preview */}
      <div className="flex flex-col justify-center">
        <div className="bg-dark-gray rounded-sm p-6">
          <div className="text-orange text-sm font-semibold uppercase tracking-[0.1em] mb-3">
            {activeFile.name}
          </div>
          <pre className="text-base text-light leading-relaxed">
            {activeFile.preview}
          </pre>
        </div>
      </div>
    </div>
  );
};

const OptionCard = ({
  title,
  description,
  example,
}: {
  title: string;
  description: string;
  example?: string;
}) => (
  <div className="bg-light rounded-sm px-5 py-4 flex items-center gap-6">
    <div className="text-orange text-base font-semibold uppercase tracking-[0.1em] w-40 shrink-0">
      <span className="mr-2">◈</span>{title}
    </div>
    <div className="text-bg text-base">
      {description}
      {example && <span className="text-dark-gray ml-2">ex: {example}</span>}
    </div>
  </div>
);

const EnvironmentSlide = () => (
  <div className="flex flex-col gap-6 items-center justify-center h-full">
    <h2 className="text-2xl font-medium text-light uppercase tracking-[0.15em] mb-4">
      Environment: where does code live?
    </h2>
    <div className="flex flex-col gap-3 w-full max-w-xl">
      <OptionCard title="In Memory" description="not useful" />
      <OptionCard title="Local Disk" description="simple, full access" />
      <OptionCard title="Virtual FS" description="isolated layers" example="AgentFS by Turso" />
      <OptionCard title="Container" description="cloud or browser" />
    </div>
  </div>
);

// Comparison table data
const comparisonData = [
  { product: "Cursor, Claude Code", env: "Local" },
  { product: "Lovable", env: "Cloud container" },
  { product: "v0", env: "Browser sandbox", note: "no backend" },
  { product: "Bolt", env: "WebContainers", note: "Docker in browser" },
  { product: "Replit", env: "Cloud container" },
  { product: "Our approach", env: "Local + Bun", highlight: true },
];

const ComparisonSlide = ({ step }: { step: number }) => (
  <div className="flex flex-col gap-6 items-center justify-center h-full">
    <table className="w-full max-w-2xl text-light font-mono">
      <thead>
        <tr className="text-orange text-sm uppercase tracking-[0.15em]">
          <th className="text-left py-3 pr-12 font-semibold">Product</th>
          <th className="text-left py-3 pl-8 font-semibold border-l border-gray/20">Environment</th>
        </tr>
      </thead>
      <tbody>
        {comparisonData.map((row, i) => {
          const isHighlight = row.highlight;
          const dimmed = step >= 2 && !isHighlight;

          return (
            <motion.tr
              key={row.product}
              className="border-t border-gray/20"
              animate={{ opacity: dimmed ? 0.15 : 1 }}
              transition={{
                duration: 0.4,
                delay: dimmed ? i * 0.08 : (comparisonData.length - 1 - i) * 0.08,
                ease: "easeOut",
              }}
            >
              <td className={`py-3 pr-12 text-base ${isHighlight ? "text-orange" : ""}`}>
                {isHighlight ? "→ " : ""}{row.product}
              </td>
              <td className="py-3 pl-8 text-base text-gray border-l border-gray/20">
                {row.env}
                {row.note && <span className="text-gray/50 ml-2">({row.note})</span>}
              </td>
            </motion.tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// Agent animation sequence
const agentSteps = [
  { tool: "ls", args: "project/", result: "app.tsx\nindex.tsx\nstyles.css\npackage.json" },
  { tool: "read_file", args: "app.tsx", result: "export default function App() {\n  return <div>Hello</div>\n}" },
  { tool: "read_file", args: "index.tsx", result: "import App from './app'\ncreateRoot(root).render(<App />)" },
  { tool: "write_file", args: "app.tsx", result: "✓ written 47 lines" },
];

const tools = [
  { id: "ls", name: "ls" },
  { id: "read_file", name: "read_file" },
  { id: "write_file", name: "write_file" },
];

const AgentToolsSlide = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = agentSteps[stepIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % agentSteps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {/* Agent block */}
      <div className="bg-orange text-bg px-10 py-5 rounded-sm">
        <div className="text-xl font-semibold uppercase tracking-[0.15em]">Agent</div>
      </div>

      {/* Connection lines */}
      <div className="text-gray text-3xl">↓</div>

      {/* Tools row */}
      <div className="flex gap-4">
        {tools.map((tool) => {
          const isActive = currentStep.tool === tool.id;
          const args = isActive ? currentStep.args : null;
          const result = isActive ? currentStep.result : null;

          return (
            <motion.div
              key={tool.id}
              className="flex flex-col items-center w-56"
              animate={{ opacity: isActive ? 1 : 0.2 }}
              transition={{ duration: 0.3 }}
            >
              {/* Tool box */}
              <div
                className={`w-full px-6 py-5 rounded-sm border-2 transition-colors duration-300 ${
                  isActive
                    ? "bg-dark-gray border-orange"
                    : "bg-dark-gray/50 border-gray/30"
                }`}
              >
                <div className={`text-xl font-semibold font-mono ${isActive ? "text-orange" : "text-gray"}`}>
                  {tool.name}
                </div>
              </div>

              {/* Args + Result area */}
              <div className="mt-4 w-full min-h-28">
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      key={stepIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="font-mono"
                    >
                      {/* Args */}
                      <div className="text-sm text-orange mb-2">
                        → {args}
                      </div>
                      {/* Result */}
                      <pre className="text-sm text-light leading-relaxed">
                        {result}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

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

const EditProblemSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h2 className="text-2xl font-medium text-light uppercase tracking-[0.15em] mb-8">
      Edit Tool
    </h2>
    <pre className="text-lg leading-relaxed">
      <Cm>{"// write_file = slow (rewrites entire file)"}</Cm>
      {"\n"}<Cm>{"// Solution: edit_file"}</Cm>
      {"\n"}
      {"\n"}<Kw>const</Kw> edit_file = tool({"{"}
      {"\n"}{"  "}description: <Str>"Edit a file"</Str>,
      {"\n"}{"  "}parameters: z.object({"{"}
      {"\n"}{"    "}path: z.string(),
      {"\n"}{"    "}old_string: z.string(),
      {"\n"}{"    "}new_string: z.string(),
      {"\n"}{"  "}{"}"}),
      {"\n"}{"  "}execute: <Kw>async</Kw> {"({ path, old_string, new_string })"} {"=> {"}
      {"\n"}{"    "}<Kw>const</Kw> content = <Kw>await</Kw> Bun.file(path).text()
      {"\n"}{"    "}<Kw>await</Kw> Bun.write(path, content.replace(old_string, new_string))
      {"\n"}{"    "}<Kw>return</Kw> {"{"} success: <Kw>true</Kw> {"}"}
      {"\n"}{"  "}{"}"}
      {"\n"}{"}"})
    </pre>
  </div>
);

export const slides = [
  { slide: <EnvironmentSlide key="environment" />, title: "Environment" },

  { slide: { component: ComparisonSlide, steps: 2 }, title: "Comparison" },

  { slide: <FileTreeSlide key="file-tree" />, title: "Project Files" },

  { slide: <AgentToolsSlide key="agent-tools" />, title: "Core Tools" },

  { slide: <EditProblemSlide key="edit-problem" />, title: "Edit Tool" },
];
