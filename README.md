# Faker API REST

**An API REST to fake any other one.**

Goals:

- Be responded with an specific body, status or headers.
- Get random fake data using [faker.js](https://www.npmjs.com/package/faker)
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

### body

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

Any other pathname will be used to call faker.js. A path like `/name/firstName`
will call `faker.name.firstName()`;

### Basic

```http
GET https://faker.deno.dev/name/firstName

HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

{
  "data": "Octavio",
  "docs": "https://faker.deno.dev/docs/name.md#firstName",
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
  "docs": "https://faker.deno.dev/docs/name.md#firstName",
  "status": 200,
  "language": "en"

}
```

### Passing arguments

```http
GET https://localhost:8000/phone.phoneNumber/%22(###)%20###-####%22
accept-language: en

HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

{
  "data": "Chesley",
  "docs": "https://faker.deno.dev/docs/name.md#firstName",
  "status": 200,
  "language": "en"

}
```

### Faker docs
