# Frontend for the Search Index for distributed Repositories (SIDRE)

This is a React frontend for a SIDRE instance. Which instance is addressed and which fields are displayed is configured in the `config.js` file. 

## Technologies

Used technologies:

### Elasticsearch:

Elasticsearch is a search engine based on the Lucene library. It provides a distributed, multitenant-capable full-text search engine with an HTTP web interface and schema-free JSON documents

### React JS:

The Web App is made with React JS and connects to the SIDRE backend Elasticsearch endpoint. It provides the user interface to make search queries or add items to Elasticsearch.

## Setup locally

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Adjust your SIDRE instance configuration in `public/config/config.js`
4. Start the development server with `npm start`

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

### `npm run test:coverage-show`

After you run test coverage, this command show the result. 

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### `build:prod` or  `build:dev`
Builds the app for production in a sub folder, default is <br>
* `/resources` for production
*  `/ ` for develoment <br><br>
if you want to change the name of sub folder you can change the  `PUBLIC_URL=/resources` in :
 
 * [.env.development](https://gitlab.com/oersi/oersi-frontend/-/blob/master/.env.development) for development mode
 * [.env.production](https://gitlab.com/oersi/oersi-frontend/-/blob/master/.env.production) for production mode

### `npm run lint`

Check before commit for identifying patterns,bugs or code smell, found in JavaScript code.

### `npm run lint:fix`

If code has an error or warning you can run `lint:fix` to fix those error.

### `npm run format`

Before commit format the code,so all code can have the same formating

# Configuration

The configuration can be specified in the file [public/config/config.js](public/config/config.js)

If you install/update the frontend through the [SIDRE Setup](https://gitlab.com/oersi/sidre/sidre-setup), you will find the file __config.js__ in the module [ frontend/](https://gitlab.com/oersi/sidre/sidre-setup/-/blob/master/ansible/roles). The template will be modified via Ansible-Variables.

## Field Configuration

You can configure the fields that should be used in the frontend.

### General field configuration

Basic field configuration that is generally valid for the specified fields.

| key                                                         | type    | mandatory                     | default | description                                                                                                                                                                                                                                                                                                                   |
|-------------------------------------------------------------|---------|-------------------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `fieldConfiguration`                                        | object  | y                             |         | basic field configurations - attributes defined below                                                                                                                                                                                                                                                                         |
| `fieldConfiguration.baseFields`                             | object  | y                             |         | define field names of basic fields that are used for common functionalities - attributes defined below                                                                                                                                                                                                                        |
| `fieldConfiguration.baseFields.title`                       | string  | y                             |         | The fieldname of the field that contains the title of the resource. This is used as resource heading.                                                                                                                                                                                                                         |
| `fieldConfiguration.baseFields.resourceLink`                | string  | y                             |         | The fieldname of the field that contains the url of the resource. This is used as external link to the resource.                                                                                                                                                                                                              |
| `fieldConfiguration.baseFields.licenseUrl`                  | string  | n                             |         | The fieldname of the field that contains the url of the resource license.                                                                                                                                                                                                                                                     |
| `fieldConfiguration.baseFields.author`                      | string  | n                             |         | The fieldname of the field that contains the authors of the resource. The field may contain a list of authors.                                                                                                                                                                                                                |
| `fieldConfiguration.baseFields.thumbnailUrl`                | string  | n                             |         | The fieldname of the field that contains the url of a thumbnail for the resource. This is used as preview image for the resource.                                                                                                                                                                                             |
| `fieldConfiguration.baseFields.description`                 | string  | n                             |         | The fieldname of the field that contains the description of the resource. Used in html metadata.                                                                                                                                                                                                                              |
| `fieldConfiguration.baseFields.keywords`                    | string  | n                             |         | The fieldname of the field that contains the keywords of the resource. The field may contain a list of keywords.  Used in html metadata.                                                                                                                                                                                      |
| `fieldConfiguration.options`                                | list    | n                             |         | a list of special field options (a field does not have to be listed here, it just needs to be listed, if an option should be used), each entry consists of the following values                                                                                                                                               |
| `fieldConfiguration.options[].dataField`                    | string  | y                             |         | the fieldname                                                                                                                                                                                                                                                                                                                 |
| `fieldConfiguration.options[].isHierarchicalConcept`        | boolean | n                             | false   | Concepts using a hierarchical structure can be defined here. This is used to show the hierarchical structure in the filter-view, for example.                                                                                                                                                                                 |
| `fieldConfiguration.options[].schemeParentMap`              | string  | y, if `isHierarchicalConcept` |         | Path to a json map containing all the childId -> parentId relations of a hierarchical concept.                                                                                                                                                                                                                                |
| `fieldConfiguration.options[].defaultDisplayType`           | string  | n                             |         | Instead of displaying the raw value per default, a type can be specified here that cotrols how to display values. Currently only used in filters. <br/><ul><li>`licenseGroup` - for license-url fields; activated grouping of licenses; example: display `https://creativecommons.org/licenses/by/4.0/` as `BY`</li><li></ul> |
| `fieldConfiguration.options[].grouping`                     | list    | n                             |         | List of grouping configuration for custom grouping in the frontend. Currently only used for licenses                                                                                                                                                                                                                          |
| `fieldConfiguration.options[].grouping[].regex`             | string  | y                             |         | regular expression to check if a value matches the group                                                                                                                                                                                                                                                                      |
| `fieldConfiguration.options[].grouping[].id`                | string  | y                             |         | unique id of the group. Has to match the regex of the group                                                                                                                                                                                                                                                                   |
| `fieldConfiguration.options[].grouping[].groupValue`        | string  | y                             |         | the human readable group name                                                                                                                                                                                                                                                                                                 |
| `fieldConfiguration.options[].collectOthersInSeparateGroup` | boolean | n                             | false   | if using grouping, collect all values not matching to any group in a separate 'OTHER' group                                                                                                                                                                                                                                   |
| `fieldConfiguration.options[].translationNamespace`         | string  | n                             |         | The i18n namespace that should be used to translate values in this field. If set, each value will be translated before being displayed using the given namespace.                                                                                                                                                             |

### Multilingual label

The frontend supports multilingual labels. That means that you can use a field with values for multiple languages in your data. The language that will be displayed depends on the selected language of the user. If the selected language does not exist in the data, then the frontend fallback languages will be used. If no fallback language exist in the data, then the first language-value from the data will be used.

Supported are field and map field types like
```
"name":[{"@language":"en","@value":"Test en"}, {"@language":"de","@value":"Test de"}]
```
and
```
"name":{"en":"Test en", "de":"Test de"}
```
A multilingual field may also contain a raw value for all languages (`"name":"Test"`)

| key                                                                | type   | mandatory                           | default | description                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|--------------------------------------------------------------------|--------|-------------------------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `fieldConfiguration.options[].multilingual`                        | object | n                                   |         | configuration for mulitlingual fields                                                                                                                                                                                                                                                                                                                                                                                                              |
| `fieldConfiguration.options[].multilingual.languageSelectionType`  | string | y                                   |         | defines how a value for a specific language should be selected in the desired field <br/><ul><li>`field` - the field contains a list of objects and the language is selected by a specific field in each object (example `"name":[{"@language":"en","@value":"Test en"}, {"@language":"de","@value":"Test de"}]`)</li><li>`map` - the field contains a map "languageCode" -> "value" (example `"name":{"en":"Test en", "de":"Test de"}`)</li></ul> |
| `fieldConfiguration.options[].multilingual.languageSelectionField` | string | y, if `languageSelectionType=field` |         | the field name for the language selection in each item of a multilingual object-list                                                                                                                                                                                                                                                                                                                                                               |
| `fieldConfiguration.options[].multilingual.valueField`             | string | y, if `languageSelectionType=field` |         | the field name for the value selection in each item of a multilingual object-list                                                                                                                                                                                                                                                                                                                                                                  |

### Search

Define search fields and search filters.

| key                                              | type             | mandatory | default                                                  | description                                                                                                                                                                                                                                                                  |
|--------------------------------------------------|------------------|-----------|----------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `search.globalDataRestrictions`                  | list             | n         |                                                          | A list of filter restrictions that should be applied to the search result for every search                                                                                                                                                                                   |
| `search.resultList`                              | object           | n         |                                                          | Configuration of the result list.                                                                                                                                                                                                                                            |
| `search.resultList.dataField`                    | string           | n         | value specified in `fieldConfiguration.baseFields.title` | data field to be connected to the result list’s UI view. It is useful for providing a sorting context.                                                                                                                                                                       |
| `search.resultList.pagination`                   | boolean          | n         | true                                                     | Enable/Disable pagination                                                                                                                                                                                                                                                    |
| `search.resultList.paginationAt`                 | string           | n         | bottom                                                   | Determines the position where to show the pagination, only applicable when `pagination` prop is set to true. Accepts one of `top`, `bottom` or `both` as valid values.                                                                                                       |
| `search.searchField`                             | object           | y         |                                                          | Configuration of the search field.                                                                                                                                                                                                                                           |
| `search.searchField.dataField`                   | list of strings  | y         |                                                          | Search fields to be connected to the search field’s UI view. Useful for applying search across multiple fields.                                                                                                                                                              |
| `search.searchField.fieldWeights`                | list of numbers  | n         |                                                          | Set the search weight for the search fields, useful when dataField is an Array of more than one field. A higher number implies a higher relevance weight for the corresponding field in the search results.                                                                  |
| `search.searchField.fuzziness`                   | string or number | n         | 0                                                        | Sets a maximum edit distance on the search parameters, can be `0`, `1`, `2` or `AUTO`. Useful for showing the correct results for an incorrect search parameter by taking the fuzziness into account. For example, with a substitution of one character, fox can become box. |
| `search.searchField.debounce`                    | number           | n         | 100                                                      | Sets the milliseconds to wait before executing the query after typing in the search field.                                                                                                                                                                                   |
| `search.filters`                                 | list             | y         |                                                          | a list of search filter configurations. Each entry consists of the following values:                                                                                                                                                                                         |
| `search.filters.type`                            | string           | n         | multiSelection                                           | The type of the filter. Allowed values: <br><ul><li>`multiSelection` - a list filter showing all existing values that allows to select multiple items</li><li>`switch` - a switch filter that allow to show only records matching a specific value</li></ul>                 |
| `search.filters.componentId`                     | string           | n         | value specified in `dataField`                           | Unique identifier of the component. Will be used in URL params.                                                                                                                                                                                                              |
| `search.filters.dataField`                       | string           | y         |                                                          | Field to be connected to the filters’s UI view. This field is used for doing an aggregation and returns the result.                                                                                                                                                          |
| `search.filters.labelKey`                        | string           | n         | values specified in `searchField.filters.dataField`      | i18n key of the filter label                                                                                                                                                                                                                                                 |
| `search.filters.showMissing`                     | boolean          | n         | true                                                     | (only used for `type=multiSelection`) List records without value for the specified field in the filter.                                                                                                                                                                      |
| `search.filters.showSearch`                      | boolean          | n         | false                                                    | (only used for `type=multiSelection`) Use a search field in the filter view.                                                                                                                                                                                                 |
| `search.filters.reloadFilterOnSearchTermChange`  | boolean          | n         | false                                                    | (only used for `type=multiSelection`) Reload the filter data from the backend, when modifying the search term in the filter-search. Useful for filters having more values than `size`.                                                                                       |
| `search.filters.reloadFilterDebounce`            | number           | n         | 150                                                      | (only used for `type=multiSelection`) Milliseconds to wait before executing the reload-query after typing in the filter search field.                                                                                                                                        |
| `search.filters.reloadFilterMinSearchTermLength` | number           | n         | 3                                                        | (only used for `type=multiSelection`) Minimum number of characters of the search term in the filter-search before the reload-query is executed.                                                                                                                              |
| `search.filters.size`                            | number           | n         | 100                                                      | (only used for `type=multiSelection`) Number of list items to be displayed. Max value for this prop can be `1000`.                                                                                                                                                           |
| `search.filters.allowedSearchRegex`              | string           | n         | ^[\u00C0-\u017Fa-zA-Z0-9 .-]*$                           | (only used for `type=multiSelection`) Restrict allowed characters in the filter search field to the specified regex.                                                                                                                                                         |
| `search.filters.switchableFieldValue`            | string           | y         |                                                          | (only used for `type=switch`) The value to filter all record for the field specified in `dataField`                                                                                                                                                                          |
| `search.filters.defaultChecked`                  | boolean          | y         |                                                          | (only used for `type=switch`) Define wether the switch is checked per default.                                                                                                                                                                                               |

### Embedding field configuration

Define the fields that are used for the "embed-resource"-feature. Base fields from `fieldConfiguration.baseFields.*` are also used here and do not have to be specified twice.

| key                                             | type            | mandatory | default | description                                                                                                                                                                                                                                              |
|-------------------------------------------------|-----------------|-----------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `fieldConfiguration.embedding`                  | object          | n         |         | embed field configurations - attributes defined below                                                                                                                                                                                                    |
| `fieldConfiguration.embedding.mediaUrl`         | string          | n         |         | The fieldname of the field that contains the embed url of the resource. If a list of URLs, the first value is used. If no value, fallback will be used.                                                                                                  |
| `fieldConfiguration.embedding.fallbackMediaUrl` | list of strings | n         |         | The fieldnames of the fields that should be used as fallback, if there is no value for the `mediaUrl` field. Values are determined in the specified order of the fieldname-list. If no value, the `thumbnailUrl` of basefields is used as last fallback. |

### Result Card

Configure the content fields that should be shown on the result cards.

| key                             | type            | mandatory | default                                                  | description                                                                                                                                                                   |
|---------------------------------|-----------------|-----------|----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `resultCard.title`              | object          | n         | default title from `fieldConfiguration.baseFields`       | specify how the heading/title of the card is displayed                                                                                                                        |
| `resultCard.title.field`        | string          | n         | value specified in `fieldConfiguration.baseFields.title` | the fieldname of the field whose value is used as the heading/title of the card                                                                                               |
| `resultCard.title.maxLines`     | number          | n         | 2                                                        | maximum lines that should be shown on the card. If the field value exceeds the maximum space, the overflow is hidden.                                                         |
| `resultCard.title.bold`         | boolean         | n         | true                                                     | Use bold text true/false                                                                                                                                                      |
| `resultCard.subtitle`           | object          | n         |                                                          | specify how the subtitle of the card is displayed                                                                                                                             |
| `resultCard.subtitle.field`     | string          | y         |                                                          | the fieldname of the field whose value is used as the subtitle of the card                                                                                                    |
| `resultCard.subtitle.maxLines`  | number          | n         | 1                                                        | maximum lines that should be shown on the card. If the field value exceeds the maximum space, the overflow is hidden.                                                         |
| `resultCard.subtitle.bold`      | boolean         | n         | true                                                     | Use bold text true/false                                                                                                                                                      |
| `resultCard.content`            | list            | n         |                                                          | a list of field configurations that should be used in the content area of the card. Each entry consists of the following values                                               |
| `resultCard.content[].field`    | string          | y         |                                                          | the fieldname of the field whose value is used as content                                                                                                                     |
| `resultCard.content[].maxLines` | number          | n         | 1                                                        | maximum lines that should be shown on the card. If the field value exceeds the maximum space, the overflow is hidden.                                                         |
| `resultCard.content[].bold`     | boolean         | n         | false                                                    | Use bold text true/false                                                                                                                                                      |
| `resultCard.content[].fallback` | list of strings | n         |                                                          | The fieldnames of the fields that should be used as fallback, if there is no value for the `field` field. Values are determined in the specified order of the fieldname-list. |

### Detail page

Configure the content fields that should be shown on the detail page.

| key                                      | type   | mandatory | default           | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|------------------------------------------|--------|-----------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `detailPage.content`                     | list   | y         |                   | a list of field configurations that should be used in the content area of the detail page. Each entry consists of the following values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `detailPage.content[].field`             | string | y         |                   | the fieldname                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `detailPage.content[].type`              | string | n         | `text`            | the type of the view / how field values should be displayed. Possible values are: <br/><ul><li>`chips` - use Chip-Components to display the values</li><li>`date` - a locale representation of a date field</li><li>`group` - Group values in a column on the detail page. Displayed values must be configured via a field `content` whose configuration is identical to `detailPage.content`</li><li>`license` - license icon and link for known license urls</li><li>`link` - an external link, labelled by the field value. The field link has to be given in another field that is configured via `externalLinkField`</li><li>`text` - the value as text</li><li>`fileLink` - (experimental, may change) download-links for fields containing the content-url. Additional info file-format and file-size could be shown, if fields `formatField` and `sizeField` are configured</li><li>`nestedObjects` - a nested list of objects. Display must be configured via a field `content` whose configuration is identical to `detailPage.content`</li><li>`rating` - (experimental, may change) for positive (thumbs up) rating count fields</li><li>`tabs` - display multiple fields via tabs. The different fields must be configured via a field `content` whose configuration is identical to `detailPage.content`</li> |
| `detailPage.content[].externalLinkField` | string | n         |                   | used for `type=link` to configure the field that contains the external link                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `detailPage.content[].labelKey`          | string | n         | value of `field`  | The `data.fieldLabels` translation key that should be used for the label of the value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `detailPage.content[].multiItemsDisplay` | string | n         | `comma-separated` | How should multiple items be displayed? <br/><ul><li>`comma-separated` - comma separated in the same line</li><li>`ul` - unordered (bulleted) list with an entry for every item</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `detailPage.content[].formatField`       | string | n         |                   | additional info for `type=fileLink` to configure the field that contains the file format                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `detailPage.content[].sizeField`         | string | n         |                   | additional info for `type=fileLink` to configure the field that contains the file size                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `detailPage.content[].weight`            | number | n         | 3                 | weight defines the number of columns to use to display the value on the detail page. Number of possible coulmns: 3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

## Embedded structured data adjustments

There is the possibility to adjust the structured data that is embedded in the html page as `ld+json` for the detail pages. The data record metadata can be modified via the following config.

Currently, you can only adjust the root fields of the record. At the moment it is not possible to modify subfields.

| key                                               | type   | mandatory         | default | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|---------------------------------------------------|--------|-------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `embeddedStructuredDataAdjustments`               | list   | n                 |         | a list of adjustment configurations that should be used for the embedded ld+json in the html page. Each entry consists of the following values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `embeddedStructuredDataAdjustments[].fieldName`   | string | y                 |         | the fieldname of the field that should be adjusted                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `embeddedStructuredDataAdjustments[].action`      | string | y                 |         | the action / the type of the adjustment. Possible values are:<br/><ul><li>`replace` - replace the existing value of the field by the value specified in `value`</li><li>`map` - map an existing object value or list of object values. If the value is a list, then map every list item. <ul><li>If a field name in `attribute` is specified, then use the value in this field as new value.</li><li>If otherwise a list of adjustments is specified in `adjustments`, then process these adjustments on the item with the same options as the root adjustments.</li></ul></li><li>`remove` - remove the existing field value from the record</li><li>`copy` - copy the value from another field, specified in `src`, into the specified field</li></ul> |
| `embeddedStructuredDataAdjustments[].adjustments` | list   | depends on action |         | adjustments to be used in object mapping. config like `embeddedStructuredDataAdjustments[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `embeddedStructuredDataAdjustments[].attribute`   | string | depends on action |         | the field name of the field to be mapped to                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `embeddedStructuredDataAdjustments[].src`         | string | y for `copy`      |         | the field name of the field whose values should be copied                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `embeddedStructuredDataAdjustments[].value`       | string | y for `replace`   |         | the value that should be used as replacement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

# Style Customization

## Override CSS 

it is possible to change CSS after the build (in run-time).  Mostly all CSS class can be overridden.
<br>
To override the existing style, you can do it through the `style-override.css` file. 
<br><br>
The system will check for the file __style-override.css__   (If not exist you can add it).

In **path** :

>  ```/public/css/style-override.css```

* if you are running through the [SIDRE Setup](https://gitlab.com/oersi/sidre/sidre-setup) , you will find the file __style-override.css__ in module [ oer-search-index-frontend/](https://gitlab.com/oersi/oersi-setup/-/blob/master/ansible/roles/oer-search-index-frontend/templates/style-override.css) , You can modify from there and run setup again .

## Custom Title

You can change the default title "Search Index" via adjustments of the translation files (`HEADER.TITLE`). You can also deactivate the title and just use a (custom) logo - for this just override `sidre-header-title` with `display:none;` for example. 

## Custom Logo

You can override the existing default logos in the public folder. In this case, please adjust all the different versions of the default logo, that means `apple-touch-icon.png`, `logo-192.png`, `logo-512.png`, `logo-maskable-256.png`, `favicon.ico`. In sidre-setup, you can use the ansible-variable `oerindex_frontend_custom_files` for this.

It is also possible to use custom urls for the logo in the header. You may use different versions for dark-mode and also for small screen sizes. This way you could use svg-logos for example. To configure this feature, please adjust `HEADER_LOGO_URL` in `config.js`.  

## footer Override 

The footer is the most visible and out-of-the-way place for the technical and legal information of a website that is necessary for the owner to share, because of the value the footer has, we decide to leave it outside the website so everyone can personalize, and add it's own information on it.

1. Where I can find it?

  We have implemented a template for the footer, which can later be modified and personalized so that it is available to anyone who wants their own information.
  You can find them in:
* [public/footer/en/footer.html](public/footer/en/footer.html), for English language
* [public/footer/de/footer.html](public/footer/de/footer.html), for German language
<br>
2. To support more languages for the footer you can follow this workflow

**example:**<br>
 `public/footer/{lang}/footer.html` -where {lang} is Language code example:` en|it|de|sq` etc.

Our template uses some __CSS__ styles and you can override them or add your own style, you can use the __style-override.css__  and you can find it in [public/css/style-override.css](public/css/style-override.css).
<br><br>

### add new footer through the setup
You can configure your footer through the ansible-variable `oerindex_frontend_custom_footers` see [https://gitlab.com/oersi/sidre/sidre-setup/-/blob/master/ansible/group_vars/all.yml](https://gitlab.com/oersi/sidre/sidre-setup/-/blob/master/ansible/group_vars/all.yml).

  - create a file  and call it `footer.html` 
  - set file with `path` and `language` in `oerindex_frontend_custom_footers` in your inventory-file (or directly in file `ansible/group_vars/all.yml` if you test locally with Vagrant)
  - run setup again

# Language

The preferred language of your browser will be used for display.
 Some static texts like in Header can be translated in your Language.<br> You can change the translations via json files, which you can find in` public/locales/<LANGUAGECODE>`. The following files are available:
* `translation.json` - contains common translations
* `data.json` - contains labels for the data schema used
* `language.json` - contains labels for ISO 639-1-Codes language codes

###  to add a new language you need to :
  - create another folder in `locales` with your language Code. example: for Deutsch __de__ 
  - Copy json files mentioned above under the `locales/en` and paste it, in folder you have created
  - Translate it.
  
### add new language through the setup
You can configure your translations through the ansible-variable `oerindex_frontend_custom_translations` see [https://gitlab.com/oersi/sidre/sidre-setup/-/blob/master/ansible/group_vars/all.yml](https://gitlab.com/oersi/sidre/sidre-setup/-/blob/master/ansible/group_vars/all.yml).

 - translate your translation-files
 - set each translation-file with `path` and `language` in `oerindex_frontend_custom_translations` in your inventory-file (or directly in file `ansible/group_vars/all.yml` if you test locally with Vagrant)
 - run setup again

# Cookie notice 

A cookie notice is a cookie warning that pops up on websites when a user visits the site for the first time. Cookies must be accompanied by a  link to the cookies policy in the pop-up box message. This allows users to learn more about cookies and ways to control them in the cookies settings.

<!-- How to configure policy: -->

1. How to configure policy

    - local files
        - Create a folder in `public` folder, example: `policy/`
        - Create another folder with the language code example: for English `en` 
        - copy and paste __Privacy__ html  file under the `policy/en/`
        - go to `config/config.js` and add configuration like below .<br>
          __example:__
          ```javascript
            GENERAL_CONFIGURATION:{
            PRIVACY_POLICY_LINK: [
              {'path': 'policy/en/privacy.html', 'language': 'en'}
            ] 
          }  
          
          ```

    - Attaching links
      - To Attaching the link, need only configuration <br>
      __example:__ 
      ```javascript
        GENERAL_CONFIGURATION:{
        PRIVACY_POLICY_LINK: [
          {'path': '{https://example.com/privacy}', 'language': 'en'}
        ] 
      }  
      
      ```

    - add new cookie policy through the setup <br>
      You can configure your cookies policy through the ansible-variable `oerindex_frontend_custom_cookie_links` see [sidre-setup](https://gitlab.com/oersi/sidre/sidre-setup/-/blob/master/ansible/group_vars/all.yml). <br>`oerindex_frontend_custom_cookie_links` accept an array with objects, **example:** `{'path': '{link}', 'language': '{languageCode}'}`.

      - set each link with `path` and `language` in `oerindex_frontend_custom_cookie_links` in your inventory-file (or directly in file `ansible/group_vars/all.yml` if you test locally with Vagrant)
      - run setup again

# Embed Resources
If enabled, the user can copy an embed-html-snippet into the clipboard for every resource that contains all necessary metadata (for example, BY licenses must include the author).
* Can be activated in `config.js` via the feature flag `RESOURCE_EMBEDDING_SNIPPET`.
