const contactLinks = [
  { label: "Web", url: "molefrog.com", href: "https://molefrog.com" },
  { label: "GitHub", url: "github.com/molefrog", href: "https://github.com/molefrog" },
  { label: "X", url: "@mlfrg", href: "https://x.com/mlfrg" },
];

const FinalSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="flex flex-col w-full max-w-sm">
      <div className="py-3 border-b border-border">
        <h2 className="text-lg text-primary uppercase tracking-[0.1em] mb-2">
          Building AI Coding Agents
        </h2>
        <p className="text-secondary text-base">
          Alexey Taktarov
        </p>
      </div>

      {contactLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between py-2.5 border-b border-border hover:border-brand transition-colors"
        >
          <span className="text-muted text-base uppercase tracking-[0.1em]">{link.label}</span>
          <span className="text-brand text-base">{link.url}</span>
        </a>
      ))}
    </div>
  </div>
);

export const slides = [
  <FinalSlide key="final" />,
];
