# image

## image([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.image(); // http://lorempixel.com/640/480/nightlife
faker.image.image(200); // http://lorempixel.com/200/480/sports
faker.image.image(200, 600); // http://lorempixel.com/200/600/animals
faker.image.image(200, 600, true); // http://lorempixel.com/200/600/transport?12438
```

## avatar

Return random avatar url

```js
faker.image.avatar(); // https://s3.amazonaws.com/uifaces/faces/twitter/martip07/128.jpg
```

## imageUrl([width[, height[, category[, randomize[, https]]]]])

Return [lorempixel](http://lorempixel.com/) url

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| category  | string  |  `480`  |
| randomize | boolean | `false` |
| https     | boolean | `false` |

**Category Options:** `abstract` `animals` `business` `cats` `city` `food`
`nightlife` `fashion` `people` `nature` `sports` `technics` `transport`

```js
faker.image.imageUrl(); // http://lorempixel.com/640/480
faker.image.imageUrl(200); // http://lorempixel.com/200/480
faker.image.imageUrl(200, 600); // http://lorempixel.com/200/600
faker.image.imageUrl(200, 600, "animals"); // http://lorempixel.com/200/600/animals
faker.image.imageUrl(200, 600, "animals", true); // http://lorempixel.com/200/600/animals?3853
faker.image.imageUrl(200, 600, "animals", true, true); // https://lorempixel.com/200/600/animals?98461
```

## abstract([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from abstract category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.abstract(); // http://lorempixel.com/640/480/abstract
faker.image.abstract(200); // http://lorempixel.com/200/480/abstract
faker.image.abstract(200, 600); // http://lorempixel.com/200/600/abstract
faker.image.abstract(200, 600, true); // http://lorempixel.com/200/600/abstract?89872
```

## animals([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from animals category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.animals(); // http://lorempixel.com/640/480/animals
faker.image.animals(200); // http://lorempixel.com/200/480/animals
faker.image.animals(200, 600); // http://lorempixel.com/200/600/animals
faker.image.animals(200, 600, true); // http://lorempixel.com/200/600/animals?89872
```

## business([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from business category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.business(); // http://lorempixel.com/640/480/business
faker.image.business(200); // http://lorempixel.com/200/480/business
faker.image.business(200, 600); // http://lorempixel.com/200/600/business
faker.image.business(200, 600, true); // http://lorempixel.com/200/600/business?89872
```

## cats([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from cats category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.cats(); // http://lorempixel.com/640/480/cats
faker.image.cats(200); // http://lorempixel.com/200/480/cats
faker.image.cats(200, 600); // http://lorempixel.com/200/600/cats
faker.image.cats(200, 600, true); // http://lorempixel.com/200/600/cats?89872
```

## city([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from city category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.city(); // http://lorempixel.com/640/480/city
faker.image.city(200); // http://lorempixel.com/200/480/city
faker.image.city(200, 600); // http://lorempixel.com/200/600/city
faker.image.city(200, 600, true); // http://lorempixel.com/200/600/city?89872
```

## food([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from food category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.food(); // http://lorempixel.com/640/480/food
faker.image.food(200); // http://lorempixel.com/200/480/food
faker.image.food(200, 600); // http://lorempixel.com/200/600/food
faker.image.food(200, 600, true); // http://lorempixel.com/200/600/food?89872
```

## nightlife([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from nightlife category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.nightlife(); // http://lorempixel.com/640/480/nightlife
faker.image.nightlife(200); // http://lorempixel.com/200/480/nightlife
faker.image.nightlife(200, 600); // http://lorempixel.com/200/600/nightlife
faker.image.nightlife(200, 600, true); // http://lorempixel.com/200/600/nightlife?89872
```

## fashion([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from fashion category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.fashion(); // http://lorempixel.com/640/480/fashion
faker.image.fashion(200); // http://lorempixel.com/200/480/fashion
faker.image.fashion(200, 600); // http://lorempixel.com/200/600/fashion
faker.image.fashion(200, 600, true); // http://lorempixel.com/200/600/fashion?89872
```

## people([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from people category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.people(); // http://lorempixel.com/640/480/people
faker.image.people(200); // http://lorempixel.com/200/480/people
faker.image.people(200, 600); // http://lorempixel.com/200/600/people
faker.image.people(200, 600, true); // http://lorempixel.com/200/600/people?89872
```

## nature([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from nature category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.nature(); // http://lorempixel.com/640/480/nature
faker.image.nature(200); // http://lorempixel.com/200/480/nature
faker.image.nature(200, 600); // http://lorempixel.com/200/600/nature
faker.image.nature(200, 600, true); // http://lorempixel.com/200/600/nature?89872
```

## sports([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from sports category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.sports(); // http://lorempixel.com/640/480/sports
faker.image.sports(200); // http://lorempixel.com/200/480/sports
faker.image.sports(200, 600); // http://lorempixel.com/200/600/sports
faker.image.sports(200, 600, true); // http://lorempixel.com/200/600/sports?89872
```

## technics([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from technics category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.technics(); // http://lorempixel.com/640/480/technics
faker.image.technics(200); // http://lorempixel.com/200/480/technics
faker.image.technics(200, 600); // http://lorempixel.com/200/600/technics
faker.image.technics(200, 600, true); // http://lorempixel.com/200/600/technics?89872
```

## transport([width[, height[, randomize]]])

Return [lorempixel](http://lorempixel.com/) url from transport category

| Param     | Type    | Default |
| --------- | ------- | :-----: |
| width     | number  |  `640`  |
| height    | number  |  `480`  |
| randomize | boolean | `false` |

```js
faker.image.transport(); // http://lorempixel.com/640/480/transport
faker.image.transport(200); // http://lorempixel.com/200/480/transport
faker.image.transport(200, 600); // http://lorempixel.com/200/600/transport
faker.image.transport(200, 600, true); // http://lorempixel.com/200/600/transport?89872
```

## dataUri([width[, height]])

Return random data uri

| Param  | Type   | Default |
| ------ | ------ | :-----: |
| width  | number | `null`  |
| height | number | `null`  |

```js
faker.image.dataUri();
// data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%20%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%20%20%3Ctext%20x%3D%220%22%20y%3D%2220%22%20font-size%3D%2220%22%20text-anchor%3D%22start%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%20%3C%2Fsvg%3E
```
