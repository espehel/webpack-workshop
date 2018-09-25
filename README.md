# webpack-workshop

## Introduksjon
I denne workshopen skal vi ta utgangspunkt i webpack for å utforske hva som faktisk skjer når man bygger en frontend. Det er ofte mange forskjellige prosesser koden gjennomgår og ved hjelp av webpack skal vi se på disse gradvis ved å sette opp vår egendefinerte konfigurasjon. Webpack 4 og Parcel gir mye av det vi setter opp manuelt i denne workshopen ut av boksen, men i reelle kundesituasjoner er det vanlig at man likevel tilføre konfigurasjon manuelt for å få ting til å fungere i kunden sitt miljø.

Vi starter denne workshopen med det aller mest grunnleggende, hvordan webpack bygger en _bundle_ basert på avhengighetene til en angitt fil. Videre vil vi se på ytterligere konfigurasjonsmuligheter, som hvordan vi kan dra nytte av Babel, less, og typescript, ved hjelp av _Loaders_ og _Plugins_. Vi kommer til å utforske forskjellen på produksjonsbygg og bygg best egnet for våre interne og lokale utviklingsmiljøer. Til slutt vil vi se på litt snacks som gjør hverdagen vår som utvikler litt mer behagelig.

## Basic setup
Før vi kommer i gang med webpack skal vi sette opp et minimalt oppsett som vi kan bygge videre fra. Sørg for at du har node og npm installert (https://nodejs.org/en/download/) og klon dette prosjektet: `git clone https://github.com/espehel/webpack-workshop.git`.
Prosjektet har kun 3 enkle filer `src/main.html`, `src/main.js` og `src/utils.js`. Åpne filen main.html direkte i en nettleser. 
Da ser vi en velkomstmelding generert fra `src/main.js`.

Vi ønsker også å inkludere tid på dagen i velkomstmeldingen.
Dette vil vi løse ved å importere hjelpefunksjonen `getTimeOfDay()` fra `src/utils.js`.
Dette kommer dessverre til å feile siden nettleseren ikke forstår avhengigheten vi prøver å skape mellom `main.js` og `utils.js`. Dette kan vi løse ved å få webpack til å lage en bundle av de to javascript filene vi trenger.

Det første vi gjøre er å hente webpack fra NPM. Vi henter også webpack-cli, slik at vi kan bygge koden vår fra kommandolinja.
Kjør `npm i -d webpack webpack-cli`. 
For å bygge filene bruker vi et npm script, som starter webpack og gir den en konfig. 
Legg inn følgende under `script` i `package.json`: `"build": "webpack --config webpack.config.js"`. Opprett filen `webpack.config.js`. I neste avsnitt forklarer vi hvordan vi setter opp denne filen, slik at vi endelig kan vise velkomstmeldingen vår.

### Entry og Output
Når webpack skal bygge en bundle starter den med å se på én fil og basert på denne filen bygger man en avhengighetsgraf. Denne grafen brukes til å finne ut av hvilke andre moduler og biblioteker man er avhengig av. I webpack 4 er default pathen `./src/index.js`, men det er flere måter man kan konfigurere dette på avhengig av hva man er ute etter. Dersom man kun ønsker et annet entry point kan man skrive:
```
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```
Output definerer hvor man ønsker at webpack skal legge bundelen som produseres og hvordan filene skal navngis. Denne defaulter til `./dist/main.js` for hovedfilen og `./dist` for alle andre genererte filer. Dette kan konfigureres ved å definere et output objekt i webpack-konfigen:

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

#### Oppgave
Lag en webpack-konfig som går ut ifra `main.js` og lager en bundle med alle avhengigheter denne filen har. Endre `main.html` til å peke på bundlen som webpack har bygd for oss.
Dersom vi nå åpner main.html i nettleseren vil vi se en velkomstmelding som også inkluderer tid på dagen.


### Dev-server
Å verifisere at konfigurasjonen og koden fungerer kun ved å se at det konstrueres en bundle, for så å måtte finne html-filen og åpne denne i en nettleser, er ikke optimalt. Webpack tilbyr en dev-server som lar oss eksperimentere litt raskere.

Installer webpack-dev-server: `npm install webpack-dev-server --save-dev`. For at det skal være lettere å starte serveren kan det nok en gang være lurt å definere et npm script som kjører kommandoen: `webpack-dev-server --config webpack.config.js`. Hvis vi kjører dette scriptet slik prosjektet vårt er definert nå vil vi serve og se mappestrukturen til prosjektet vårt.
Dette skyldes at dev-serveren trenger litt hjelp til å finne ut av hvor den skal laste bundelen vår fra og hvor den statiske html-filen vår skal serves fra.
`publicPath` definerer hvor bundelen ligger og `contentBase` definerer hvor vi skal hente statisk content fra.

#### Oppgave
Sett opp dev-serveren slik at den får med seg endringer både i javascript og htmlen vår.

### Developmentbygg og produksjonsbygg
Webpack gir oss optimalisering basert på om et bygg skal brukes under utvikling av dev-serveren, eller om det skal havne i den endelige produksjonsbundelen. Et developmentbygg fokuserer på rask byggehastighet, mens et produksjonsbygg har som mål å lage en liten bundle.

Vi styrer dette ved å sette `mode` til enten _production_, _development_ eller _none_ i konfig filen.
```
module.exports = {
  mode: 'production'
};
```
Man kan også variere byggmodus som et CLI argument `webpack --mode=production`.

#### Oppgave
Prøv å bygg både med `mode: 'production'` og `mode: 'development'`, åpne bundlen og se på forskjellen.
Etter det, gjør slik at dev-serveren bruker development, mens bundlen vi bygger bruker production.

## Loaders
Webpack forstår i utgangspunktet kun javascript, men ved hjelp av loaders kan vi få webpack til å prosessere forskjellige typer filer. Disse blir da konvertert til moduler som legges til i webpack sitt dependency tre.
Loaders består av to hoveddeler som definerer hvordan de fungerer:
`Test` propertien brukes til å definere hvilke filer som skal identifiseres og transformeres.
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
Her setter man en `rules` property som tar en liste med objekter hvor hvert objektet skal ha de obligatoriske feltene `Test` og `Use`.
Hver gang webpack kommer over en path som viser seg å være en '.txt' så skal man sende denne gjennom 'raw-loader' slik at den kan transformeres før den legges til bundelen. I de neste seksjonene skal vi sette opp litt forskjellige loaders som er veldig vanlige å bruke.

#### Oppgave
Raw loaderen tar tekstfiler og importerer innholdet rett inn i en string. Bruk raw loaderen til å importere en tekstfil som en streng og bruk denne i javascripten deres.

### Less, css
En ting vi kan bruke loaders til er å bygge CSS filer inn i bundlen vår. For å få til dette må vi installere loaderen vi ønsker å bruke:
`npm install --save-dev css-loader`. Denne konfigurerer vi på samme måte som 'raw-loader' ved å definere en regel under module.rules:
```
  module: {
    rules: [ { 
          test: /\.css$/,
          use: 'css-loader'
       }
    ]
  }
```
css-loader vil kun legge CSS'en vår inn i en string, så vi trenger også `style-loader` som tar stringen vår med css, og putter det i en _style-tag_ som plasseres i `<head>`.
Innstaller style-loader, `npm install --save-dev style-loader`. Siden den skal brukes for samme filer som css-loader, kan vi putte begge loaderne i et array:
```
  module: {
    rules: [ { 
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
       }
    ]
  }
```

#### Oppgave
Legg til _css-loader_ og _style-loader_ i webpack-konfigen, lag deretter en .css fil og importer denne i javascripten din. Verifiser at det funger som det skal ved å legge til noen css-regler, eksempler på dette kan være _background-color_, _color_, _font-size_ eller _text-align_.  
Ved å inspisere siden, ser vi at css du har skrevet nå ligger i `<head>`.

### Babel
En av de viktigste transformeringene for oss utviklere er at man kan skrive ny javascript kode som faktisk kjører på "alle" nettlesere. In comes Babel. Babel lar oss skrive ES6 og definere polyfills (kode som skal byttes ut med spesifikk annen kode) som blir transpilert til annen versjon av javascript som kan kjøre i et bredere spekter av nettlesere. Installer de følgende babel-pakkene før du fortsetter:
`npm install @babel/core @babel/preset-env babel-loader --save-dev`. Babel core er hovedbiblioteket til babel, preset-env skal vi bruke til å konfigurere opp hva vi vil at babel skal gjøre og loaderen trenger vi for å integrere med webpack. Når disse pakkene er installert kan vi oppdatere webpack-konfigen vår til å inkludere vår nye loader slik:
```
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: 'babel-loader'
    }
  ]
}
```
Som vanlig definerer vi `test` og `use`. Test er satt til alle javascript filer, use er fortsatt loaderen vår og `exclude` lar oss spesifisere mapper vi ønsker at denne regelen ikke skal gjelde for. Det er både unødvendig og ineffektivt å kjøre babel transpilering på filene i node_modules. Babel konfigureres vanligvis via en .babelrc fil og en av pakkene ovenfor (preset env) skal brukes i konfigen her. Preset env kompilerer koden vår som er ES2015+ kompatibel ned til ES5 kompatibel kode ved å bruke babel plugins og polyfills som kan variere avhengig av browser eller miljø. Den enkleste måte å bruke preset env på er å ha det følgende i .babelrc-filen vår:
```
{
  "presets": ["@babel/preset-env"]
}
```

#### Oppgave
Sett opp og sjekk at babel faktisk fungerer. For å gjøre dette kan vi bruke et verktøy som heter ES-Check som kan installeres ved å kjøre `npm install es-check --save-dev`. Lag et npm script som peker programmet på output filen i bundelen din, f.eks: `es-check es5 ./dist/my-first-webpack.bundle.js`. Dersom du bruker babel loaderen når du bygger bundelen, burde den passere ES sjekken. Dersom du derimot ikke bruker den burde det kastes en feil.

### Typescript
I dag er det stadig mer populært å få typer inn i javascript verden. Den mest direkte måten å gjøre dette på er å introdusere Typescript eller Flow. Dette er ukomplisert nå som webpack-konfigen vår begynner å ta form. Man må selvfølgelig installere typescript med `npm install typescript` og deretter trenger vi en ts loader: `npm install --save-dev ts-loader`. Det vil også kreves en tsconfig.json som for øyeblikket kan være helt tom.

#### Oppgave
Lag en typescript fil som eksporterer en funksjon, importer den i javascript filen du bruker som inngangspunkt og kall funksjonen fra javascript. 

## Plugins
Der loaders brukes til å gjennomføre en spesifikk transformasjon på visse moduler/filer bruker man webpack plugins for å gjennomføre et bredere spekter av oppgaver. For eksempel bundle-optimaliseringer, ressurshåndtering og miljøvariabler trenger man plugins for å fikse. Mange av disse pluginsene kommer allerede med i en webpack installasjon og brukes uten at man nødvendigvis tenker over at det er en plugin. 

### Html Webpack Plugin
Selv om html-filen som vi har laget selv fungerer bra, er det enklere om webpack genererer en for oss. HtmlWebpackPlugin genererer rett og slett en standard html-fil med en script tag som linker til bundlen vår, og putter den i output mappen.
Installer HtmlWebpackPlugin(`npm i --save-dev html-webpack-plugin`) og legg til dette i webpack-konfigen:
```
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```
Dersom vi nå bygger prosjektet vårt med `npm run build`, ser vi at en html-fil også har dukket opp i mappen `/dist`.

#### Oppgave
Få dev-serveren til å benytte den genererte html-filen.

Dersom dev-serveren nå benytter den genererte filen, vil vi oppleve at javascript feiler, ettersom den ser etter et element i DOM'en som ikke finnes. Vi løser dette ved å sette html-filen vår som en template. Da vil webpack ta utgangspunkt i denne, og legge til en referanse i javascript-bundlen.
```
new HtmlWebpackPlugin({
            template: './src/index.html'
        })
```
Husk å fjerne script-taggen fra `src/index.html` slik at vi ikke laster inn vår javascript to ganger.  
HtmlWebpackPlugin kan gjøre veldig mye mer enn vist her, sjekk ut https://github.com/jantimon/html-webpack-plugin for et innblikk i det den kan gjøre.

### Bundle Analyzer
En annen nyttig plugin er [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer). Vi har sett hvordan webpack kan minimize bundlen vår slik at den egner seg bedre for produksjon. Likevel kan det hende at vi fortsatt sitter igjen med en stor bundle. Webpack-bundle-analyzer er et verktøy som lar oss se hvilke pakker bundlen vår inneholder, og hvor stor plass de faktisk tar.
Pluginen starter automatisk i en egen fane ved `npm start` etter at du har lagt det til på denne måten i webpack konfigurasjonen:
```
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```
Vi kan se at biblioteket lodash tar veldig mye av den totale bundle størrelsen. Om vi går inn i `src/utils.js` og endrer importen av lodash til å kunne ta inn string delen av biblioteket(`import _ from 'lodash/string';`), kan vi se med webpack-bundle-analyzer at lodash nå tar opp langt mindre plass.


## React
Ettersom react faggruppen er her må vi selvsagt leke litt med React. Ettersom vi allerede har et babel oppsett gående er det litt mindre som trengs å gjøre enn vanlig. Vi trenger selvsagt React: `npm install --save react react-dom`. Og vi må ha litt mer hjelp til Babel: `npm install --save-dev @babel/preset-react`. Denne pakken lar oss blant annet transformere jsx. 

#### Oppgave
Lag en React component og rendrer denne i nettsiden din. Husk å koble React på et element i DOMen din.

## Code splitting
Kodesplitting vil si å dele opp koden i flere bundles. Dette vil da gi deg mulighet til å laste bundler etter behov eller i parallell. Ved å gjøre dette kan man optimalisere lastetiden til applikasjonen ved å prioritere hvilken bundle/kode som skal lastes når og at man henter mindre bundler. Kodesplitting kan gjøres på forskjellige måter i webpack: 

### Fler entry points
Man lager en annen start html og legger denne inn som et entry point i webpack.config.js:
```
entry: {
  entry: './path/to/my/entry/file.js',
  annet: './path/to/another/entry/file.js',
},
```
Kodesplitting ved et nytt entry point er den enkleste måten å dele opp koden, men i gjengjeld mister man fleksibilitet og man har ingen mulighet til å splitte dynamisk. Det vil også bli duplisert kode dersom de forskjellige modulene er avhengig av de samme pakkene. 

#### Forhindre duplisering av kode:
Dersom man har fler entry point som beskrevet over er det fler muligheter for å forhindre duplisert kode:
* `SplitChunksPlugin`: Legge felles avhengigheter i en egen chunk.
* `Mini-css-extract-plugin`: Splitte ut css fra applikasjonen.
* `Bundle-loader`: Splitte kode og lazy laste budlene som kommer fra kodesplittingen.
* `Promise-loader`: Lignende Bundle-loader men bruker promises.


#### Oppgave:
Opprett en html-fil som importerer en tilhørende js fil. Legg html filen ved siden av den eksisterende index.html og js filen under src-mappen.

Prøv en enkel kodesplitting og sjekk at du får to bundles. Prøv og å få den ene bundelen kun til å lastes ved behov (for eksempel dersom man klikker på en knapp)

### Dynamiske importer

```
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js',
    chunkFilename: 'annetBundleNavn.bundle.js',
  }
};
```

## Er du ferdig?
* Sett opp hot reloading for react componenten din. Her burde man introdusere en ny komponent med state og se at state forblir inntakt på tvers av reloads. 
* Les om webpack konfigurasjonen som nå kommer ut av boksen i webpack 4: https://webpack.js.org/configuration/
* Utforsk mer av webpack: https://webpack.js.org/
* Ta en titt på Parcel og deres Get started guide: https://parceljs.org
