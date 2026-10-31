import { useId } from "react";

import s from "./style.module.scss";

/** 색 덩어리 위에만 도드라지는 필름 그레인. 흰 바탕에선 거의 보이지 않는다 */
export default function HeroGrain() {
  const filterId = `hero-grain-${useId().replace(/:/g, "")}`;

  return (
    // 노이즈 필터는 svg로만 만들 수 있어 직접 그린다
    <svg className={s.grain} aria-hidden focusable={false}>
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves={3}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
