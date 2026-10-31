export type PreviewKey =
  | "projects"
  | "activities"
  | "blog"
  | "resume"
  | "contact";

export interface PreviewItem {
  id: string;
  title: string;
  meta: string;
  href: string;
  imageUrl?: string | null;
  /** 이미지가 없을 때 타일에 크게 보여줄 글자 */
  highlight?: string;
  external?: boolean;
}

export interface PreviewContent {
  /** cards: 이미지 타일 / rows: 이미지 없는 항목용 한 줄 행 / paper: 문서 캡처 한 장 */
  layout: "cards" | "rows" | "paper";
  eyebrow: string;
  /** 줄바꿈(\n) 단위로 마스크 리빌된다 */
  description: string;
  /** 전체 목록의 항목 수. 미리보기 한도보다 크면 `+N` 타일로 더 있음을 알린다 */
  total: number;
  items: PreviewItem[];
  more: {
    label: string;
    href: string;
  };
}
