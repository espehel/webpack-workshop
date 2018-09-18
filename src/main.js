import {getTimeOfDay} from 'utils';

const app = document.getElementById('app');

const greetingHeader = document.createElement('h1');
const greetingContent = document.createElement('h3');

greetingHeader.appendChild(document.createTextNode('Heisann!'));
app.appendChild(greetingHeader);

greetingContent.appendChild(document.createTextNode('Håper du har en fin' + getTimeOfDay())); // TODO: Fjern import og funksjonskall, erstatt med 'dag'.
app.appendChild(greetingContent);

