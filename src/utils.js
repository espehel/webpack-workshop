import _ from 'lodash/string';
export function getTimeOfDay() {
    const hours = new Date().getHours();
    let timeOfDay = '';
    if (hours > 12) {
        timeOfDay = 'kveld';
    } else if (hours < 12) {
        timeOfDay = 'morgen'
    } else {
        timeOfDay = 'dag';
    }

    return _.upperCase(timeOfDay);
}
