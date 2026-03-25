"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  radius: number;
  color: string;
  phase: number;
  vx: number;
  vy: number;
}

const NODE_COLORS = [
  "rgba(109, 184, 124, 0.9)", // bioluminescent green — bright nodes
  "rgba(109, 184, 124, 0.6)", // green, mid
  "rgba(212, 165, 116, 0.8)", // electric amber — junction points
  "rgba(212, 165, 116, 0.5)", // amber, faint
  "rgba(74, 140, 90, 0.5)", // deep forest green
  "rgba(138, 123, 196, 0.25)", // ghost lavender, very faint
];

const CONNECTION_THRESHOLD = 160;

export default function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      nodesRef.current = Array.from({ length: 28 }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 1.5 + Math.random() * 4,
        color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
        phase: (i / 28) * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.06,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    let globalPhase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      globalPhase += 0.0005;

      const nodes = nodesRef.current;

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -20) node.x = canvas.width + 20;
        if (node.x > canvas.width + 20) node.x = -20;
        if (node.y < -20) node.y = canvas.height + 20;
        if (node.y > canvas.height + 20) node.y = -20;
      }

      // Mycelium strands between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_THRESHOLD) {
            const posPhase = -(nodes[i].y / canvas.height) * Math.PI;
            const breathe = 0.4 + 0.6 * Math.cos(globalPhase + posPhase);
            const alpha = (1 - dist / CONNECTION_THRESHOLD) * 0.12 * breathe;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(109, 184, 124, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Glowing nodes
      for (const node of nodes) {
        const posPhase = -(node.y / canvas.height) * Math.PI * 1.5;
        const breathe = 0.35 + 0.65 * Math.cos(globalPhase + posPhase + node.phase);
        ctx.save();
        ctx.globalAlpha = breathe * 0.8 + 0.2;
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 5);
        glow.addColorStop(0, node.color);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = breathe;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.55 }}
      aria-hidden="true"
    />
  );
}
