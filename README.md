# Information

### Elasticsearch:

Elasticsearch is a search engine based on the Lucene library. It provides a distributed, multitenant-capable full-text search engine with an HTTP web interface and schema-free JSON documents

### React JS:

The WebApp is made with React JS and using ReactiveSearch to connect to Elasticsearch. It provides the user interface to make search queries or add items to Elasticsearch.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />

### `npm run test:coverage`

With this command you can run the test coverage.
and also it generate a folder when you can see the result of coverage, for entire project1

```
 path: <ROOT_FOLDER>/coverage/lcov-report/index.html
```

### `npm run test:coverage-show`

After you run test coverage, this command show the result , 



### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### `build:prod` or  `build:dev`
Builds the app for production in a sub folder, default is 
<br>`/oersi` for production
<br /> `/ ` for develoment <br>
if you want to change the name of sub folder you can do it in `PUBLIC_URL=/oersi`
 
 * `.env.development` for development mode
 * `.env.production` for production mode

### `npm run build:show`

if you want to see how it look the build project, you can run this command 

### `npm run lint`

check before commit for identifying   patterns,bugs or code smell, found in JavaScript code,

### `npm run lint:fix`

If code has error or warning you can run `lint:fix` to fix those error,

### `npm run format`

Before commit format the code,so all code can have the same formating




# Configuration

In **path** :

```
<ROOT_FOLDER>/public/config/config.json
```

it's a file for configuration in run time Connection with elasticSearch

after you add the url and credencial for elastic search you just refresh the page and it's ok

<br>
<br>

# Style Override 

it is possible to change CSS after the build (in run-time).  Mostly all CSS class can be overridden.
<br>
To override the existing style, you can do it through the `style-override.css` file. 
<br><br>
The system will check for the file __style-override.css__   (If not exist you can add it).

In **path** :

>  ```/public/css/style-override.css```

<br>

* if you are running through the [OER Search Index Setup](https://gitlab.com/oersi/oersi-setup) , you will find the file __style-override.css__ in module `oer-search-index-frontend/` , You can modify from there and run setup again .


