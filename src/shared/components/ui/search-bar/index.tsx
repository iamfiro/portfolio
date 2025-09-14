import { Search } from "lucide-react";

import s from "./style.module.scss";

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export default function SearchBar({ className, style }: Props) {
  return (
    <div className={`${s.search_bar} ${className}`} style={style}>
      <Search />
      <input type="text" placeholder="글 검색하기" />
    </div>
  );
}
