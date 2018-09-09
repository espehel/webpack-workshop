# webpack-workshop

## Introduksjon
I denne workshopen skal vi fokusere på webpack som utgangspunkt for å utforske hva som faktisk skjer når man bygger en frontend. Det er ofte mange forskjellige prosesser koden går gjennom og webpack lar oss utforske disse gradvis ved å sette opp vår egendefinerte konfigurasjon. Med webpack 4 og Parcel er det mulig å få mye av det vi setter opp manuelt i denne workshopen gratis, men i reelle kundesituasjoner er det veldig vanlig at man alikevel må frem med noe manuell konfigurasjon for å få ting til å fungere i kunden sitt miljø.

KANSKJE ET AVSNITT TIL HER?

## Oppgave 1

### Basic setup
Før vi kommer i gang med webpack skal vi sette opp et minimalt oppsett som vi kan bygge videre fra. Sørg for at du har node og npm installert og klon dette prosjektet: `git clone https://github.com/espehel/webpack-workshop.git`. Gå inn i webpack-workshop mappen og kjør `npm install`. I mappen din burde du nå ha HVORDAN DET SER UT

### Entry og Output
Når webpack skal bygge en bundle starter den med å se på én fil og basert på denne filen bygger man en avhengighetsgraf. Denne graf brukes til å finne ut av hvilke andre moduler og biblioteker man er avhengig av. I webpack 4 er default pathen `./src/index.js`, men det er flere måter man kan konfigurere dette på avhengig av hva man er ute etter. Dersom man kun ønsker et annet entry point kan man skrive:
```
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```
Output definerer hvor man ønsker at webpack skal legge bundelen som produseres og hvordan filene skal navngis. Denne defaulter til `./dist/main.js` for hovedfilen og `./dist` for alle andre genererte filer. Dette kan konfigureres ved å definere et output objekt i webpack configen:

```
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```
Her definerer `output.path` hvor vi ønsker at bundelen skal legges og `output.filename` definerer navnet.

### Gjør selv
Lag en webpack config som bruker default verdiene til og konstruer en minimal bundle fil.
Flytt filene til egenbestemte lokasjoner og fiks bygget slik at det fortsatt fungerer og det generes en bundle fil der vi ønsker.


### Dev-server
Det er litt kjipt å bare sjekke at ting fungerer ved at det konstrueres en bundle, så la oss få opp en liten dev-server som lar oss eksperimentere litt raskere.

### Oppgave 2
## Loaders
Out of the box skjønner webpack bare javascript, men ved hjelp av loaders kan vi få webpack til å prosessere forskjellige typer filer. Disse blir da konvertert til moduler som legges til i webpack sitt dependency tre.
Loaders består av to hoveddeler som definerer hvordan de fungerer:
`Test` propertien brukes til å definere hvilke filer som skal identiseres og transformeres.
`Use` propertien definerer hvillken loader som skal gjøre selve transformeringen. Et grunnleggende eksempel på dette er:
```
module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [ { 
          test: /\.txt$/,
          use: 'raw-loader'
       }
    ]
  }
};
```
Her definerer man en rules property som tar en liste med objekter hvor hvert objektet skal ha de obligatoriske feltene `Test` og `Use`.
Hver gang webpack kommer over en path som viser seg å være en '.txt' så skal man sende denne gjennom 'raw-loader' slik at den kan transformeres før den legges til bundelen. I de neste seksjonene skal vi sette opp litt forskjellige loaders som er veldig vanlige å bruke.

### Less, css
En ting vi kan bruk loaders til er å laste CSS filer inn i javascript. For å få til dette må vi installere loaderen vi ønsker å bruke:
`npm install --save-dev css-loader`. Denne bruker vi på samme måte som 'raw-loader' ved å definere en regel under module.rules:
```
  module: {
    rules: [ { 
          test: /\.css$/,
          use: 'css-loader'
       }
    ]
  }
```

### Gjør selv
Lag en .css fil og importer denne i javascripten din. Få brukt den til noe. TRENGER MER SPESIFIKASJON HER.

### Babel
En av de viktigste transofmeringene for oss utviklere er at man kan skrive ny javascript kode som faktisk kjører på "alle" nettlesere. In comes Babel. Babel lar oss skrive es6 javascript og definere polyfills (kode som skal byttes ut med spesifikk annen kode) som blir byttet ut med annen javascript som kjører i et brede spekter av nettlesere. Legg til en regel som ser slik ut:
```
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [require('@babel/plugin-proposal-object-rest-spread')]
        }
      }
    }
  ]
}
```
Hva skjer her? Som vanlig definerer vi `test` og `use`. Test er satt til alle javascript filer, mens use har litt flere finurligheter og vi har en ny ting som heter `exclude`. Exclude er rimelig enkel, vi spesifiserer mapper vi ønsker at denne regelen ikke skal gjelde for. Det er både unødvendig on ineffektivt å kjøre babel transpilering på filene i node_modules.
Under `use` definerer vi litt mer enn vi er vant til. `use.loader` spesifiserer hvilken loader vi skal bruke, mens `user.options` LAR OSS GJØRE HVA?

 

### Gjør selv
FINN PÅ NOE VI TRENGER BABEL TIL FOR Å VERIFISERE.
Hva er babel. Eksempel på noe som ikke fungerer i IE10(??) og som vi får til å fungere ved å kjøre koden gjennom babel. 

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
