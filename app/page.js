import FadeInView from "@/components/fade-in-view";
import KeyboardScroll from "@/components/KeyboardScroll";

const detailCards = [
  {
    title: "Sticky canvas",
    copy:
      "A full-screen canvas stays pinned while the page stretches to four viewports of scroll, giving the motion room to breathe."
  },
  {
    title: "120-frame preload",
    copy:
      "The component resolves to the exact WebP naming convention when present, with a PNG fallback to match the current public assets."
  },
  {
    title: "Timed overlays",
    copy:
      "Four minimal text beats fade in and out around the sequence without blocking the product center."
  }
];

const specs = [
  ["Frame count", "120 frames"],
  ["Canvas fit", "Contain"],
  ["Motion", "Framer Motion + RAF"],
  ["Surface", "Editorial light fog"]
];

export default function HomePage() {
  return (
    <main className="relative">
      <section className="mx-auto flex min-h-[94svh] w-full max-w-7xl flex-col justify-between px-6 pb-10 pt-24 md:px-10 md:pt-28">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-10">
          <FadeInView className="max-w-5xl">
            <p className="eyebrow text-xs font-medium text-black/40">
              WpDev / Keyboard Architecture / Scrollytelling Study
            </p>
            <h1 className="text-balance mt-6 max-w-5xl text-[clamp(3.5rem,9vw,8.25rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-black/90">
              A keyboard that opens itself as you scroll.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-black/60 md:text-xl">
              WpDev is imagined as premium hardware presented with the restraint
              of an editorial product shoot. The page behaves like a studio
              table: one object, one gesture, and enough time to inspect every
              layer.
            </p>
          </FadeInView>

          <FadeInView
            delay={0.12}
            className="grid gap-6 border-t section-rule pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-2"
          >
            <div className="space-y-3">
              <p className="eyebrow text-xs font-medium text-black/35">
                Editorial Notes
              </p>
              <p className="max-w-sm text-sm leading-7 text-black/55">
                Minimal typography, no decorative interface, and a sequence that
                does the heavy lifting. The hardware remains the focal point.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {specs.map(([label, value]) => (
                <div key={label} className="border-t section-rule pt-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-black/35">
                    {label}
                  </p>
                  <p className="mt-2 text-base tracking-[-0.03em] text-black/75">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </FadeInView>
        </div>

        <FadeInView delay={0.18} className="pt-12">
          <div className="flex items-center gap-4 text-sm text-black/45">
            <span className="h-px w-16 bg-black/15" />
            Scroll to enter the keyboard sequence
          </div>
        </FadeInView>
      </section>

      <KeyboardScroll />

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <FadeInView className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="space-y-6">
            <p className="eyebrow text-xs font-medium text-black/35">
              System Direction
            </p>
            <h2 className="max-w-xl text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-black/90">
              Quiet interaction, mechanical drama.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-black/58">
            The page avoids dashboard clutter and obvious marketing gestures.
            Instead, it uses preload discipline, restrained typography, and a
            single sticky stage to treat the keyboard as a designed object.
            Everything else stays quiet so the sequence remains the event.
          </p>
        </FadeInView>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {detailCards.map((card, index) => (
            <FadeInView
              key={card.title}
              delay={0.08 * index}
              className="rounded-[2rem] border border-black/8 bg-white/42 p-8 shadow-mist backdrop-blur-sm"
            >
              <p className="eyebrow text-xs font-medium text-black/35">
                0{index + 1}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.045em] text-black/88">
                {card.title}
              </h3>
              <p className="mt-4 max-w-sm text-base leading-7 text-black/58">
                {card.copy}
              </p>
            </FadeInView>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-24">
        <FadeInView className="rounded-[2.5rem] border border-black/8 bg-white/45 px-8 py-12 shadow-mist backdrop-blur-md md:px-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="eyebrow text-xs font-medium text-black/35">
                WpDev Atelier
              </p>
              <h2 className="mt-5 max-w-3xl text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-black/90">
                Built to feel less like a website and more like a product room.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-black/58">
              This is ready to extend with pricing, commerce, or product
              configuration, but the foundation is already the right one:
              premium pacing, restrained surfaces, and a sequence that earns the
              user's attention.
            </p>
          </div>
        </FadeInView>
      </section>
    </main>
  );
}
