import { useInView } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

import { useHomeAnimation } from "@/feature/home/components/home-animation-provider";

interface UseHomeSectionAnimationOptions {
  enabled?: boolean;
  id: string;
  order: number;
  requestOnMount?: boolean;
}

export function useHomeSectionAnimation({
  enabled = true,
  id,
  order,
  requestOnMount = false,
}: UseHomeSectionAnimationOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const hasRequestedRef = useRef(false);
  const isInView = useInView(ref, { amount: 0.2, once: true });
  const {
    activeSectionId,
    completeAnimation,
    isCompleted,
    requestAnimation,
  } = useHomeAnimation();
  const isVisible = activeSectionId === id || isCompleted(id);

  useEffect(() => {
    if (
      !enabled ||
      (!requestOnMount && !isInView) ||
      hasRequestedRef.current
    ) {
      return;
    }

    hasRequestedRef.current = true;
    requestAnimation(id, order);
  }, [enabled, id, isInView, order, requestAnimation, requestOnMount]);

  const complete = useCallback(() => {
    completeAnimation(id);
  }, [completeAnimation, id]);

  return {
    complete,
    isVisible,
    ref,
  };
}
