const LiveDemoSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="text-5xl font-semibold text-orange uppercase tracking-[0.2em]">
      Live Demo
    </div>
  </div>
);

export const slides = [
  { slide: <LiveDemoSlide key="live-demo" />, title: "Live Demo" },
];
