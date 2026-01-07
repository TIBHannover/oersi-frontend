For adding a new language to the SIDRE, we need to extend the labels of the frontend and of the vocabularies used in our data. You can help us by providing these translations.

### Description
(Which new language should be added here? Are you a native speaker?)

### Tasks

* [ ] Create a new `translation.json` file and translate all the labels in this file (except `HEADER` and `META` labels). Template for this is [public/locales/en/translation.json](https://gitlab.com/oersi/oersi-frontend/-/blob/master/public/locales/en/translation.json)
* [ ] Create a new `data.json` file and translate all the labels in this file. Template for this is [public/locales/en/data.json](https://gitlab.com/oersi/oersi-frontend/-/blob/master/public/locales/en/data.json)
* [ ] Create a translated footer under https://gitlab.com/oersi/sidre/sidre-frontend/-/tree/master/public/footer
* Create search index specific translations. Following points are needed for OERSI, please ask us for other applications
    * Extend the vocabulary-ttl-files used by OERSI: there needs to be an additional entry in the `skos:prefLabel` for the new [ISO-639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for _every_ `skos:Concept`-entry.
        * example
        ```
        skos:prefLabel "Softwareanwendung"@de, "Software Application"@en, "TRANSLATE ME"@<YOUR-NEW-ISO639-1-CODE> .
        ```
        * [ ] https://raw.githubusercontent.com/dini-ag-kim/hcrt/master/hcrt.ttl
        * [ ] https://raw.githubusercontent.com/dini-ag-kim/hochschulfaechersystematik/master/hochschulfaechersystematik.ttl
        * [ ] (optional) https://raw.githubusercontent.com/dcmi/lrmi/main/lrmi_vocabs/educationalAudienceRole/educationalAudienceRole.ttl
        * [ ] (optional) https://raw.githubusercontent.com/dini-ag-kim/value-lists/main/conditionsOfAccess.ttl
        * [ ] (optional) https://raw.githubusercontent.com/dini-ag-kim/educationalLevel/main/educationalLevel.ttl

#### SIDRE-internal (will be processed by the SIDRE-team)
* [ ] Create a new iso639-1 folder under https://gitlab.com/oersi/sidre/sidre-frontend/-/tree/master/public/locales
* [ ] Create a `language.json` inside of the new folder. Can be created via [get-language-labels.py](https://gitlab.com/oersi/oersi-setup/-/tree/master/tools/scripts/get-language-labels.py) (uses Wikidata).
* [ ] In `common/translation.json`: add `HEADER.CHANGE_LANGUAGE`-entry for the new language.
* [ ] Create PullRequests in the github-repositories of the vocabularies.
* [ ] Extend synonyms-process for multilingual search
