"use client";

import { useEffect } from "react";

/**
 * Drives the card breathing glow effect.
 *
 * Runs a requestAnimationFrame loop that sets --breathe-intensity (0–1)
 * on each .card-spark-shell element. The value creates a directional wave:
 * bottom-to-top inhale, top-to-bottom exhale — same as Current OS.
 *
 * No React state, no re-renders. Pure DOM manipulation, GPU-composited.
 */
export default function CardBreathEffect() {
  useEffect(() => {
    let globalPhase = 0;
    let rafId: number;
    const SPEED = 0.0006;

    const tick = () => {
      globalPhase += SPEED;

      const shells = document.querySelectorAll<HTMLElement>(".card-spark-shell");
      const viewportHeight = window.innerHeight;

      for (const shell of shells) {
        const rect = shell.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        // Position offset creates the wave — cards at different heights breathe at different phases
        const posOffset = (centerY / viewportHeight) * Math.PI * 2;
        const intensity = 0.5 + 0.5 * Math.cos(globalPhase - posOffset);
        shell.style.setProperty("--breathe-intensity", intensity.toFixed(3));
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return null;
}
