export type ActivityIconName = "users-round" | "newspaper";

export interface Activity {
  id: string;
  icon: ActivityIconName;
  title: string;
  description: string;
  date: string;
  href: string | null;
}
