# express-ensure-content-type

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][build-status-image]][build-status-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[npm-url]:https://npmjs.org/package/@moxy/express-ensure-content-type
[downloads-image]:https://img.shields.io/npm/dm/@moxy/express-ensure-content-type.svg
[npm-image]:https://img.shields.io/npm/v/@moxy/express-ensure-content-type.svg
[build-status-url]:https://github.com/moxystudio/express-ensure-content-type/actions
[build-status-image]:https://img.shields.io/github/workflow/status/moxystudio/express-ensure-content-type/Node%20CI/master
[codecov-url]:https://codecov.io/gh/moxystudio/express-ensure-content-type
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/express-ensure-content-type/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/express-ensure-content-type
[david-dm-image]:https://img.shields.io/david/moxystudio/express-ensure-content-type.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/express-ensure-content-type?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/express-ensure-content-type.svg

Express middleware that ensures requests match the specified content-type.

## Installation

```sh
$ npm install @moxy/express-ensure-content-type
```

## Usage

```js
const express = require('express');
const bodyParser = require('body-parser');
const ensureContentType = require('@moxy/express-ensure-content-type');

const app = express();

app.post(
    '/',
    bodyParser(),
    ensureContentType('application/json'),
    (req, res, next) => {
        console.log(req.body);
    },
);
```

## API

### ensureContentType(contentType, when?)

Creates a middleware that validates a request content-type against `contentType`.

If the validation fails, `next` will be called with an Error created with [`http-errors`](https://www.npmjs.com/package/http-errors).

#### contentType

Type: `string | array`

One or more content-types to match against. It can be:

- A file extension name such as json. This name will be returned if matched.
- A mime type such as application/json.
- A mime type with a wildcard such as */* or */json or application/*. The full mime type will be returned if matched.
- A suffix such as +json. This can be combined with a wildcard such as */vnd+json or application/*+json. The full mime type will be returned if matched.

Please check [`type-is`](https://github.com/jshttp/type-is#typeisismediatype-types) for more information.

### options?

Type: `object`

#### options.when

Type: `string`
Default: `always`

When to validate. Can be set to:

- `always` - Always validate.
- `body-present` - Validate if [body is present](https://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.3) (has [`transfer-encoding` or `content-length` headers)
- `body-not-empty` - Same as `body-present` but skips if `Content-Length` is set to 0.

> ℹ️ Validation is always done when `Content-Type` header is present in the request.

## Tests

Any parameter passed to the `test` command is passed down to Jest.

```sh
$ npm t
$ npm t -- --watch  # To run watch mode
```

## License

Released under the [MIT License](https://opensource.org/licenses/mit-license.php).
