const lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const server = require('../core/server')();
const { before, after, describe, it } = lab;

before(async () => await server.initialize());
after(async () => await server.stop());

describe('GET /', () => {
    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/',
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal('Hello World!');
    });
});

module.exports = { lab };
