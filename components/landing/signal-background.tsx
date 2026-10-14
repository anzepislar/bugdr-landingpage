"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Flowing edge ribbons with scroll response; the center stays clear.
 *  The homepage renders its own instance inside the hero background (so the
 *  ribbons sit above the floating panels); the layout instance covers every
 *  other page. `home` picks which one is live, so only one canvas runs. */
export function SignalBackground({ home = false }: { home?: boolean }) {
  const onHome = (usePathname() ?? "/").replace(/\/+$/, "") === "";
  return onHome === home ? <SignalCanvas /> : null;
}

function SignalCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let position = scrollY;
    let target = scrollY;
    let lastTime = 0;
    let drift = 0;

    // A deterministic distribution avoids changes between resize and redraw.
    const noise = (n: number) => {
      const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return value - Math.floor(value);
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      const mobile = width < 768;
      const count = mobile ? 320 : 1800;
      const spread = mobile ? 42 : Math.min(170, width * .09);
      const phase = reduced.matches ? 0 : position * .00065 + drift;
      for (let side = 0; side < 2; side++) {
        for (let i = 0; i < count; i++) {
          const seed = i + side * count;
          const t = noise(seed + 1);
          const y = ((t * (height + 160) - phase * 72 * (side ? -.65 : 1)) % (height + 160) + height + 160) % (height + 160) - 80;
          const wave = y / Math.max(height, 1) * 5.2 + phase + side * 2.8;
          const center = (mobile ? 8 : 30) + spread * (.55 + .48 * Math.sin(wave));
          const offset = (noise(seed + 9001) - .5) * spread * (.35 + .65 * Math.pow(Math.sin(wave * .6), 2));
          const x = side ? width - center - offset : center + offset;
          const edgeFade = Math.max(0, 1 - (side ? width - x : x) / (spread * 2));
          const alpha = (.3 + noise(seed + 4001) * .6) * edgeFade * (mobile ? .8 : 1);
          context.strokeStyle = i % 3 === 0 ? `rgba(235,243,255,${alpha})` : `rgba(139,172,255,${alpha})`;
          context.lineWidth = i % 7 === 0 ? 1.7 : 1.1;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x + Math.cos(wave) * 2, y + 1.8 + noise(seed + 71) * 3.5);
          context.stroke();
        }
      }
    };
    const animate = (time: number) => {
      frame = 0;
      if (reduced.matches || document.hidden) { lastTime = 0; return; }
      const dt = Math.min(64, time - (lastTime || time - 16));
      lastTime = time;
      drift += dt * (width < 768 ? .00007 : .00011);
      position += (target - position) * (1 - Math.exp(-dt / 110));
      draw();
      // Phones only redraw while the scroll is settling, not every frame forever.
      if (width < 768 && Math.abs(target - position) < .5) { lastTime = 0; return; }
      frame = requestAnimationFrame(animate);
    };
    const scroll = () => {
      target = window.scrollY;
      if (!reduced.matches && !frame && !document.hidden) frame = requestAnimationFrame(animate);
    };
    const resize = () => {
      // On phones the address bar changes innerHeight while scrolling; size to
      // the full screen height once so those changes don't rebuild the canvas.
      const nextHeight = window.innerWidth < 768 ? Math.max(window.innerHeight, screen.height) : window.innerHeight;
      if (window.innerWidth === width && nextHeight === height) return;
      width = window.innerWidth;
      height = nextHeight;
      element.style.height = `${height}px`;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };
    const preference = () => { cancelAnimationFrame(frame); frame = 0; lastTime = 0; position = target = window.scrollY; draw(); scroll(); };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; } else scroll(); };
    resize();
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", preference);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preference);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full print:hidden" data-signal-background />;
}
