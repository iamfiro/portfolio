/** 음악 박자 격자. offset은 음원에서 첫 마디 첫 박이 나오는 시각(초) */
export interface ReelTempo {
  bpm: number;
  offset: number;
}

/** 장면 하나가 공유 GL 컨텍스트에 만들어 두는 그리기 도구 */
export interface ReelSceneRenderer<TState> {
  /** 글꼴·그림을 다 받으면 풀린다. 그 전엔 그리지 않고 재생도 시작하지 않는다 */
  ready?: Promise<unknown>;
  draw(state: TState): void;
  dispose(): void;
}

/**
 * 쇼릴의 한 장면. 자기 상태와 타임라인, 그리는 방법을 스스로 갖는다.
 * 장면을 늘리려면 이 모양으로 하나 만들어 장면 목록에 끼우기만 하면 된다.
 */
export interface ReelScene<TState = unknown> {
  /** 마스터 타임라인 라벨이자 개발용 ?reel= 값 */
  id: string;
  /** 마스터 타임라인에서 차지하는 길이(박). 음악 박자에 맞춰 컷이 떨어진다 */
  beats: number;
  /**
   * 장면 자체 길이를 칸에 맞추는 방식.
   * stretch는 빠르기를 바꿔 칸에 딱 맞추고, hold는 제 속도로 재생한 뒤 마지막 프레임을 붙잡는다.
   */
  fit?: "stretch" | "hold";
  createState(): TState;
  /** 장면 시작을 0초로 두고 자기 타임라인을 짠다 */
  build(timeline: gsap.core.Timeline, state: TState): void;
  createRenderer(gl: WebGL2RenderingContext): ReelSceneRenderer<TState>;
}

/** 음악 트랙 상태가 바뀐 까닭. unlock은 첫 상호작용으로 소리가 처음 허락된 순간이다 */
export type ReelMusicChange = "unlock" | "toggle";

/**
 * 쇼릴 플레이어 안의 음악 트랙. 언제 틀고 멈출지는 쇼릴 타임라인이 정하고,
 * 트랙은 소리를 낼 수 있는지(켜짐 + 브라우저 허락)와 재생 위치만 다룬다.
 */
export interface ReelMusic {
  /** 사용자가 소리를 켰고 브라우저가 재생을 허락했는지 */
  canPlay(): boolean;
  /** 지금 음악 재생 위치(초). 재생 중이 아니면 null */
  now(): number | null;
  /** 그 위치에서 재생한다 */
  play(at: number): void;
  pause(): void;
  /** 재생 위치를 옮긴다. 멈춰 있어도 위치만 옮겨 둔다 */
  seek(seconds: number): void;
  /** canPlay가 바뀔 때(켜고 끄거나 처음 허락될 때) 알린다. 돌려준 함수로 구독을 끊는다 */
  subscribe(listener: (change: ReelMusicChange) => void): () => void;
}

/** 마스터 타임라인 위 장면 하나의 자리 */
export interface ReelSlot {
  id: string;
  start: number;
  duration: number;
}

/** 개발 도구가 쇼릴을 붙잡고 넘겨 보는 손잡이 */
export interface ShowreelController {
  duration: number;
  slots: ReelSlot[];
  time(): number;
  /** 붙잡으면 재생과 음악 동기화를 멈추고, 이동한 자리만 그린다 */
  isHeld(): boolean;
  hold(): void;
  release(): void;
  seek(seconds: number): void;
}
