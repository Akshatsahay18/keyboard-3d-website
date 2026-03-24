"use client";

import {
  motion,
  type MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const FRAME_COUNT = 120;
const FALLBACK_PNG_TOTAL = 192;

type SequenceDescriptor = {
  id: string;
  count: number;
  getSrc: (index: number) => string;
  probeIndex: number;
};

type LoadedImage = HTMLImageElement | null;

const SEQUENCE_CANDIDATES: SequenceDescriptor[] = [
  {
    id: "webp-root",
    count: FRAME_COUNT,
    probeIndex: 0,
    getSrc: (index) => `/frame_${index}_delay-0.04s.webp`
  },
  {
    id: "webp-frames-folder",
    count: FRAME_COUNT,
    probeIndex: 0,
    getSrc: (index) => `/frames/frame_${index}_delay-0.04s.webp`
  },
  {
    id: "webp-keyboard-sequence-folder",
    count: FRAME_COUNT,
    probeIndex: 0,
    getSrc: (index) => `/keyboard-sequence/frame_${index}_delay-0.04s.webp`
  },
  {
    id: "webp-existing-folder",
    count: FRAME_COUNT,
    probeIndex: 0,
    getSrc: (index) => encodeURI(`/keyboard sequcence/frame_${index}_delay-0.04s.webp`)
  },
  {
    id: "png-fallback",
    count: FRAME_COUNT,
    probeIndex: 0,
    getSrc: (index) => {
      const mappedFrame =
        Math.round((index / (FRAME_COUNT - 1)) * (FALLBACK_PNG_TOTAL - 1)) + 1;
      return encodeURI(
        `/keyboard sequcence/${String(mappedFrame).padStart(5, "0")}.png`
      );
    }
  }
];

const STORY_BEATS = [
  {
    label: "0% Scroll",
    title: "WpDev Keyboard.",
    copy: "Engineered clarity.",
    range: [0, 0.08, 0.18] as const,
    className:
      "left-1/2 top-[8vh] w-[88vw] max-w-[34rem] -translate-x-1/2 text-center md:top-[10vh]"
  },
  {
    label: "25% Scroll",
    title: "Built for Precision.",
    copy: "Every detail, measured.",
    range: [0.16, 0.25, 0.38] as const,
    className:
      "left-4 top-[16vh] w-[70vw] max-w-[24rem] text-left md:left-8 md:top-[22vh] lg:left-[6vw]"
  },
  {
    label: "60% Scroll",
    title: "Layered Engineering.",
    copy: "See what's inside.",
    range: [0.5, 0.6, 0.74] as const,
    className:
      "right-4 top-[16vh] w-[70vw] max-w-[24rem] text-right md:right-8 md:top-[22vh] lg:right-[6vw]"
  },
  {
    label: "90% Scroll",
    title: "Assembled. Ready.",
    copy: "Scroll back to replay.",
    range: [0.82, 0.9, 1] as const,
    className:
      "left-1/2 bottom-[10vh] w-[88vw] max-w-[34rem] -translate-x-1/2 text-center md:bottom-[12vh]"
  }
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function probeImage(src: string) {
  return new Promise<boolean>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  });
}

async function resolveSequence() {
  for (const candidate of SEQUENCE_CANDIDATES) {
    const exists = await probeImage(candidate.getSrc(candidate.probeIndex));

    if (exists) {
      return candidate;
    }
  }

  return SEQUENCE_CANDIDATES[SEQUENCE_CANDIDATES.length - 1];
}

