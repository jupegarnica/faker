# Localization

As of version `v2.0.0` faker.js has support for multiple localities.

The default language locale is set to English.

Setting a new locale is simple:

```js
// sets locale to de
faker.setLocale("de");
// or
faker.locale = "de";
```

### Locales included

- az
- cz
- de
- de_AT
- de_CH
- en
- en_AU
- en_BORK
- en_CA
- en_GB
- en_IE
- en_IND
- en_US
- en_ZA
- en_au_ocker
- es
- es_MX
- fa
- fr
- fr_CA
- ge
- id_ID
- it
- ja
- ko
- nb_NO
- nep
- nl
- pl
- pt_BR
- pt_PT
- ru
- sk
- sv
- tr
- uk
- vi
- zh_CN
- zh_TW

## Individual Localization Packages

As of vesion `v3.0.0` faker.js supports incremental loading of locales.

By default, requiring `faker` will include _all_ locale data.

In a production environment, you may only want to include the locale data for a
specific set of locales.

```js
// loads only de locale
var faker = require("faker/locale/de");
```
