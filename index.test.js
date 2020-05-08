'use strict';

const ensureContentType = require('.');

const getError = (next) => {
    expect(next).toHaveBeenCalledTimes(1);

    return next.mock.calls[0][0];
};

it('should validate when there\'s no content-type', () => {
    const middleware = ensureContentType('application/json');
    const next = jest.fn();

    middleware({
        headers: {},
    }, {}, next);

    const error = getError(next);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Invalid content-type, must be one of application/json');
    expect(error.statusCode).toBe(415);
});

it('should validate when there\'s a wrong content-type', () => {
    const middleware = ensureContentType('application/json');
    const next = jest.fn();

    middleware({
        headers: {
            'content-type': 'text/plain',
        },
    }, {}, next);

    const error = getError(next);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Invalid content-type, must be one of application/json');
    expect(error.statusCode).toBe(415);
});

it('should validate when there\'s a wrong content-type (array)', () => {
    const middleware = ensureContentType(['application/json', 'text/json']);
    const next = jest.fn();

    middleware({
        headers: {
            'content-type': 'text/plain',
        },
    }, {}, next);

    const error = getError(next);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Invalid content-type, must be one of application/json, text/json');
    expect(error.statusCode).toBe(415);
});

it('should call next when content-type matches', () => {
    const middleware = ensureContentType('json');
    const next = jest.fn();

    middleware({
        headers: {
            'content-type': 'application/json',
        },
    }, {}, next);

    expect(getError(next)).toBe(undefined);
});

it('should throw if an invalid "when" was passed', () => {
    expect(() => ensureContentType('json', { when: 'foo' })).toThrow('Invalid options.when: "foo"');
});

describe('when body-present', () => {
    it('should validate when transfer-encoding is set', () => {
        const middleware = ensureContentType('application/json', { when: 'body-present' });
        const next = jest.fn();

        middleware({
            headers: {
                'transfer-encoding': 'chunked',
            },
        }, {}, next);

        const error = getError(next);

        expect(error).toBeInstanceOf(Error);
        expect(error.statusCode).toBe(415);
    });

    it('should validate when content-length is set', () => {
        const middleware = ensureContentType('application/json', { when: 'body-present' });
        const next = jest.fn();

        middleware({
            headers: {
                'content-length': '0',
            },
        }, {}, next);

        const error = getError(next);

        expect(error).toBeInstanceOf(Error);
        expect(error.statusCode).toBe(415);
    });

    it('should validate when transfer-encoding and content-length are set', () => {
        const middleware = ensureContentType('application/json', { when: 'body-present' });
        const next = jest.fn();

        middleware({
            headers: {
                'transfer-encoding': 'chunked',
                'content-length': '0',
            },
        }, {}, next);

        const error = getError(next);

        expect(error).toBeInstanceOf(Error);
        expect(error.statusCode).toBe(415);
    });

    it('should not validate if both transfer-encoding and content-length are not set', () => {
        const middleware = ensureContentType('application/json', { when: 'body-present' });
        const next = jest.fn();

        middleware({
            headers: {
                'content-type': 'text/plain',
            },
        }, {}, next);

        expect(getError(next)).toBe(undefined);
    });
});

describe('when body-not-empty', () => {
    it('should validate when transfer-encoding is set', () => {
        const middleware = ensureContentType('application/json', { when: 'body-not-empty' });
        const next = jest.fn();

        middleware({
            headers: {
                'content-length': '1',
            },
        }, {}, next);

        const error = getError(next);

        expect(error).toBeInstanceOf(Error);
        expect(error.statusCode).toBe(415);
    });

    it('should validate when content-length > 1', () => {
        const middleware = ensureContentType('application/json', { when: 'body-not-empty' });
        const next = jest.fn();

        middleware({
            headers: {
                'content-length': '1',
            },
        }, {}, next);

        const error = getError(next);

        expect(error).toBeInstanceOf(Error);
        expect(error.statusCode).toBe(415);
    });

    it('should validate when transfer-encoding is set and content-length = 0', () => {
        const middleware = ensureContentType('application/json', { when: 'body-not-empty' });
        const next = jest.fn();

        middleware({
            headers: {
                'transfer-encoding': 'chunked',
                'content-length': '0',
            },
        }, {}, next);

        const error = getError(next);

        expect(error).toBeInstanceOf(Error);
        expect(error.statusCode).toBe(415);
    });

    it('should not validate when both transfer-encoding and content-length are not set', () => {
        const middleware = ensureContentType('application/json', { when: 'body-not-empty' });
        const next = jest.fn();

        middleware({
            headers: {},
        }, {}, next);

        expect(getError(next)).toBe(undefined);
    });

    it('should not validate when transfer-encoding is not set and content-length = 0', () => {
        const middleware = ensureContentType('application/json', { when: 'body-not-empty' });
        const next = jest.fn();

        middleware({
            headers: {
                'content-length': '0',
            },
        }, {}, next);

        expect(getError(next)).toBe(undefined);
    });
});
