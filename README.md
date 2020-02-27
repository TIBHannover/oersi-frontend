# Information

### Elasticsearch:

Elasticsearch is the search engine and indexes the input it gets from Logstash.

##

### React JS:

The WebApp is made with React JS and using ReactSearch to connect to Elasticsearch. It provides the user interface to make search queries or add items to Elasticsearch.

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

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### configuration

In **path** :

```
<ROOT_FOLDER>/public/config/config.json
```

it's a file for configuration in run time Connection with elasticSearch

after you add the url and credencial for elastic search you just refresh the page and it's ok
