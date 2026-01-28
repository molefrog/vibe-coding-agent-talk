import domikVideo from "../assets/domik-twi.webm";

const DomikSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="flex flex-col w-full max-w-2xl">
      {/* Video */}
      <video
        src={domikVideo}
        className="w-full rounded-sm mb-6"
        style={{ aspectRatio: '1920 / 1420' }}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Title */}
      <h2 className="text-lg text-primary uppercase tracking-[0.1em] mb-1">
        domik.ltd, Interactive Story
      </h2>

      {/* Subtitle */}
      <p className="text-lg text-secondary">
        Yours truly, 2023
      </p>
    </div>
  </div>
);

export const slides = [
  <DomikSlide key="domik" />,
];
