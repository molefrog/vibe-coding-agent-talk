import { useState } from "react";

type FileItem = {
  name: string;
  children?: FileItem[];
};

const fileTree: FileItem[] = [
  {
    name: "node_modules/",
    children: [
      { name: "react/" },
      { name: "@instantdb/react/" },
      { name: "motion/" },
      { name: "tailwindcss/" },
    ],
  },
  {
    name: "docs/",
    children: [
      { name: "heroicons.md" },
      { name: "instantdb.md" },
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
  const isFolder = item.name.endsWith("/");

  return (
    <>
      <div
        className={`
          py-1 px-2 -mx-2 rounded-sm transition-colors
          ${hasChildren ? "cursor-pointer hover:bg-border" : ""}
        `}
        style={{ paddingLeft: `${depth * 24 + 8}px` }}
        onClick={onToggle}
      >
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

// Total lines when fully expanded: 12
const TOTAL_LINES = 12;
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
