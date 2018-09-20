# webpack-workshop

## Introduksjon
I denne workshopen skal vi fokusere på webpack som utgangspunkt for å utforske hva som faktisk skjer når man bygger en frontend. Det er ofte mange forskjellige prosesser koden går gjennom og webpack lar oss utforske disse gradvis ved å sette opp vår egendefinerte konfigurasjon. Med webpack 4 og Parcel er det mulig å få mye av det vi setter opp manuelt i denne workshopen gratis, men i reelle kundesituasjoner er det veldig vanlig at man alikevel må frem med noe manuell konfigurasjon for å få ting til å fungere i kunden sitt miljø.

Derfor starter vi i denne workshoppen med det aller mest grunnleggende, hvordan webpack bygger en _bundle_ basert på avhengighetene til en angitt fil. Videre vil vi se på ytterligere konfigurasjonsmuligheter, som hvordan vi kan dra nytte av Babel, less, og typescript, ved hjelp av _Loaders_ og _Plugins_. Vi kommer til å utforske forskjellen på produksjonsbygg og bygg best egnet for våre interne og lokale utviklingsmiljøer. Til slutt vil vi se på litt snacks som gjør hverdagen vår som utvikler litt mer behagelig.

## Basic setup
Før vi kommer i gang med webpack skal vi sette opp et minimalt oppsett som vi kan bygge videre fra. Sørg for at du har node og npm installert (https://nodejs.org/en/download/) og klon dette prosjektet: `git clone https://github.com/espehel/webpack-workshop.git`.
Prosjektet har kun 3 enkle filer `src/main.html`, `src/main.js` og `src/utils.js`. Åpne filen main.html direkte i en browser. 
Da ser vi en velkomstmelding generert fra `src/main.js`.

Vi ønsker også å inkludere tid på dagen i velkomstmeldingen.
Dette vil vi løse ved å importere hjelpefunksjonen `getTimeOfDay()` fra `src/utils.js`.
Dette kommer desverre til å feile siden browseren ikke forstår avhengigheten vi prøver å skape mellom `main.js` og `utils.js`. Dette kan vi løse ved å få webpack til å lage en bundle av de to javascript filene vi trenger.

Det første vi gjøre er å hente webpack fra NPM. Vi henter også webpack-cli, slik at vi kan bygge koden vår fra kommandolinja.
Kjør `npm i -d webpack webpack-cli`. 
For å bygge filene bruker vi et npm script, som starter webpack og gir den en config. 
Legg inn følgende under `script` i `package.json`: `"build": "webpack --config webpack.config.js"`. Opprett filen `webpack.config.js`. I neste avsnitt forklarer vi hvordan vi setter opp denne filen, slik at vi endelig kan vise velkomstmeldingen vår.

### Entry og Output
Når webpack skal bygge en bundle starter den med å se på én fil og basert på denne filen bygger man en avhengighetsgraf. Denne grafen brukes til å finne ut av hvilke andre moduler og biblioteker man er avhengig av. I webpack 4 er default pathen `./src/index.js`, men det er flere måter man kan konfigurere dette på avhengig av hva man er ute etter. Dersom man kun ønsker et annet entry point kan man skrive:
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

#### Oppgave
Lag en webpack config som går utifra `main.js` og lager en bundle med alle avhengigheter denne filen har. Endre på `main.html` til å peke på bundle'en som webpack har bygd for oss.
Dersom vi nå åpne main.html i nettleseren vil vi se en flott velkomstmelding, som også inkluderer tid på dagen.


### Dev-server
Det er litt kjipt å bare sjekke at ting fungerer ved at det konstrueres en bundle, så la oss få opp en liten dev-server som lar oss eksperimentere litt raskere.
Installer webpack-dev-server: `npm install webpack-dev-server --save-dev`. For at det skal være lettere å starte serveren kan det nok en gang være lurt å definere et npm script
som kjører kommandoen: `webpack-dev-server --config webpack.config.js`. Hvis vi kjører dette scriptet slik prosjektet vårt er definert nå vil vi serve og se mappestrukturen til prosjektet vårt.
Dette skyldes at dev-serveren trenger litt hjelp til å finne ut av hvor den skal laste bundelen vår fra og hvor den statiske html filen vår skal serves fra.
`publicPath` definerer hvor bundelen skal serves fra og `contentBase` definerer hvor vi skal hente statisk content fra.

#### Oppgave
Sett opp dev-serveren slik at den får med seg endringer både i javascripten og htmlen vår.

### Developmentbygg og produksjonsbygg
Webpack gir oss gratis optimalisering basert på om et bygg skal brukes under utvikling av devserveren, eller om det skal havne i den endelige produksjonsbundelen. Et developmentbygg fokuserer på rask byggehastighet, mens et produksjonsbygg har som mål å lage en liten bundle.

Vi styrer dette ved å sette `mode` til enten _production_, _development_ eller _none_ i config filen.
```
module.exports = {
  mode: 'production'
};
```
Man kan også variere byggmodus som et CLI argument `webpack --mode=production`.

#### Oppgave
Gjør slik at devserver bruker development, mens bundlen vi bygger bruker production.

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

#### Oppgave
Raw loaderen tar tekstfiler og importerer innholdet rett inn i en string. Bruk raw loaderen til å importere en tekstfil som en streng og bruk denne i javascripten deres.

### Less, css
En ting vi kan bruk loaders til er å bygge CSS filer inn i bundlen vår. For å få til dette må vi installere loaderen vi ønsker å bruke:
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
css-loader vil kun legge CSS'en vår inn i en string, så vi trenger også `style-loader` som tar stringen vår med css, og putter det i en _style-tag_ som puttes i `<head>`.
Innstaler style-loader, `npm install --save-dev style-loader`. Siden den skal brukes for samme filer som css-loader, kan vi putte begge loaderne i et array:
```
  module: {
    rules: [ { 
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
       }
    ]
  }
```

### Gjør selv
Etter å ha lagt til _css-loader_ og _style-loader_ i webpack configen, lag en .css fil og importer denne i javascripten din. Verifiser at det funger som det skal ved å legge til noen css-regler, eksempler på dette kan være _background-color_, _color_, _font-size_ eller _text-align_.  
Ved å inspisere siden, ser vi at css du har skrevet nå ligger i `<head>`.

### Babel
En av de viktigste transofmeringene for oss utviklere er at man kan skrive ny javascript kode som faktisk kjører på "alle" nettlesere. In comes Babel. Babel lar oss skrive es6 javascript og definere polyfills (kode som skal byttes ut med spesifikk annen kode) som blir byttet ut med annen javascript som kjører i et brede spekter av nettlesere. Installer de følgende babel pakkene før du fortsetter:
`npm install @babel/core @babel/preset-env babel-loader --save-dev`. Babel core er hobedbiblioteket til babel, preset-env skal vi bruke til å konfigurere opp hva vi vil at babel skal gjøre og loaderen trenger vi for å integrere med webpack. Når disse pakkene er installert kan vi oppdatere webpack configen vår til å inkludere vår nye loader slik:
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
Hva skjer her? Som vanlig definerer vi `test` og `use`. Test er satt til alle javascript filer use er fortsatt loaderen vår og `exclude` lar oss spesifisere mapper vi ønsker at denne regelen ikke skal gjelde for. Det er både unødvendig on ineffektivt å kjøre babel transpilering på filene i node_modules. Babel konfigureres vanligvis via en .babelrc fil og en av pakkene ovenfor (preset env) skal vi bruke i configen her. Preset env kompilerer koden vår som er ES2015+ kompatibel ned til es5 kompatibel kode ved å på hvilke babel plugins og polyfills som trengs avhengig av browser eller miljø. Den enkleste måte å bruke preset env på er det følgende i .babelrc filen vår:
```
{
  "presets": ["@babel/preset-env"]
}
```

### Gjør selv
Sett opp og sjekk at babel faktisk fungerer. For å gjøre dette kan vi bruke et verktøy som heter es-check som kan installeres ved å kjøre `npm install es-check --save-dev`. Lag et npm script som peker programmet på output filen i bundelen din, f.eks: `es-check es5 ./dist/my-first-webpack.bundle.js`. Dersom du bruker babel loaderen når du bygger bundelen burde den passe es sjekken, mens dersom du ikke bruker den burde det kastes en feil.

### Typescript
I dag er det stadig mer populært å få typer inn i javascript verden. Den mest direkte måten å gjøre dette på er å introdusere Typescript eller Flow. Dette er rimelig enkelt nå som webpack configen vår begynner å komme seg. Man må selvfølgelig installere typescript med `npm install typescript` og deretter trenger vi en ts loader: `npm install --save-dev ts-loader`. Det vil også kreves en tsconfig.json som for øyeblikket kan være helt tom.
#### Oppgave
Lag en typescript fil som importeres og brukes fra javascript filene dine. 

### GJØR SELV:
Lag en typescript fil som eksporterer en funksjon, importer den i javascript filen du bruker som inngangspunkt og kall funksjonen fra jvaascript. 

### Html loader
Les litt opp på dette og sett oopp en HTML loader....

## Plugins
Der loaders brukes til å gjennomføre en spesifikk transformasjon på visse moduler/filer bruker man webpack plugins for å gjennomføre et bredere spekter av oppgaver. F.eks bundle-optimaliseringer, ressurshåndtering og miljøvariabeler trenger man plugins for å fikse. Mange av disse pluginsene kommer allerede med i en webpack installasjon og brukes uten at man nødvendigvis tenker over at det er en plugin. 

### Html Webpack Plugin
Selvom html filen som vi har lagd selv fungerer bra, hadde det vært fint om webpack kunne generert en for oss. HtmlWebpackPlugin gjør det enklere å lage html som server javascript bundlen vår.
Installer HtmlWebpackPlugin(`npm i --save-dev html-webpack-plugin`) og legg til dette i webpack configen:
```
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```
Dersom vi nå bygger prosjektet vårt(`npm run build`), ser vi at en html fil også har dukket opp i mappen `/dist`.
Vi kan få vår devserver til å benytte denne filen ved å sette `devServer.contentBase` til `path.resolve(__dirname, './dist/')`.  
Om vi nå starter devserveren(`npm start`), så lastes siden med både javascript og css, men javascripten vår feiler, ettersom den ser etter et element i DOM'en som ikke finnes. Vi løser dette ved å sette HTML filen vår som en template. Da vil webpack ta utgangspunkt i denne, og legge til en referanse til javascript-bundlen.
```
new HtmlWebpackPlugin({
            template: './src/index.html'
        })
```
Husk å samtidig fjerne script-taggen fra `src/index.html` slik at vi ikke laster inn javascripten vår to ganger.  
HtmlWebpackPlugin kan gjøre veldig mye mer, enn vist her, sjekk ut https://github.com/jantimon/html-webpack-plugin for et innblikk i det den kan gjøre.

### Bundle Analyzer
En annen nyttig plugin er [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer). Vi har allerede lært hvordan vi kan minimize bundlen vår slik at den egner seg bedre for produksjon. Likevell kan det hende at vi fortsatt sitter igjen med en veldig stor bundle. Da er webpack-bundle-analyzer et utrolig bra verktøy som lar oss se hvilke pakker bundlen vår inneholder, og hvor stor plass de faktisk tar.
Legg til pluginen på denne måten:
```
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```
KANSKJE VI KAN LEGGE TIL NOEN PAKKER SOM TAR STOR PLASS? LODASH F:EKS?

## React + hot reloading
Ettersom react faggruppen er her må vi selvsagt 
Trekk inn babel for react. Få en react component til å vises på skjermen. Få satt opp hot reloading for reactappen.

## Code splitting
Kodesplitting vil si å dele opp koden i flere bundles. Dette vil da gi deg mulighet til å laste bundler etter behov eller i parallell. Ved å gjøre dette kan man optimalisere lastetiden til applikasjonen ved å prioritere når ting skal lastes og at man henter mindre bundler. Kodesplitting kan gjøres på forskjellige måter i webpack: 

### Fler entry points:
	Man lager en annen start html og legger denne inn som et entry point i webpack.config.js:
  
```
entry: {
  entry: './path/to/my/entry/file.js',
  annet: './path/to/another/entry/file.js',
},
```
Kodesplitting ved et nytt entry point er den enkleste måten å dele opp koden, men i gjengjeld mister man fleksibiletet og man har ingen mulighet til å splitte dynamisk. Det vil også bli duplisert kode dersom de forskjellige modulene er avhengi av de samme pakkene. 

#### Forhindre duplisering av kode:
Dersom man har fler entry point som beskrevet over er det fler muligheter for å forhindre duplisert kode:
		- SplitChunksPlugin: Legge felles avhengigheter i en egen chunk.
		- Mini-css-extract-plugin: Splitte ut css fra applikasjonen.
		- Bundle-loader: Splitte kode og lazy laste budlene som kommer fra kodesplittingen.
		- Promise-loader: Lignende Bundle-loader men bruker promises.


#### Oppgave:
Opprett en html og en tilhørende .js fil. Legg html filen ved siden av den eksisterende index.html og js filen under src-mappen.

Prøv en enkel kodesplitting og sjekk at du får fler bundles. Prøv og å få den ene bundelen kun til å lastes ved behov (eks. dersom man klikker på en knapp

## Oppgradere til 4
Parcel gjør mye av det vi nå har satt opp automatisk og det gjør også webpack med versjon 4. La oss se på en oppgradering og finne ut av hvor mye konfigurasjon som faktisk forsvinner! 
