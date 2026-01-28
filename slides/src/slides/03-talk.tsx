import bretVideo from "../assets/bret.webm";

const TalkSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="flex flex-col w-full max-w-4xl">
      {/* Video */}
      <video
        src={bretVideo}
        className="w-full rounded-sm mb-6"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Title */}
      <h2 className="text-lg text-primary uppercase tracking-[0.1em] mb-1">
        Inventing on Principle
      </h2>

      {/* Subtitle */}
      <p className="text-lg text-secondary">
        Bret Victor, 2012
      </p>
    </div>
  </div>
);

export const slides = [
  <TalkSlide key="talk" />,
];
