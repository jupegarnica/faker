# Faker API REST

**An API REST to fake any other one.**

Goals:

- Be responded with an specific body, status or headers.
- Get random fake data using [faker.js](https://fakerjs.dev/)
- Get delayed response.

**Live at: https://faker.deno.dev/**

**Source at: https://github.com/jupegarnica/faker**

## Usage

Make an HTTP request with search params like status, body, header or delay to
get the response you want.

Example:

```http
GET https://faker.deno.dev/?body=hola&delay=1000&status=400

HTTP/1.1 400 Bad Request
content-type: text/plain
content-length: 4

hola
```

**Try yourself: https://faker.deno.dev?body=hola&status=569**

### Body

Specify a search body param to retrieve a response with that body.

```http
GET https://faker.deno.dev/?body=hola


HTTP/1.1 200 OK
content-type: text/plain
content-length: 4

hola
```

### Response Status

Specify a search status param get back that code status. The status must be
inside the range 200 to 599.

```http
GET https://faker.deno.dev/?status=301


HTTP/1.1 301 Moved Permanently
content-type: text/plain
content-length: 0
```

### Headers

Specify a search header param as json string to get them back.

```http
GET https://faker.deno.dev/?headers={"x-hello":"world"}


HTTP/1.1 200 OK
x-hello: world
content-length: 0
```

### Delay

Specify a search delay param in milliseconds in order to delay the response.

```http
GET https://faker.deno.dev/?delay=1000
```

## /pong

Replay with same body and header as the request

```http
POST https://faker.deno.dev/pong
          ?status=201
          &delay=100
          &body=willBeIgnored
          &headers={"x-hola":"mundo"}
X-hello: world
content-type: text/plain

{"a":1}

HTTP/1.1 201 Created
X-hello: world
x-hola: mundo
content-type: text/plain

{"a":1}
```

## Faker API

Any other pathname will be used to call [faker.js](https://fakerjs.dev/). A path
like `/name/firstName` will call `faker.name.firstName()`;

### Basic

```http
GET https://faker.deno.dev/name/firstName

HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

{
  "data": "Octavio",
  "docs": "https://fakerjs.dev/api/name.md#firstName",
  "status": 200,
  "language": "es"
}
```

### Language

Default language is `es`, but can be specified with the `accept-language`
header.

To know the languages includes checkout the docs at
[/docs/localization.md](/docs/localization.md#locales-included)

```http
GET https://faker.deno.dev/name/firstName
accept-language: en

HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

{
  "data": "Chesley",
  "docs": "https://fakerjs.dev/api/name.md#firstName",
  "status": 200,
  "language": "en"

}
```

### Passing arguments

Once a path found a method on faker the rest of the path will be used as
arguments.

Using path `phone/phoneNumber/###-###-####` will call
`faker.phone.phoneNumber('###-###-####')`

```http
GET https://faker.deno.dev/phone/phoneNumber/###-###-####


HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

{
  "data": "956 687 564",
  "docs": "https://fakerjs.dev/api/phone.html#phoneNumber",
  "status": 200,
  "language": "es"
}
```

It can recibe any type of argument, like object, array, string, number.

> But keep in mind that objects and arrays must be passed as json string.

```http
GET https://faker.deno.dev/datatype/number/{"max":3,"min":1}
```

If needed use `encodeURIComponent` to pass and argument with special characters.

### Faker docs

Every call to any faker namespace will return a url to the faker docs.

For example:

https://fakerjs.dev/api/git.html
