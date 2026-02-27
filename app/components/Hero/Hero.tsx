'use client';

import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import { useConsultation } from '../../context/ConsultationContext';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { openModal } = useConsultation();

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let isVisible = true;

    const orbs: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      targetX: number;
      targetY: number;
    }> = [];

    const colors = [
      'rgba(200, 164, 86, 0.08)',
      'rgba(212, 183, 106, 0.06)',
      'rgba(58, 90, 140, 0.05)',
    ];

    for (let i = 0; i < 5; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      orbs.push({
        x,
        y,
        radius: Math.random() * 200 + 150,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: colors[i % colors.length],
        targetX: Math.random() * canvas.width,
        targetY: Math.random() * canvas.height,
      });
    }

    const updateTargets = () => {
      orbs.forEach((orb) => {
        orb.targetX = Math.random() * canvas.width;
        orb.targetY = Math.random() * canvas.height;
      });
    };

    // Recursive setTimeout with random delay instead of fixed setInterval
    let targetTimeout: ReturnType<typeof setTimeout>;
    const scheduleTargetUpdate = () => {
      const delay = Math.random() * 3000 + 5000;
      targetTimeout = setTimeout(() => {
        updateTargets();
        scheduleTargetUpdate();
      }, delay);
    };
    scheduleTargetUpdate();

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;

      if (!isVisible) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb) => {
        const dx = orb.targetX - orb.x;
        const dy = orb.targetY - orb.y;
        const easing = 0.002;

        orb.x += dx * easing;
        orb.y += dy * easing;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(orb.x - orb.radius, orb.y - orb.radius, orb.radius * 2, orb.radius * 2);
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    // IntersectionObserver to pause animation when out of viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(section);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(targetTimeout);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas}></canvas>

      <div className={styles.content}>
        <div className={styles.tagline}>MEDICAL CLINIC BUSINESS PARTNER</div>

        <h1 className={styles.headline}>
          <span className={styles.firstLine}><span className={styles.tightWord}>병원의</span> <span className={styles.tightWord}>성장</span> 뒤에는</span><br />
          세무법인 스타택스가 있습니다
        </h1>

        <p className={styles.subheadline}>
          병의원 전문 세무경영 컨설팅부터 법인·상속·경정청구 등<br />
          10년 이상의 전문가들과 원스톱으로 함께합니다.
        </p>

        <button onClick={openModal} className={styles.cta}>
          컨설팅 신청 →
        </button>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>15,600+</span>
            <span className={styles.statLabel}>세무 컨설팅</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statValue}>600+</span>
            <span className={styles.statLabel}>누적 환급 업체수</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statValue}>7개</span>
            <span className={styles.statLabel}>수도권 지점</span>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine}></div>
      </div>
    </section>
  );
}
