import { createChildLogger } from "./logger.js";

const logger = createChildLogger({ module: "sync-lock" });

/** In-process 동시 실행 방지 락 */
class SyncLock {
  private locked = false;
  private lockedAt: number | null = null;

  /**
   * 락 획득 시도. 이미 실행 중이면 false 반환.
   */
  acquire(): boolean {
    if (this.locked) {
      logger.warn(
        { lockedAt: this.lockedAt },
        "Sync lock acquisition failed: already running",
      );
      return false;
    }

    this.locked = true;
    this.lockedAt = Date.now();

    logger.debug("Sync lock acquired");

    return true;
  }

  /**
   * 락 해제.
   */
  release(): void {
    const duration = this.lockedAt ? Date.now() - this.lockedAt : 0;

    this.locked = false;
    this.lockedAt = null;

    logger.debug({ durationMs: duration }, "Sync lock released");
  }

  /**
   * 현재 잠금 상태 확인.
   */
  isLocked(): boolean {
    return this.locked;
  }
}

// 싱글턴 인스턴스
export const syncLock = new SyncLock();
