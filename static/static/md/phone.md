# phone

## number([format])

Generates random phone number

| Param  | Type   |           Default            |
| ------ | ------ | :--------------------------: |
| format | string | `faker.phone.phoneFormats()` |

> format is passed to
> [faker.helpers.replaceSymbolWithNumber()](/docs/helpers.md#replacesymbolwithnumber-string-symbol)

```js
faker.phone.number(); // 1-730-333-7081 x32099
faker.phone.number("(###) ###-####"); // (250) 588-2438
```

## numberFormat([index])

Generates random phone number format

| Param | Type   | Default |
| ----- | ------ | :-----: |
| index | number |   `0`   |

> index value is based on the locales definition

```js
faker.phone.numberFormat(); // 127-631-6723
faker.phone.numberFormat(5); // (214) 291-8333
```

## phoneFormats

Generates random phone formats

```js
faker.phone.phoneFormats(); // ###.###.#### x####
```
