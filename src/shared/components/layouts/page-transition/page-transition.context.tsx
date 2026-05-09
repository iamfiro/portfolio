import { createContext, useContext, useCallback, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface PageTransitionContextValue {
  navigateTo: (path: string) => void;
  isTransitioning: boolean;
  /** exit 애니메이션 총 소요 시간(초). 페이지 콘텐츠 애니메이션 delay에 사용 */
  exitDuration: number;
  /** 초기 로딩(이미지 프리로드 + reveal 애니메이션)이 완료되었는지 여부 */
  initialLoadDone: boolean;
  setInitialLoadDone: (done: boolean) => void;
}

// exit 애니메이션 총 시간 (DURATION_S + (COLUMN_COUNT - 1) * STAGGER_S + HOLD_MS/1000)
const EXIT_DURATION = 1 + 4 * 0.2 + 0.25;

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigateTo: () => {},
  isTransitioning: false,
  exitDuration: EXIT_DURATION,
  initialLoadDone: false,
  setInitialLoadDone: () => {},
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

// 내부용: 컴포넌트가 애니메이션 완료 후 실제 네비게이션 실행
interface InternalContextValue {
  pendingPath: string | null;
  consumePendingPath: () => string | null;
  performNavigate: (path: string) => void;
  finishTransition: () => void;
}

const InternalContext = createContext<InternalContextValue>({
  pendingPath: null,
  consumePendingPath: () => null,
  performNavigate: () => {},
  finishTransition: () => {},
});

export function usePageTransitionInternal() {
  return useContext(InternalContext);
}

interface Props {
  children: React.ReactNode;
}

export function PageTransitionProvider({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const isNavigatingRef = useRef(false);

  const navigateTo = useCallback(
    (path: string) => {
      if (isNavigatingRef.current) return;
      if (path === location.pathname) return;

      isNavigatingRef.current = true;
      setIsTransitioning(true);
      setPendingPath(path);
    },
    [location.pathname],
  );

  const consumePendingPath = useCallback(() => {
    const path = pendingPath;
    setPendingPath(null);
    return path;
  }, [pendingPath]);

  const performNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  const finishTransition = useCallback(() => {
    setIsTransitioning(false);
    isNavigatingRef.current = false;
  }, []);

  return (
    <PageTransitionContext.Provider value={{ navigateTo, isTransitioning, exitDuration: EXIT_DURATION, initialLoadDone, setInitialLoadDone }}>
      <InternalContext.Provider
        value={{ pendingPath, consumePendingPath, performNavigate, finishTransition }}
      >
        {children}
      </InternalContext.Provider>
    </PageTransitionContext.Provider>
  );
}
