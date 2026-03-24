"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SequenceCanvas from "@/components/sequence-canvas";

function StoryBeat({
  progress,
  range,
  label,
  title,
  copy,
  className = ""
}) {
  const opacity = useTransform(
    progress,
    [range[0], range[1], range[2]],
    [0, 1, 0]
  );
  const y = useTransform(progress, [range[0], range[1], range[2]], [40, 0, -28]);

  return (
    <motion.div style={{ opacity, y }} className={`absolute ${className}`}>
      <p className="eyebrow text-[11px] font-medium text-black/35">{label}</p>
      <h3 className="mt-4 max-w-md text-[clamp(1.75rem,4vw,3.8rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-black/90">
        {title}
      </h3>
      <p className="mt-4 max-w-sm text-sm leading-7 text-black/55 md:text-base">
        {copy}
      </p>
    </motion.div>
  );
}

export default function SequenceScrollytelling() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const playhead = useTransform(
    scrollYProgress,
    [0, 0.1, 0.56, 0.76, 1],
    [0, 0, 1, 1, 0]
  );
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0, 0.06, 0.16], [1, 1, 0]);

  return (
    <section ref={sectionRef} className="relative h-[360svh] md:h-[390svh] lg:h-[430svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.42),transparent_32%),linear-gradient(180deg,rgba(220,226,231,0.68),rgba(199,208,216,0.18)_30%,rgba(168,177,187,0.24)_100%)]" />
        <SequenceCanvas progress={playhead} />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(216,222,227,0.95)] to-transparent md:h-32" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[rgba(168,177,187,0.9)] to-transparent md:h-40" />

        <div className="pointer-events-none absolute inset-0 mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between gap-6">
              <motion.div style={{ opacity: labelOpacity }} className="max-w-xs">
                <p className="eyebrow text-[11px] font-medium text-black/35">
                  Scroll-linked hardware study
                </p>
                <p className="mt-3 text-sm leading-6 text-black/50">
                  Move slowly. The object disassembles in-place, pauses in its
                  exposed state, and closes itself at the end of the scroll.
                </p>
              </motion.div>

              <div className="hidden items-center gap-4 md:flex">
                <span className="eyebrow text-[11px] font-medium text-black/28">
                  Scroll Progress
                </span>
                <div className="h-px w-40 origin-left bg-black/10">
                  <motion.div
                    style={{ scaleX: progressScale }}
                    className="h-px origin-left bg-black/50"
                  />
                </div>
              </div>
            </div>

            <div className="relative flex-1">
              <StoryBeat
                progress={scrollYProgress}
                range={[0.02, 0.12, 0.24]}
                label="Closed Form"
                title="A quiet object, suspended in fog."
                copy="The introduction stays restrained. No UI noise, no parallax tricks, just enough stillness to establish the keyboard as a premium industrial object."
                className="left-0 top-[16svh] max-w-sm md:left-4 md:top-[20svh]"
              />
              <StoryBeat
                progress={scrollYProgress}
                range={[0.22, 0.34, 0.46]}
                label="Primary Separation"
                title="Case, plate, and keycaps begin to drift apart."
                copy="The motion is scroll-bound rather than autoplayed, letting the visitor control the speed and inspect the transformation without losing context."
                className="right-0 top-[18svh] max-w-sm text-right md:right-4 md:top-[18svh]"
              />
              <StoryBeat
                progress={scrollYProgress}
                range={[0.42, 0.58, 0.74]}
                label="Open Architecture"
                title="Internal layers hold long enough to read."
                copy="Switches, plate, battery, and PCB all remain visible at once, turning the animation into a product teardown rather than a decorative transition."
                className="left-0 bottom-[18svh] max-w-md md:left-[8%] md:bottom-[18svh]"
              />
              <StoryBeat
                progress={scrollYProgress}
                range={[0.74, 0.86, 0.98]}
                label="Resealed"
                title="Then every part settles back into one complete instrument."
                copy="The reverse motion gives the scroll a full arc. The user ends where they began, but with a clearer sense of the build beneath the surface."
                className="right-0 bottom-[16svh] max-w-sm text-right md:right-[6%] md:bottom-[20svh]"
              />
            </div>

            <div className="flex items-end justify-between gap-6 text-[11px] uppercase tracking-[0.2em] text-black/30">
              <span>WpDev keyboard / 192 frames / canvas render</span>
              <span className="hidden md:inline">Next.js 14 / Tailwind / Framer Motion</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
