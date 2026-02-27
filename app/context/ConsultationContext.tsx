'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import ConsultationModal from '../components/ConsultationModal';

interface ConsultationContextType {
  openModal: () => void;
  closeModal: () => void;
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ConsultationContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ConsultationModal isOpen={isOpen} onClose={closeModal} />
    </ConsultationContext.Provider>
  );
}

export function useConsultation() {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error('useConsultation must be used within a ConsultationProvider');
  }
  return context;
}
