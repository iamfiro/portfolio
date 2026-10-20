const STACK_ICON_PATHS: Record<string, string> = {
  android: "/icon/stack/android.svg",
  electron: "/icon/stack/electron.svg",
  expo: "/icon/stack/expo.svg",
  express: "/icon/stack/express.svg",
  flutter: "/icon/stack/flutter.svg",
  githubactions: "/icon/stack/githubactions.svg",
  ios: "/icon/stack/ios.svg",
  kotlin: "/icon/stack/kotlin.svg",
  mysql: "/icon/stack/mysql.svg",
  nextjs: "/icon/stack/nextjs.svg",
  notion: "/icon/stack/notion.svg",
  react: "/icon/stack/react.svg",
  reactjs: "/icon/stack/react.svg",
  redis: "/icon/stack/redis.svg",
  socketio: "/icon/stack/socketdotio.svg",
  typescript: "/icon/stack/typescript.svg",
};

export interface StackIcon {
  tech: string;
  src: string;
}

export function getStackIconPath(tech: string): string | null {
  const normalizedTech = tech.toLowerCase().replace(/[.\s_-]/g, "");
  return STACK_ICON_PATHS[normalizedTech] ?? null;
}

export function getStackIcons(techStack: string[]): StackIcon[] {
  return techStack
    .map((tech) => ({ tech, src: getStackIconPath(tech) }))
    .filter((item): item is StackIcon => Boolean(item.src));
}
