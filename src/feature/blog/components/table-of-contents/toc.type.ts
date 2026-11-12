export interface TocItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

export interface TocLinePoint {
  x: number;
  top: number;
  bottom: number;
}
