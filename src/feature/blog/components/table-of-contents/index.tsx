import { type CSSProperties, type RefObject, useRef } from "react";

import { useTableOfContents } from "../../hooks/useTableOfContents";
import { useTocLine } from "../../hooks/useTocLine";

import type { TocItem } from "./toc.type";

import s from "./style.module.scss";

const MIN_HEADINGS = 2;

interface Props {
  contentRef: RefObject<HTMLElement | null>;
  content: string;
}

export default function TableOfContents({ contentRef, content }: Props) {
  const { items, activeId } = useTableOfContents(contentRef, content);
  const listRef = useRef<HTMLUListElement>(null);
  const line = useTocLine(listRef, [activeId, items]);

  if (items.length < MIN_HEADINGS) return null;

  // 글에서 가장 높은 헤딩 레벨을 기준으로 들여쓰기 깊이를 계산
  const baseLevel = Math.min(...items.map((item) => item.level));

  // 같은 선 모양으로 thumb 영역을 잘라내서, thumb 가 꺾인 선을 그대로 따라가게 한다
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${line.width}" height="${line.height}"><path d="${line.path}" stroke="black" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>`;
  const maskStyle: CSSProperties = {
    width: line.width,
    height: line.height,
    maskImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
  };

  return (
    <nav className={s.toc} aria-label="Table of Contents">
      <p className={s.title}>Table of Contents</p>
      <div className={s.body}>
        {line.path && (
          <>
            <svg
              className={s.track}
              width={line.width}
              height={line.height}
              aria-hidden
            >
              <path d={line.path} />
            </svg>
            <div className={s.mask} style={maskStyle} aria-hidden>
              {line.thumb && (
                <span
                  className={s.thumb}
                  style={{
                    transform: `translateY(${line.thumb.top}px)`,
                    height: line.thumb.height,
                  }}
                />
              )}
            </div>
          </>
        )}
        <ul ref={listRef} className={s.list}>
          {items.map((item) => (
            <TocListItem
              key={item.id}
              item={item}
              depth={Math.min(item.level - baseLevel, 2)}
              isActive={item.id === activeId}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}

interface ItemProps {
  item: TocItem;
  depth: number;
  isActive: boolean;
}

function TocListItem({ item, depth, isActive }: ItemProps) {
  const handleClick = () => {
    const target = document.getElementById(item.id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const className = [s.item, s[`depth${depth}`]].filter(Boolean).join(" ");

  return (
    <li>
      <button
        type="button"
        className={className}
        data-depth={depth}
        aria-current={isActive ? "location" : undefined}
        onClick={handleClick}
      >
        {item.text}
      </button>
    </li>
  );
}
