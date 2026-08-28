import type { LucideIcon } from "lucide-react";

export interface Activity {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  date: string;
}
