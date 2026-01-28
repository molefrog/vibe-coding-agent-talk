const tableOfContents = ["Conclusions", "2012", "2013", "2018", "2022", "2026+"];

const TitleSlide = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="w-full max-w-sm flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <span className="text-primary text-xl uppercase tracking-wide text-pretty">
          Unnamed Talk for Design Engineering Night #6
        </span>
        <span className="text-secondary text-lg">Alexey Taktarov</span>
      </div>

      <div className="flex flex-col gap-2">
        {tableOfContents.map((item) => (
          <div key={item} className="flex gap-4">
            <span className="text-muted text-base">*</span>
            <p className="text-primary text-base">{item}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const slides = [<TitleSlide key="title" />];
