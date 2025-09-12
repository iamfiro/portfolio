export interface BlogSummary {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  date: Date;
  tags?: string[];
}
