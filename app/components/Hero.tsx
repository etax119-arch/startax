'use client';

import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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

    // 골드-블루 그라데이션 오브 생성
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
        targetX: Math.random() * canvas.width, // 처음부터 다른 타겟 설정
        targetY: Math.random() * canvas.height,
      });
    }

    // 타겟 위치를 주기적으로 변경
    const updateTargets = () => {
      orbs.forEach((orb) => {
        orb.targetX = Math.random() * canvas.width;
        orb.targetY = Math.random() * canvas.height;
      });
    };

    // 5-8초마다 새로운 타겟 설정
    const targetInterval = setInterval(() => {
      updateTargets();
    }, Math.random() * 3000 + 5000);

    function animate() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb) => {
        // 타겟 위치로 서서히 이동 (easing)
        const dx = orb.targetX - orb.x;
        const dy = orb.targetY - orb.y;
        const easing = 0.002; // 이동 속도 (낮을수록 더 부드럽게)

        orb.x += dx * easing;
        orb.y += dy * easing;

        // 그라데이션 오브 그리기
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(orb.x - orb.radius, orb.y - orb.radius, orb.radius * 2, orb.radius * 2);
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(targetInterval);
    };
  }, []);

  return (
    <section className={styles.hero}>
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

        <a href="tel:02-423-7110" className={styles.cta}>
          컨설팅 신청 →
        </a>

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