function StoryOverlay({
  progress,
  label,
  title,
  copy,
  range,
  className
}: {
  progress: MotionValue<number>;
  label: string;
  title: string;
  copy: string;
  range: readonly [number, number, number];
  className: string;
}) {
  const inputRange = [...range];
  const opacity = useTransform(progress, inputRange, [0, 1, 0]);
  const y = useTransform(progress, inputRange, [10, 0, -10]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute pointer-events-none px-4 ${className}`}
    >
      <p className="eyebrow text-[11px] font-medium tracking-[0.22em] text-black/35">
        {label}
      </p>
      <h2 className="mt-3 text-[clamp(2rem,4vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-black/90">
        {title}
      </h2>
      <p className="mt-3 text-base leading-7 text-black/60 md:text-lg">
        {copy}
      </p>
    </motion.div>
  );
}

export default function KeyboardScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameWrapRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<LoadedImage[]>([]);
  const activeSequenceRef = useRef<SequenceDescriptor | null>(null);
  const drawRafRef = useRef<number | null>(null);
  const pendingFrameRef = useRef(0);
  const drawnFrameRef = useRef(-1);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(FRAME_COUNT);
  const [isReady, setIsReady] = useState(false);
  const [sequenceLabel, setSequenceLabel] = useState("Detecting sequence");
  const [hasError, setHasError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const loadingProgress = totalCount === 0 ? 0 : loadedCount / totalCount;
  const loadingText = useMemo(() => {
    if (hasError) {
      return "Unable to load the WpDev sequence.";
    }

    if (isReady) {
      return "Sequence loaded.";
    }

    return `Loading WpDev sequence... ${Math.round(loadingProgress * 100)}%`;
  }, [hasError, isReady, loadingProgress]);

  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const frameWrap = frameWrapRef.current;
    const sequence = imagesRef.current;

    if (!canvas || !frameWrap || sequence.length === 0) {
      return;
    }

    const image = sequence[frameIndex];

    if (!image) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const bounds = frameWrap.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextWidth = Math.round(width * dpr);
    const nextHeight = Math.round(height * dpr);

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const scale = Math.min(
      width / image.naturalWidth,
      height / image.naturalHeight
    );
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  };

  useEffect(() => {
    let cancelled = false;

    const markSequenceReady = (successfulCount: number, frameCount: number) => {
      if (successfulCount === 0) {
        setHasError(true);
        return;
      }

      setIsReady(true);
      pendingFrameRef.current = clamp(
        Math.round(scrollYProgress.get() * (frameCount - 1)),
        0,
        frameCount - 1
      );
      drawnFrameRef.current = -1;
      drawFrame(pendingFrameRef.current);
      drawnFrameRef.current = pendingFrameRef.current;
    };

    const prepareSequence = async () => {
      const sequence = await resolveSequence();

      if (cancelled) {
        return;
      }

      activeSequenceRef.current = sequence;
      setTotalCount(sequence.count);
      setSequenceLabel(
        sequence.id === "png-fallback" ? "PNG fallback" : "WebP sequence"
      );
      setLoadedCount(0);
      setIsReady(false);
      setHasError(false);

      const loadedImages: LoadedImage[] = new Array(sequence.count).fill(null);
      let settled = 0;
      let succeeded = 0;

      imagesRef.current = loadedImages;

      for (let index = 0; index < sequence.count; index += 1) {
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          if (cancelled) {
            return;
          }

          loadedImages[index] = image;
          settled += 1;
          succeeded += 1;
          setLoadedCount(settled);

          if (index === 0) {
            drawnFrameRef.current = 0;
            drawFrame(0);
          }

          if (settled === sequence.count) {
            markSequenceReady(succeeded, sequence.count);
          }
        };
        image.onerror = () => {
          if (cancelled) {
            return;
          }

          settled += 1;
          setLoadedCount(settled);

          if (settled === sequence.count) {
            markSequenceReady(succeeded, sequence.count);
          }
        };
        image.src = sequence.getSrc(index);
      }
    };

    prepareSequence();

    return () => {
      cancelled = true;

      if (drawRafRef.current !== null) {
        window.cancelAnimationFrame(drawRafRef.current);
      }
    };
  }, [scrollYProgress]);

  useEffect(() => {
    const handleResize = () => {
      if (!isReady || drawnFrameRef.current < 0) {
        return;
      }

      drawFrame(drawnFrameRef.current);
    };

    const observer = new ResizeObserver(handleResize);

    if (frameWrapRef.current) {
      observer.observe(frameWrapRef.current);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [isReady]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const sequence = activeSequenceRef.current;

    if (!sequence || !isReady) {
      return;
    }

    pendingFrameRef.current = clamp(
      Math.round(value * (sequence.count - 1)),
      0,
      sequence.count - 1
    );

    if (
      pendingFrameRef.current === drawnFrameRef.current ||
      drawRafRef.current !== null
    ) {
      return;
    }

    drawRafRef.current = window.requestAnimationFrame(() => {
      drawRafRef.current = null;

      if (pendingFrameRef.current === drawnFrameRef.current) {
        return;
      }

      drawFrame(pendingFrameRef.current);
      drawnFrameRef.current = pendingFrameRef.current;
    });
  });

  return (
    <section ref={sectionRef} className="relative h-[400vh]">
      <div
        ref={frameWrapRef}
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.32),transparent_34%),linear-gradient(180deg,rgba(216,222,227,0.74),rgba(201,208,216,0.28)_28%,rgba(168,177,187,0.2)_100%)]" />
        <canvas
          ref={canvasRef}
          className="relative z-10 h-screen w-full"
          aria-label="WpDev keyboard animation"
        />

        <div className="pointer-events-none absolute inset-0 z-20">
          {STORY_BEATS.map((beat) => (
            <StoryOverlay
              key={beat.label}
              progress={scrollYProgress}
              label={beat.label}
              title={beat.title}
              copy={beat.copy}
              range={beat.range}
              className={beat.className}
            />
          ))}
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: isReady ? 0 : 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(200,208,215,0.66)] backdrop-blur-md"
          aria-hidden={isReady}
        >
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border border-black/10 border-t-black/45" />
            <div className="space-y-2">
              <p className="text-sm tracking-[-0.03em] text-black/65">
                {loadingText}
              </p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-black/32">
                {loadedCount}/{totalCount} frames · {sequenceLabel}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
