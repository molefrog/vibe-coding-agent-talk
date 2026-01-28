import animationsVideo from "../assets/animations.mp4";

const AnimationsSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="flex flex-col w-full max-w-4xl">
      {/* Video */}
      <video
        src={animationsVideo}
        className="w-full rounded-sm mb-6"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Title */}
      <h2 className="text-lg text-primary uppercase tracking-[0.1em] mb-1">
        Stateful Animations in React
      </h2>

      {/* Subtitle */}
      <p className="text-lg text-secondary">
        Yours truly, 2018
      </p>
    </div>
  </div>
);

export const slides = [
  <AnimationsSlide key="animations" />,
];
