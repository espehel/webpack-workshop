# webpack-workshop

## Introduksjon
Her skriver vi litt om hva de skal gjøre. Hvorfor vi bruker webpack 3, tydeliggjør prosessen med mye config. 

### dependency
Litt om hvordan webpack prosesserer applikasjonen og lager en avhengighetsgraf. Den mapper alle filer som prosjektet trenger og bygger det til en bundle.

## Basic setup
Installere Node, Npm, webpack, lage index.html index.js. Importere index.js i index.html og få satt opp ett bygg.
### Entry
Når webpack skal bygge en bundle starter den med å se på én fil, denne filen peker vi til slik:
```
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```
Basert på denne filen, kartlegger webpack alle filer som denne avhenger av, både direkte eller inndirekte igjennom andre filer.

### Output



### Dev-server
Webpack har en egen dev server. vi bruker denne. Den fungere slik...

## Loaders
Out of the box skjønner webpack bare javascript, men ved hjelp av loaders kan vi få webpack til å prosessere alt mulig rart av filer. Disse blir da konvertert til moduler som kan legges til i webpack sitt dependency tre.
 Loaders består av to hoveddeler som definerer hvordan de fungerer:
`Test` propertien brukes til å definere hvilke filer som skal identiseres og transformeres.
`Use` propertien definerer hvillken loader som skal gjøre selve transformeringen. Et grunnleggende eksempel på dette er:
```
module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
```
Her definerer man en rules property som tar en liste med objekter hvor hvert objektet skal ha de obligatoriske feltene ``Test` og `Use`.
Her forteller vi altså webpack at hver gang den kommer over en path som viser seg å være en '.txt' så skal man sende denne gjennom 'raw-loader' slik at den kan transformeres før den legges til bundelen. I de neste seksjonene skal vi sette opp  

### Babel
En av de viktigste transofmeringene for oss utviklere er at man kan skrive ny javascript kode som faktisk kjører på "alle" nettlesere. In comes Babel. Babel lar oss skrive es6 javascript og definere polyfills (funksjoner etc. blir byttet ut med annen kode som kjører i et brede spekter av nettlesere. Lag en fil iNeedBabel.js som ser slik ut:
```
Dette blir en kodesnutt
```
Hva er babel. Eksempel på noe som ikke fungerer i IE10(??) og som vi får til å fungere ved å kjøre koden gjennom babel. 
### Less, css
Lage en LESS fil og få brukt CSSen når den er importert i html'en vår.
### Typescript
Ingen skriver vel utypet javascript den dag i dag? Lage en ny ts fil som importeres i JS'en vår eller motsatt og få dette til å fungere.
### Html loader
Les litt opp på dette og sett oopp en HTML loader....
## Plugins
Hva er plugins i forhold til Loaders?
### Html plugin
### ?????
## Production Builds
Forskjellen på dev builds og production builds?
### Uglify 

## React + hot reloading
Trekk inn babel for react. Få en react component til å vises på skjermen. Få satt opp hot reloading for reactappen.

## Environment builds

## Code splitting
Ikke laste mer enn nødvendig. Splitte opp applikasjonen vår i forskjellige deler som kan lastes etterhvert som det er nødvendig. 

## Oppgradere til 4
Parcel gjør mye av det vi nå har satt opp automatisk og det gjør også webpack med versjon 4. La oss se på en oppgradering og finne ut av hvor mye konfigurasjon som faktisk forsvinner! 
