export type KstTimeDisplay = {
  time: string;
  dayQualifier?: "Yesterday" | "Tomorrow";
};

function toEpochDays(year: number, month: number, day: number): number {
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function getDateParts(date: Date, timeZone?: string): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const [y, m, d] = formatter.format(date).split("-").map(Number);
  return { year: y, month: m, day: d };
}

export function getKstTimeDisplay(now: Date = new Date()): KstTimeDisplay {
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const time = timeFormatter.format(now);

  const kst = getDateParts(now, "Asia/Seoul");
  const local = getDateParts(now);

  const kstDays = toEpochDays(kst.year, kst.month, kst.day);
  const localDays = toEpochDays(local.year, local.month, local.day);

  let dayQualifier: KstTimeDisplay["dayQualifier"];
  const diff = kstDays - localDays;
  if (diff === -1) dayQualifier = "Yesterday";
  else if (diff === 1) dayQualifier = "Tomorrow";

  return { time, dayQualifier };
}

export function getKstTimeLabel(now: Date = new Date()): string {
  const { time, dayQualifier } = getKstTimeDisplay(now);
  return dayQualifier ? `${time} (${dayQualifier})` : time;
}


