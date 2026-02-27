'use client';

import { useState, useEffect } from 'react';
import styles from './ConsultationModal.module.css';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { FIELD_LIMITS } from '../../lib/validation';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    category: '',
    message: '',
    privacyAgreed: false,
  });

  useBodyScrollLock(isOpen);
  const { containerRef, handleKeyDown } = useFocusTrap(isOpen);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
        setIsPrivacyOpen(false);
        setFormData({ name: '', company: '', phone: '', category: '', message: '', privacyAgreed: false });
      }, 300);
      return () => clearTimeout(timer);
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          phone: formData.phone,
          category: formData.category,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        throw new Error('전송 실패');
      }

      setIsSubmitted(true);
    } catch {
      alert('상담 신청 전송에 실패했습니다.\n전화(02-423-7110)로 문의해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Boolean(
    formData.name &&
    formData.phone &&
    formData.category &&
    formData.message &&
    formData.privacyAgreed
  );

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="닫기">
          &times;
        </button>

        {!isSubmitted ? (
          <>
            <div className={styles.header}>
              <h2 id="consultation-modal-title" className={styles.title}>전문가 상담 신청</h2>
              <p className={styles.subtitle}>
                세무 전문가가 직접 상담해 드립니다.<br />
                아래 정보를 남겨주시면 빠른 시일 내에 연락드리겠습니다.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    이름 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={styles.input}
                    placeholder="이름을 입력해주세요"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.name}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>기업명</label>
                  <input
                    type="text"
                    name="company"
                    className={styles.input}
                    placeholder="기업명을 입력해주세요"
                    value={formData.company}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.company}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    연락처 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className={styles.input}
                    placeholder="연락처를 입력해주세요"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.phone}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    문의분야 <span className={styles.required}>*</span>
                  </label>
                  <select
                    name="category"
                    className={styles.select}
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">문의분야를 선택해주세요</option>
                    <option value="기장대리">기장대리</option>
                    <option value="세무조정">세무조정</option>
                    <option value="양도세">양도세</option>
                    <option value="상속세">상속세</option>
                    <option value="증여세">증여세</option>
                    <option value="경정청구">경정청구</option>
                    <option value="세무조사">세무조사 대응</option>
                    <option value="병의원 컨설팅">병의원 컨설팅</option>
                    <option value="경영 컨설팅">경영 컨설팅</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label}>
                    문의 내용 <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    name="message"
                    className={styles.textarea}
                    placeholder="문의하실 내용을 자세히 입력해주세요"
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.message}
                    required
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="privacyAgreed"
                      name="privacyAgreed"
                      className={styles.checkbox}
                      checked={formData.privacyAgreed}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="privacyAgreed" className={styles.checkboxLabel}>
                      개인정보 수집 및 활용에 동의합니다.{' '}
                      <button
                        type="button"
                        className={styles.privacyLink}
                        onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
                        aria-expanded={isPrivacyOpen}
                      >
                        ({isPrivacyOpen ? '닫기' : '보기'})
                      </button>
                    </label>
                  </div>
                  {isPrivacyOpen && (
                    <div className={styles.privacyContent}>
                      <p>
                        <strong>수집 항목:</strong> 이름, 기업명, 연락처, 문의분야, 문의내용
                      </p>
                      <p>
                        <strong>수집 목적:</strong> 상담 신청 접수 및 답변
                      </p>
                      <p>
                        <strong>보유 기간:</strong> 상담 완료 후 1년간 보관 후 파기
                      </p>
                      <p>
                        동의를 거부할 수 있으며, 거부 시 상담 신청이 제한됩니다.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? '전송 중...' : '상담 신청하기'}
              </button>

              <p className={styles.note}>
                빠른 상담을 원하시면{' '}
                <a href="tel:02-423-7110" className={styles.phoneLink}>
                  02-423-7110
                </a>
                으로 전화주세요.
              </p>
            </form>
          </>
        ) : (
          <div className={styles.successContent}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>상담 신청이 완료되었습니다</h3>
            <p className={styles.successMessage}>
              소중한 문의에 감사드립니다.<br />
              담당 세무사가 빠른 시일 내에 연락드리겠습니다.<br />
              (영업일 기준 1~2일 이내)
            </p>
            <button className={styles.successButton} onClick={onClose}>
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
