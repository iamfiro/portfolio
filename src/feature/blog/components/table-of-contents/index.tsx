import { type RefObject, useLayoutEffect, useRef, useState } from "react";

import { useTableOfContents } from "../../hooks/useTableOfContents";

import type { TocItem } from "./toc.type";

import s from "./style.module.scss";

const MIN_HEADINGS = 2;

interface Props {
  contentRef: RefObject<HTMLElement | null>;
  content: string;
}

interface Thumb {
  top: number;
  height: number;
}

export default function TableOfContents({ contentRef, content }: Props) {
  const { items, activeId } = useTableOfContents(contentRef, content);
  const listRef = useRef<HTMLUListElement>(null);
  const [thumb, setThumb] = useState<Thumb | null>(null);

  // 읽고 있는 항목 위치로 트랙 위의 thumb 를 옮긴다 (offset* 은 레이아웃 기준이라 transform 영향을 받지 않음)
  useLayoutEffect(() => {
    const link = listRef.current?.querySelector<HTMLElement>("[aria-current]");
    setThumb(link ? { top: link.offsetTop, height: link.offsetHeight } : null);
  }, [activeId, items]);

  if (items.length < MIN_HEADINGS) return null;

  // 글에서 가장 높은 헤딩 레벨을 기준으로 들여쓰기 깊이를 계산
  const baseLevel = Math.min(...items.map((item) => item.level));

  return (
    <nav className={s.toc} aria-label="Table of Contents">
      <p className={s.title}>Table of Contents</p>
      <div className={s.body}>
        <span className={s.track} aria-hidden>
          {thumb && (
            <span
              className={s.thumb}
              style={{
                transform: `translateY(${thumb.top}px)`,
                height: thumb.height,
              }}
            />
          )}
        </span>
        <ul ref={listRef} className={s.list}>
          {items.map((item) => (
            <TocListItem
              key={item.id}
              item={item}
              depth={item.level - baseLevel}
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
        aria-current={isActive ? "location" : undefined}
        onClick={handleClick}
      >
        {item.text}
      </button>
    </li>
  );
}
