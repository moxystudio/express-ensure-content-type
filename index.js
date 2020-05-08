'use strict';

const typeis = require('type-is');
const { UnsupportedMediaType } = require('http-errors');

const always = () => true;

const bodyPresent = (req) => req.headers['transfer-encoding'] !== undefined ||
                             !isNaN(req.headers['content-length']);

const bodyNotEmpty = (req) => req.headers['transfer-encoding'] !== undefined ||
                              Number(req.headers['content-length']) > 0;

const ensureContentType = (contentType, options) => {
    if (!Array.isArray(contentType)) {
        contentType = [contentType];
    }

    options = {
        when: 'always',
        ...options,
    };

    let shouldValidate;

    switch (options.when) {
    case 'always':
        shouldValidate = always;
        break;
    case 'body-present':
        shouldValidate = bodyPresent;
        break;
    case 'body-not-empty':
        shouldValidate = bodyNotEmpty;
        break;
    default:
        throw new TypeError(`Invalid options.when: "${options.when}"`);
    }

    return (req, res, next) => {
        if (!shouldValidate(req)) {
            return next();
        }

        const valid = typeis.is(req.headers['content-type'], contentType);

        if (!valid) {
            return next(new UnsupportedMediaType(`Invalid content-type, must be one of ${contentType.join(', ')}`));
        }

        next();
    };
};

module.exports = ensureContentType;
