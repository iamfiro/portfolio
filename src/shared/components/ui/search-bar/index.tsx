import { Search } from "lucide-react";

import s from "./style.module.scss";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  className, 
  style, 
  value = "", 
  onChange,
  placeholder = "글 검색하기"
}: Props) {
  return (
    <div className={`${s.search_bar} ${className}`} style={style}>
      <Search />
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
