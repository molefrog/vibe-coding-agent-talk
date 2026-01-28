import stuartVideo from "../assets/stuart-memo.webm";

const StuartSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="flex flex-col w-full max-w-4xl">
      {/* Video */}
      <video
        src={stuartVideo}
        className="w-full rounded-sm mb-6"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Title */}
      <h2 className="text-lg text-primary uppercase tracking-[0.1em] mb-1">
        JavaScript is the New Punk Rock
      </h2>

      {/* Subtitle */}
      <p className="text-lg text-secondary">
        Stuart Memo, 2012
      </p>
    </div>
  </div>
);

export const slides = [
  <StuartSlide key="stuart" />,
];
