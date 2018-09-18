export function getTimeOfDay() {
    const hours = new Date().getHours();
    if (hours > 12) {
        return 'kveld';
    } else if (hours < 12) {
        return 'morgen'
    } else {
        return 'dag';
    }
}
