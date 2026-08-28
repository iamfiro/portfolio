import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

interface QueuedSection {
  id: string;
  order: number;
}

interface HomeAnimationContextValue {
  activeSectionId: string | null;
  completeAnimation: (id: string) => void;
  isCompleted: (id: string) => boolean;
  requestAnimation: (id: string, order: number) => void;
}

const HomeAnimationContext = createContext<HomeAnimationContextValue | null>(
  null,
);

interface Props {
  children: ReactNode;
}

export default function HomeAnimationProvider({ children }: Props) {
  const activeSectionIdRef = useRef<string | null>(null);
  const completedSectionIdsRef = useRef(new Set<string>());
  const queuedSectionsRef = useRef<QueuedSection[]>([]);
  const isSchedulingRef = useRef(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const startNextAnimation = useCallback(() => {
    if (activeSectionIdRef.current) return;

    const nextSection = queuedSectionsRef.current
      .sort((left, right) => left.order - right.order)
      .shift();

    if (!nextSection) return;

    activeSectionIdRef.current = nextSection.id;
    setActiveSectionId(nextSection.id);
  }, []);

  const scheduleNextAnimation = useCallback(() => {
    if (isSchedulingRef.current) return;

    isSchedulingRef.current = true;

    queueMicrotask(() => {
      isSchedulingRef.current = false;
      startNextAnimation();
    });
  }, [startNextAnimation]);

  const requestAnimation = useCallback(
    (id: string, order: number) => {
      const isActive = activeSectionIdRef.current === id;
      const isQueued = queuedSectionsRef.current.some(
        (section) => section.id === id,
      );

      if (completedSectionIdsRef.current.has(id) || isActive || isQueued) {
        return;
      }

      queuedSectionsRef.current.push({ id, order });
      scheduleNextAnimation();
    },
    [scheduleNextAnimation],
  );

  const completeAnimation = useCallback(
    (id: string) => {
      if (activeSectionIdRef.current !== id) return;

      completedSectionIdsRef.current.add(id);
      activeSectionIdRef.current = null;
      setActiveSectionId(null);
      scheduleNextAnimation();
    },
    [scheduleNextAnimation],
  );

  const isCompleted = useCallback(
    (id: string) => completedSectionIdsRef.current.has(id),
    [],
  );

  const value = useMemo<HomeAnimationContextValue>(
    () => ({
      activeSectionId,
      completeAnimation,
      isCompleted,
      requestAnimation,
    }),
    [activeSectionId, completeAnimation, isCompleted, requestAnimation],
  );

  return (
    <HomeAnimationContext.Provider value={value}>
      {children}
    </HomeAnimationContext.Provider>
  );
}

export function useHomeAnimation() {
  const context = useContext(HomeAnimationContext);

  if (!context) {
    throw new Error(
      "useHomeAnimation must be used within HomeAnimationProvider.",
    );
  }

  return context;
}
