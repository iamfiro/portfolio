export function getKoreaTime() {
    const curr = new Date();
    const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kr_curr = new Date(utc + (KR_TIME_DIFF));

    const kr_hours = kr_curr.getHours() < 10 ? '0' + kr_curr.getHours() : kr_curr.getHours();
    const kr_minutes = kr_curr.getMinutes() < 10 ? '0' + kr_curr.getMinutes() : kr_curr.getMinutes();

    return kr_hours + ':' + kr_minutes;
}