import { useEffect, useRef } from 'react';

/** Drifting starfield with occasional gold motes and shooting stars. */
export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    type Star = { x: number; y: number; r: number; a: number; tw: number; vy: number; gold: boolean };
    let stars: Star[] = [];
    let shoot: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let raf = 0;
    let t = 0;
    let scrollY = window.scrollY;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 5200);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * 0.7 + 0.2,
        tw: Math.random() * Math.PI * 2,
        vy: Math.random() * 0.06 + 0.01,
        gold: Math.random() < 0.12,
      }));
    };

    const frame = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      const parallax = scrollY * 0.05;
      for (const s of stars) {
        s.y -= s.vy;
        if (s.y < -4) s.y = h + 4;
        const tw = 0.55 + 0.45 * Math.sin(t * 0.02 + s.tw);
        const y = (((s.y - parallax * s.r) % h) + h) % h;
        ctx.globalAlpha = s.a * tw;
        if (s.gold) {
          const g = ctx.createRadialGradient(s.x, y, 0, s.x, y, s.r * 5);
          g.addColorStop(0, 'rgba(255,225,160,0.9)');
          g.addColorStop(1, 'rgba(232,192,104,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(s.x, y, s.r * 5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#e9e4ff';
          ctx.beginPath();
          ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!shoot && Math.random() < 0.003) {
        shoot = { x: Math.random() * w * 0.8 + w * 0.2, y: Math.random() * h * 0.4, vx: -6 - Math.random() * 4, vy: 2.5 + Math.random() * 2, life: 1 };
      }
      if (shoot) {
        ctx.globalAlpha = shoot.life;
        const grad = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx * 14, shoot.y - shoot.vy * 14);
        grad.addColorStop(0, 'rgba(255,240,200,1)');
        grad.addColorStop(1, 'rgba(255,240,200,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(shoot.x, shoot.y);
        ctx.lineTo(shoot.x - shoot.vx * 14, shoot.y - shoot.vy * 14);
        ctx.stroke();
        shoot.x += shoot.vx;
        shoot.y += shoot.vy;
        shoot.life -= 0.012;
        if (shoot.life <= 0) shoot = null;
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(frame);
    };

    resize();
    if (reduce) frame();
    else raf = requestAnimationFrame(frame);
    if (reduce) cancelAnimationFrame(raf);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <>
      <div className="bg-glow" />
      <canvas ref={ref} className="bg-canvas" />
      <div className="bg-pattern" />
    </>
  );
}
