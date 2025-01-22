export function getMonthAndDay(date: string) {
    const d = new Date(date);
    return `${d.getMonth() + 1}. ${d.getDate()}.`;
}