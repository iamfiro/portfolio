import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

// 앞 섹션 완료를 끝까지 기다리지 않고, 이 간격 뒤에 다음 섹션을 시작한다.
const SECTION_START_INTERVAL_MS = 150;

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
  const releaseTimerRef = useRef<number | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const scheduleNextAnimationRef = useRef<() => void>(() => {});

  const releaseSection = useCallback((id: string) => {
    if (activeSectionIdRef.current !== id) return;

    if (releaseTimerRef.current !== null) {
      window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }

    completedSectionIdsRef.current.add(id);
    activeSectionIdRef.current = null;
    setActiveSectionId(null);
    scheduleNextAnimationRef.current();
  }, []);

  const startNextAnimation = useCallback(() => {
    if (activeSectionIdRef.current) return;

    const nextSection = queuedSectionsRef.current
      .sort((left, right) => left.order - right.order)
      .shift();

    if (!nextSection) return;

    activeSectionIdRef.current = nextSection.id;
    setActiveSectionId(nextSection.id);

    releaseTimerRef.current = window.setTimeout(() => {
      releaseTimerRef.current = null;
      releaseSection(nextSection.id);
    }, SECTION_START_INTERVAL_MS);
  }, [releaseSection]);

  const scheduleNextAnimation = useCallback(() => {
    if (isSchedulingRef.current) return;

    isSchedulingRef.current = true;

    queueMicrotask(() => {
      isSchedulingRef.current = false;
      startNextAnimation();
    });
  }, [startNextAnimation]);

  scheduleNextAnimationRef.current = scheduleNextAnimation;

  useEffect(
    () => () => {
      if (releaseTimerRef.current !== null) {
        window.clearTimeout(releaseTimerRef.current);
      }
    },
    [],
  );

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

  const completeAnimation = releaseSection;

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
