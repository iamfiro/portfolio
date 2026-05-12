import type { RefObject } from "react";

import { useTableOfContents } from "../../hooks/useTableOfContents";

import type { TocItem } from "./toc.type";

import s from "./style.module.scss";

const MIN_HEADINGS = 2;

interface Props {
  contentRef: RefObject<HTMLElement | null>;
  content: string;
}

export default function TableOfContents({ contentRef, content }: Props) {
  const { items, activeId } = useTableOfContents(contentRef, content);

  if (items.length < MIN_HEADINGS) return null;

  return (
    <nav className={s.toc} aria-label="Table of Contents">
      <p className={s.title}>Table of Contents</p>
      <ul className={s.list}>
        {items.map((item) => (
          <TocListItem
            key={item.id}
            item={item}
            isActive={item.id === activeId}
          />
        ))}
      </ul>
    </nav>
  );
}

interface ItemProps {
  item: TocItem;
  isActive: boolean;
}

function TocListItem({ item, isActive }: ItemProps) {
  const handleClick = () => {
    const target = document.getElementById(item.id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const className = [s.item, s[`level${item.level}`], isActive ? s.active : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <li>
      <button type="button" className={className} onClick={handleClick}>
        {item.text}
      </button>
    </li>
  );
}
