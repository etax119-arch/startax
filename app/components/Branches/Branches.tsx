'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './Branches.module.css';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface Branch {
  id: string;
  name: string;
  taxAgent: string;
  title: string;
  slogan: React.ReactNode;
  phone: string;
  address: string;
  photo: string | null;
  link: string;
}

function renderSlogan(text: string): React.ReactNode {
  const parts = text.split(/(<strong>.*?<\/strong>|<br\s*\/?>)/g);
  return parts.map((part, i) => {
    if (part.startsWith('<strong>')) {
      return <strong key={i}>{part.replace(/<\/?strong>/g, '')}</strong>;
    }
    if (part.match(/^<br\s*\/?>$/)) {
      return <br key={i} />;
    }
    return part;
  });
}

const branchData: Branch[] = [
  {
    id: 'gangnam',
    name: '강남',
    taxAgent: '조준섭',
    title: '세무사',
    slogan: renderSlogan('<strong>국세청 14년 경력!</strong> 어떤 세무사와 함께 하느냐에 따라<br/>사업의 미래가 달라집니다.'),
    phone: '02-567-2395',
    address: '서울 강남구 강남대로84길 23',
    photo: '/assets/used/branches/gangnam.png',
    link: 'https://blog.naver.com/nts_star2',
  },
  {
    id: 'namyangju',
    name: '남양주',
    taxAgent: '김명하',
    title: '세무사',
    slogan: renderSlogan('<strong>일등세무 해결사!</strong><br/>김명하 입니다.'),
    phone: '010-5749-7511',
    address: '경기 남양주시 다산지금로 202',
    photo: '/assets/used/branches/namyangju.png',
    link: 'https://blog.naver.com/audgkehdrm',
  },
  {
    id: 'bucheon',
    name: '부천',
    taxAgent: '김용삼',
    title: '세무사',
    slogan: renderSlogan('첫 마음 그대로.<br/><strong>고객과 함께</strong>하겠습니다.'),
    phone: '032-1899-2395',
    address: '경기 부천시 중동 1111',
    photo: '/assets/used/branches/bucheon.png',
    link: 'https://blog.naver.com/tax1899',
  },
  {
    id: 'bucheonnam',
    name: '부천남지',
    taxAgent: '이하윤',
    title: '세무사',
    slogan: renderSlogan('세법에 대해 조금이라도<br/><strong>쉽게 알 수 있도록 노력</strong>하고 있습니다.'),
    phone: '032-342-2395',
    address: '경기 부천시 목감동 745-5',
    photo: '/assets/used/branches/bucheonnam.png',
    link: '',
  },
  {
    id: 'yeouido',
    name: '여의도',
    taxAgent: '강연지',
    title: '세무사',
    slogan: renderSlogan('<strong>성실함과 노력</strong>으로 증명하겠습니다.'),
    phone: '0507-1378-2360',
    address: '서울 영등포구 당산로 171-173',
    photo: '/assets/used/branches/yeouido.png',
    link: 'https://blog.naver.com/jeetax81',
  },
  {
    id: 'suwon',
    name: '수원',
    taxAgent: '김동현',
    title: '세무사',
    slogan: renderSlogan('빠르게 변화하는 세법에<br/><strong>발맞춰 연구하며, 대응</strong>하고<br/>가능성을 제시합니다.'),
    phone: '0507-1425-3369',
    address: '경기 수원시 영통로 41-1',
    photo: '/assets/used/branches/suwon.png',
    link: 'https://blog.naver.com/taxst3330',
  },
];

const PROFILE_IMAGE_STYLES: Record<string, string | undefined> = {
  namyangju: styles.profileImageNamyangju,
  bucheon: styles.profileImageBucheon,
  bucheonnam: styles.profileImageBucheonnam,
  suwon: styles.profileImageSuwon,
};

export default function Branches() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useBodyScrollLock(isModalOpen);
  const { containerRef, handleKeyDown } = useFocusTrap(isModalOpen);

  const openModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBranch(null), 200);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen, closeModal]);

  return (
    <section id="contact" className={styles.branches}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tag}>BRANCHES</div>
          <h2 className={styles.headline}>지점 안내</h2>
        </div>

        <div className={styles.grid}>
          {branchData.map((branch) => (
            <div
              key={branch.id}
              className={styles.card}
              onClick={() => openModal(branch)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openModal(branch)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.name}>{branch.name}</div>
                <div className={styles.cpa}>세무사 {branch.taxAgent}</div>
              </div>
              <div className={styles.address}>{branch.address}</div>
              <div className={styles.cardFooter}>
                <span className={styles.phone}>{branch.phone}</span>
                <span className={styles.viewMore}>자세히 보기 →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedBranch && (
        <div
          className={`${styles.modalOverlay} ${isModalOpen ? styles.modalOverlayActive : ''}`}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          ref={containerRef}
          onKeyDown={handleKeyDown}
        >
          <div
            className={`${styles.modal} ${isModalOpen ? styles.modalActive : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Geometric Pattern Background */}
            <div className={styles.modalPattern}></div>

            {/* Close Button */}
            <button
              className={styles.closeButton}
              onClick={closeModal}
              aria-label="닫기"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className={styles.modalContent}>
              {/* Profile Photo Area */}
              <div className={styles.modalPhoto}>
                {selectedBranch.photo ? (
                  <Image
                    src={selectedBranch.photo}
                    alt={`${selectedBranch.taxAgent} ${selectedBranch.title}`}
                    width={300}
                    height={400}
                    className={`${styles.profileImage} ${PROFILE_IMAGE_STYLES[selectedBranch.id] ?? ''}`}
                  />
                ) : (
                  <div className={styles.profilePlaceholder}>
                    <span className={styles.profileInitial}>
                      {selectedBranch.taxAgent.charAt(0)}
                    </span>
                    <svg className={styles.profileIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className={styles.modalInfo}>
                <div className={styles.modalBranchTag}>{selectedBranch.name}점</div>
                <h3 id="modal-title" className={styles.modalName}>
                  {selectedBranch.taxAgent} <span className={styles.modalTitle}>{selectedBranch.title}</span>
                </h3>

                {selectedBranch.slogan && (
                  <p className={styles.modalSlogan}>
                    {selectedBranch.slogan}
                  </p>
                )}

                <a
                  href={`tel:${selectedBranch.phone.replace(/[^0-9]/g, '')}`}
                  className={styles.modalPhone}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  {selectedBranch.phone}
                </a>

                <p className={styles.modalAddress}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {selectedBranch.address}
                </p>

                {selectedBranch.link && (
                  <a
                    href={selectedBranch.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.modalCta}
                  >
                    자세히 알아보기
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
