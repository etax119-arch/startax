'use client';

import { useEffect, useRef } from 'react';

let lockCount = 0;

export function useBodyScrollLock(isLocked: boolean) {
  const wasLocked = useRef(false);

  useEffect(() => {
    if (isLocked && !wasLocked.current) {
      lockCount++;
      wasLocked.current = true;
      document.body.style.overflow = 'hidden';
    } else if (!isLocked && wasLocked.current) {
      lockCount--;
      wasLocked.current = false;
      if (lockCount <= 0) {
        lockCount = 0;
        document.body.style.overflow = '';
      }
    }

    return () => {
      if (wasLocked.current) {
        lockCount--;
        wasLocked.current = false;
        if (lockCount <= 0) {
          lockCount = 0;
          document.body.style.overflow = '';
        }
      }
    };
  }, [isLocked]);
}
