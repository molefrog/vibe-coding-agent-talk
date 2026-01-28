import { useState } from "react";

type FileItem = {
  name: string;
  children?: FileItem[];
};

const fileTree: FileItem[] = [
  {
    name: "node_modules/",
    children: [
      { name: "motion/" },
      { name: "@instantdb/" },
      { name: "@heroicons/" },
      { name: "canvas-confetti/" },
      { name: "use-sound/" },
      { name: "@number-flow/" },
    ],
  },
  {
    name: "docs/",
    children: [
      { name: "design-guidelines.md" },
      { name: "instantdb.md" },
      { name: "heroicons.md" },
      { name: "confetti-effects.md" },
      { name: "play-sounds-with-use-sound.md" },
      { name: "animate-numbers-with-number-flow.md" },
      { name: "spoiler-reveal-effects.md" },
    ],
  },
  { name: "app.tsx" },
  { name: "db.ts" },
  { name: "index.tsx" },
  { name: "package.json" },
];

const FileEntry = ({
  item,
  depth = 0,
  expanded,
  onToggle,
}: {
  item: FileItem;
  depth?: number;
  expanded?: boolean;
  onToggle?: () => void;
}) => {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <>
      <div
        className={`
          py-1 px-2 -mx-2 rounded-sm transition-colors
          ${hasChildren ? "cursor-pointer hover:bg-border" : "cursor-default hover:bg-border/50"}
        `}
        style={{ paddingLeft: `${depth * 24 + 8}px` }}
        onClick={onToggle}
      >
        {hasChildren && (
          <span className="inline-block w-4 text-muted">
            {expanded ? "−" : "+"}
          </span>
        )}
        {item.name}
      </div>
      {hasChildren && expanded && (
        <>
          {item.children!.map((child) => (
            <FileEntry key={child.name} item={child} depth={depth + 1} />
          ))}
        </>
      )}
    </>
  );
};

// Total lines when fully expanded: 19
const TOTAL_LINES = 19;
const LINE_HEIGHT = 32; // py-1 (8px) + text-base line height (~24px)

const FilesSlide = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="font-mono text-base text-primary"
        style={{ height: TOTAL_LINES * LINE_HEIGHT, minWidth: 280 }}
      >
        {fileTree.map((item) => (
          <FileEntry
            key={item.name}
            item={item}
            expanded={expanded[item.name]}
            onToggle={item.children ? () => toggle(item.name) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export const slides = [
  { slide: <FilesSlide key="files" />, title: "File Structure" },
];
