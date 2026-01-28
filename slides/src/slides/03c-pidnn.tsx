import pidnnVideo from "../assets/pidnn.webm";

const PidnnSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="flex flex-col w-full max-w-4xl">
      {/* Video */}
      <video
        src={pidnnVideo}
        className="w-full rounded-sm mb-6"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Title */}
      <h2 className="text-lg text-primary uppercase tracking-[0.1em] mb-1">
        My Early JS Experiments
      </h2>

      {/* Subtitle */}
      <p className="text-lg text-secondary">
        PID Neural Network, 2013
      </p>
    </div>
  </div>
);

export const slides = [
  <PidnnSlide key="pidnn" />,
];
