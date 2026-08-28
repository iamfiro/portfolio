import { createContext, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface PageTransitionContextValue {
  navigateTo: (path: string) => void;
  isTransitioning: boolean;
  /** exit 애니메이션 총 소요 시간(초). 페이지 콘텐츠 애니메이션 delay에 사용 */
  exitDuration: number;
  /** 초기 로딩(이미지 프리로드 + reveal 애니메이션)이 완료되었는지 여부 */
  initialLoadDone: boolean;
  setInitialLoadDone: (done: boolean) => void;
  /**
   * 페이지 콘텐츠가 진입 애니메이션을 시작해도 되는 시점.
   * - 초기 로드: 오버레이 reveal 완료 후 true
   * - 페이지 전환: 새 페이지 진입 시 false → 오버레이 exit 완료 후 true
   */
  pageReady: boolean;
  setPageReady: (ready: boolean) => void;
  /**
   * 초기 reveal을 지연시킬 락을 획득한다. 반환된 함수를 호출하면 락 해제.
   * 이미지 프리로드 등 비동기 작업이 완료될 때까지 페이지 표시를 보류할 때 사용.
   */
  acquirePreloadLock: () => () => void;
  /** 현재 보류 중인 프리로드 락 수 */
  preloadLockCount: number;
}

const EXIT_DURATION = 0;

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigateTo: () => {},
  isTransitioning: false,
  exitDuration: EXIT_DURATION,
  initialLoadDone: true,
  setInitialLoadDone: () => {},
  pageReady: true,
  setPageReady: () => {},
  acquirePreloadLock: () => () => {},
  preloadLockCount: 0,
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

  const acquirePreloadLock = useCallback((): (() => void) => {
    return () => {};
  }, []);

  const navigateTo = useCallback(
    (path: string) => {
      if (path === location.pathname) return;

      navigate(path);
      window.scrollTo(0, 0);
    },
    [location.pathname, navigate],
  );

  const consumePendingPath = useCallback(() => null, []);
  const performNavigate = useCallback(() => {}, []);
  const finishTransition = useCallback(() => {}, []);

  return (
    <PageTransitionContext.Provider
      value={{
        navigateTo,
        isTransitioning: false,
        exitDuration: EXIT_DURATION,
        initialLoadDone: true,
        setInitialLoadDone: () => {},
        pageReady: true,
        setPageReady: () => {},
        acquirePreloadLock,
        preloadLockCount: 0,
      }}
    >
      <InternalContext.Provider
        value={{
          pendingPath: null,
          consumePendingPath,
          performNavigate,
          finishTransition,
        }}
      >
        {children}
      </InternalContext.Provider>
    </PageTransitionContext.Provider>
  );
}
