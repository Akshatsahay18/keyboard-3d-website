"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 192;

function buildFrameSources(step) {
  const frames = [];

  for (let frame = 1; frame <= TOTAL_FRAMES; frame += step) {
    const fileName = `${String(frame).padStart(5, "0")}.png`;
    frames.push(encodeURI(`/keyboard sequcence/${fileName}`));
  }

  if (!frames[frames.length - 1]?.endsWith("00192.png")) {
    frames.push(encodeURI("/keyboard sequcence/00192.png"));
  }

  return frames;
}

function getAdaptiveStep() {
  if (typeof window === "undefined") {
    return 1;
  }

  const prefersReducedData =
    typeof navigator !== "undefined" &&
    (navigator.connection?.saveData || navigator.deviceMemory <= 4);

  if (prefersReducedData || window.innerWidth < 820) {
    return 2;
  }

  return 1;
}

export default function SequenceCanvas({ progress }) {
  const canvasRef = useRef(null);
  const frameSourcesRef = useRef([]);
  const imagesRef = useRef([]);
  const drawFrameRef = useRef(null);
  const frameIndexRef = useRef(0);
  const loadedCountRef = useRef(0);
  const [frameCount, setFrameCount] = useState(TOTAL_FRAMES);
  const [loadingRatio, setLoadingRatio] = useState(0);

  const statusLabel = useMemo(() => {
    if (loadingRatio >= 1) {
      return `${frameCount}-frame sequence loaded`;
    }

    return `Loading ${Math.round(loadingRatio * 100)}%`;
  }, [frameCount, loadingRatio]);

  useEffect(() => {
    const step = getAdaptiveStep();
    const sources = buildFrameSources(step);
    let cancelled = false;

    frameSourcesRef.current = sources;
    imagesRef.current = new Array(sources.length);
    frameIndexRef.current = 0;
    loadedCountRef.current = 0;
    setFrameCount(sources.length);
    setLoadingRatio(0);

    const drawFrame = (requestedIndex) => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      const chosenImage =
        imagesRef.current[requestedIndex] ||
        findNearestLoadedFrame(imagesRef.current, requestedIndex) ||
        imagesRef.current[0];

      if (!chosenImage) {
        return;
      }

      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (
        canvas.width !== Math.round(width * dpr) ||
        canvas.height !== Math.round(height * dpr)
      ) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      const scale = Math.max(width / chosenImage.width, height / chosenImage.height);
      const drawWidth = chosenImage.width * scale;
      const drawHeight = chosenImage.height * scale;
      const offsetX = (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(chosenImage, offsetX, offsetY, drawWidth, drawHeight);
    };

    const handleResize = () => {
      drawFrame(frameIndexRef.current);
    };

    window.addEventListener("resize", handleResize);

    sources.forEach((source, index) => {
      const image = new Image();
      image.decoding = "async";
      image.src = source;

      image.onload = () => {
        if (cancelled) {
          return;
        }

        imagesRef.current[index] = image;
        loadedCountRef.current += 1;
        setLoadingRatio(loadedCountRef.current / sources.length);

        if (index === 0) {
          drawFrame(0);
        }
      };
    });

    drawFrameRef.current = drawFrame;

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useMotionValueEvent(progress, "change", (value) => {
    const drawFrame = drawFrameRef.current;
    const count = frameSourcesRef.current.length;

    if (!drawFrame || !count) {
      return;
    }

    const nextFrame = Math.min(
      count - 1,
      Math.max(0, Math.round(value * (count - 1)))
    );

    if (nextFrame === frameIndexRef.current) {
      return;
    }

    frameIndexRef.current = nextFrame;
    drawFrame(nextFrame);
  });

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        aria-label="WpDev keyboard image-sequence canvas"
      />
      <div className="pointer-events-none absolute inset-x-6 top-6 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-black/35 md:inset-x-10 md:top-8">
        <span>Sequence canvas</span>
        <motion.span
          animate={{ opacity: loadingRatio >= 1 ? 0.5 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {statusLabel}
        </motion.span>
      </div>
    </div>
  );
}

function findNearestLoadedFrame(images, targetIndex) {
  for (let offset = 1; offset < images.length; offset += 1) {
    if (images[targetIndex - offset]) {
      return images[targetIndex - offset];
    }

    if (images[targetIndex + offset]) {
      return images[targetIndex + offset];
    }
  }

  return null;
}
