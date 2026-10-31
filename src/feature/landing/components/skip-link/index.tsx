import { Link } from "@/shared/components/ui";

import s from "./style.module.scss";

export const MAIN_CONTENT_ID = "main-content";

/** 키보드 사용자가 헤더를 건너뛰고 본문으로 바로 가는 링크. 포커스될 때만 보인다 */
export default function SkipLink() {
  return (
    <Link href={`#${MAIN_CONTENT_ID}`} className={s.skip}>
      본문으로 건너뛰기
    </Link>
  );
}
