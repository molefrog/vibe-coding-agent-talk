const Inline = ({ children }: { children: React.ReactNode }) => (
  <span className="text-brand">{children}</span>
);

const MdxSlide = () => (
  <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
    <div className="w-full max-w-3xl px-8 py-16 text-base text-primary leading-relaxed">
      <p className="mb-4">
        {`export const title = "03. Stories";`}
      </p>

      <p className="mb-6">
        I realised that everything hadn't turned out at all as awfully as I'd imagined.
        This situation had unlocked new possibilities, because now we could not only travel
        along the road, we could also cross rivers. I then recalled that there had been other
        situations in my life where seemingly catastrophic errors had ended up being the
        precursor to new experiences.
      </p>

      <p className="mb-6 text-lg">
        # 03. Stories
      </p>

      <p className="mb-4">
        We hovered along for a few more hours. The body of water we crossed was not a river but a whole
        system of connected canals, separated by small pockets of land. The view from the cockpit of the car
        was <Inline>**just breathtaking**</Inline>. I caught myself thinking that I would have given anything to feast my eyes on
        {" "}<Inline>{`<TV video="qZ0_aa6RxvQ" from="59:20">that view</TV>`}</Inline> for all eternity.
      </p>

      <p className="mb-4">
        At some point, the canal system began to lose its structure: the channels were thinning, and the
        main waterway was becoming <Inline>**narrower and narrower**</Inline>. Eventually, we came to a slightly sloping shore
        and turned off the air cushion.
      </p>

      <p className="mb-4">
        <Inline>{`<MapPuzzle revealed={solved} />`}</Inline>
      </p>

      <p className="mb-4">
        "Hey look at this ridiculous map!" I said. A book on a stand for guidebooks and maps had caught my
        eye. But this book seemed different to the others. Unlike the standard maps there, it was hand-drawn
        and depicted strange objects instead of cities.
      </p>

      <p className="mb-4">
        "No, no, look, it says here: 'A Guide to Roadside Monuments of Cultural Importance.'
        {" "}<Inline>{`<Gem oct={4} />`}</Inline> It seems to be an actual map, apparently, for people who like to stop and look at,
        well… an <Inline>**enormous toilet**</Inline> by the roadside."
      </p>

      <p className="mb-4">
        On that note, we raised our heads almost simultaneously and stared at the
        {" "}<Inline>{`<TV video="zbo6jUGrwdk">blobs of wax</TV>`}</Inline> floating inside the lamp.
        We gazed at their movement for a while longer, and then set off again.
      </p>

      <p className="mb-4">
        <Inline>{`<AudioPlayer src={ambience} loop autoPlay />`}</Inline>
      </p>

      <p>
        The map had a fairly non-linear structure, so we visited the monuments of 'cultural significance' in
        completely random order.
      </p>
    </div>
  </div>
);

export const slides = [
  { slide: <MdxSlide key="mdx" />, title: "story.mdx" },
];
