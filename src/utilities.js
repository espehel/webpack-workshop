export function getTimeOfDay() {
    const time = new Date();
    return time.getUTCHours();
}
