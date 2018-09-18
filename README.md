# webpack-workshop

## Introduksjon
I denne workshopen skal vi fokusere på webpack som utgangspunkt for å utforske hva som faktisk skjer når man bygger en frontend. Det er ofte mange forskjellige prosesser koden går gjennom og webpack lar oss utforske disse gradvis ved å sette opp vår egendefinerte konfigurasjon. Med webpack 4 og Parcel er det mulig å få mye av det vi setter opp manuelt i denne workshopen gratis, men i reelle kundesituasjoner er det veldig vanlig at man alikevel må frem med noe manuell konfigurasjon for å få ting til å fungere i kunden sitt miljø.

Derfor starter vi i denne workshoppen med det aller mest grunnleggende, hvordan webpack bygger en _bundle_ basert på avhengighetene til en angitt fil. Videre vil vi se på ytterligere konfigurasjonsmuligheter, som hvordan vi kan dra nytte av Babel, less, og typescript, ved hjelp av _Loaders_ og _Plugins_. Vi kommer til å utforske forskjellen på produksjonsbygg og bygg best egnet for våre interne og lokale utviklingsmiljøer. Til slutt vil vi se på litt snacks som gjør hverdagen vår som utvikler litt mer behagelig.

## Oppgave 1

### Basic setup
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
Hver gang webpack kommer over en path som viser seg å være en '.txt' så skal man sende denne gjennom 'raw-loader' slik at den kan transformeres før den legges til bundelen. I de neste seksjonene skal vi sette opp litt forskjellige loaders som er veldig vanlige å bruke. Dere kan selv velge hvor mange av loaderene dere vil se på.

#### Oppgave
Bruk raw loaderen til å importere en tekstfil som en streng og bruk denne i javascripten deres.

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

//ALTERNATIVT- kunne vi hatt en ferdig css fil, som de da manuelt må importere inn et sted i koden for å se at styling blir lagt til. Jeg forestiller meg selv at det ikke ligger så mye nytte i at de skal skrive litt random css selv. Men om de faktisk må importere den demonstrer vi at webpack trenger å vite at det er en dependency på et vis.

### Babel
En av de viktigste transofmeringene for oss utviklere er at man kan skrive ny javascript kode som faktisk kjører på "alle" nettlesere. In comes Babel. Babel lar oss skrive es6 javascript og definere polyfills (kode som skal byttes ut med spesifikk annen kode) som blir byttet ut med annen javascript som kjører i et brede spekter av nettlesere. HA MED EN LINK FOR NPM INSTALL HER! Legg til en regel som ser slik ut:
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
          plugins: [require('@babel/plugin-proposal-class-properties')]
        }
      }
    }
  ]
}
```
Hva skjer her? Som vanlig definerer vi `test` og `use`. Test er satt til alle javascript filer, mens use har litt flere finurligheter og vi har en ny ting som heter `exclude`. Exclude er rimelig enkel, vi spesifiserer mapper vi ønsker at denne regelen ikke skal gjelde for. Det er både unødvendig on ineffektivt å kjøre babel transpilering på filene i node_modules.
Under `use` definerer vi litt mer enn vi er vant til. `use.loader` spesifiserer hvilken loader vi skal bruke, mens `use.options` lar oss confige babel sin oppførsel med et _options_ objekt. I eksempelet over setter vi _@babel/preset-env_ som en _preset_. Dette tillater oss å jobbe med den siste versjonen av ECMAScript. Den dekker dog ikke eksperimentelle features, som for eksempel _class-properties_. For at babel skal klare å transpilere de, må vi legge den til i listen med plugins.

 

### Gjør selv
FINN PÅ NOE VI TRENGER BABEL TIL FOR Å VERIFISERE.
Hva er babel. Eksempel på noe som ikke fungerer i IE10(??) og som vi får til å fungere ved å kjøre koden gjennom babel. 

TODO(for oss): Lag et npm script som kjører denne pakken: https://www.npmjs.com/package/es-check (kan sette opp .rc fil som peker til spesifikk fil og versjon)

Kommandoen `npm run escheck` sjekker om outputen fra vår webpack pipeline er gyldig es5 kode. Om vi kjører denne kommandoen nå, ser vi at den feiler. (TENKER AT VI ALLEREDE HAR LITT DIV KODE SOM TRENGER POLYFILL OG TRANSPILERING?)
Legg til loader for babel med de rette polyfillene slik at bundlen vår blir gyldig es5.
Bekreft at bundlen er gyldig ved å kjøre kommandoen `npm run escheck`.
(VED Å BEGRENSE INNHOLDET I EKSEMPLET OVER HER TIL BARE MINIMUM, OG HELLER VISE TIL BABEL SINE SIDER, SÅ KAN DETTE VÆRE EN OPPGAVE HVOR DE MÅ TENKE LITT SELV FOR Å FINNE RETT CONFIG OG POLYFILLS? OGSÅ EN LITEN NØTT MED `transform-runtime` greia)


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
For å bruke plugins må de importeres inn i webpack configen via require og brukes i `plugins` slik:
```
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```
I dette eksempelet har man installert `html-webpack-plugin` som vil generere en html fil for applikasjonen vår hvor all den bundla javascripten er inkludert. 

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


### ?????
## Developmentbygg og produksjonsbygg
Webpack støtter også forskjellige byggsituasjoner avhengig av om det er et bygg som skal brukes under utvikling eller som skal havne i den endelige produksjonsbundelen. Vi kan velge i mellom _production_, _development_ eller _none_. Hva slags bygg situasjon man er i fører til at forskjellige plugins er aktive og at den endelige bundelen ser forskjellig ut. Man kan variere byggmodus som et CLI argument `webpack --mode=production` eller ved å sette i i config filen: 
```
module.exports = {
  mode: 'production'
};
```

Ved å sette en _mode_ blir følgende config unødvendig:

### Mode: development
```diff
module.exports = {
+ mode: 'development'
- devtool: 'eval',
- plugins: [
-   new webpack.NamedModulesPlugin(),
-   new webpack.NamedChunksPlugin(),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
}
```

### Mode: production
```diff
module.exports = {
+  mode: 'production',
-  plugins: [
-    new UglifyJsPlugin(/* ... */),
-    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-    new webpack.optimize.ModuleConcatenationPlugin(),
-    new webpack.NoEmitOnErrorsPlugin()
-  ]
}
```


### Mode: none
```diff
module.exports = {
+  mode: 'none',
-  plugins: [
-  ]
}
```
DENNE VISNINGEN SÅ BRA UT I BABEL DOCS, MEN VET IKKE OM VI BURDE GJØRE DET ANNERLEDES HER?

## React + hot reloading
Ettersom react faggruppen er her må vi selvsagt 
Trekk inn babel for react. Få en react component til å vises på skjermen. Få satt opp hot reloading for reactappen.

## Code splitting
Ikke laste mer enn nødvendig. Splitte opp applikasjonen vår i forskjellige deler som kan lastes etterhvert som det er nødvendig. 

## Oppgradere til 4
Parcel gjør mye av det vi nå har satt opp automatisk og det gjør også webpack med versjon 4. La oss se på en oppgradering og finne ut av hvor mye konfigurasjon som faktisk forsvinner! 
