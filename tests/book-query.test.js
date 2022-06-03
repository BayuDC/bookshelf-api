const lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const server = require('../core/server')();
const { before, after, describe, it } = lab;
const books = require('../data/books');

before(async () => {
    await server.initialize();
    books.push({
        id: 'Qbax5Oy7L8WKf74l',
        name: 'Buku A',
        year: 2010,
        author: 'John Doe',
        summary: 'Lorem ipsum dolor sit amet',
        publisher: 'Dicoding Indonesia',
        pageCount: 100,
        readPage: 100,
        finished: true,
        reading: false,
        insertedAt: '2021-03-04T09:11:44.598Z',
        updatedAt: '2021-03-04T09:11:44.598Z',
    });
    books.push({
        id: 'Qbax5Oy7L8WKf75l',
        name: 'Bukan Buku',
        year: 2010,
        author: 'John Doe',
        summary: 'Lorem ipsum dolor sit amet',
        publisher: 'Dicoding Indonesia',
        pageCount: 100,
        readPage: 25,
        finished: false,
        reading: true,
        insertedAt: '2021-03-04T09:11:44.598Z',
        updatedAt: '2021-03-04T09:11:44.598Z',
    });
    books.push({
        id: 'Qbax5Oy7L8WKf76l',
        name: 'What is This',
        year: 2010,
        author: 'John Doe',
        summary: 'Lorem ipsum dolor sit amet',
        publisher: 'Dicoding Indonesia',
        pageCount: 100,
        readPage: 25,
        finished: false,
        reading: true,
        insertedAt: '2021-03-04T09:11:44.598Z',
        updatedAt: '2021-03-04T09:11:44.598Z',
    });
});
after(async () => await server.stop());

describe('GET /books?', () => {
    it('search books by name', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/books?name=buku',
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.data.books).to.include({
            id: 'Qbax5Oy7L8WKf74l',
            name: 'Buku A',
            publisher: 'Dicoding Indonesia',
        });
        expect(res.result.data.books).to.include({
            id: 'Qbax5Oy7L8WKf75l',
            name: 'Bukan Buku',
            publisher: 'Dicoding Indonesia',
        });
        expect(res.result.data.books).to.not.include({
            id: 'Qbax5Oy7L8WKf75l',
            name: 'What is This',
            publisher: 'Dicoding Indonesia',
        });
    });
    it('filter books by reading status', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/books?reading=1',
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.data.books).to.not.include({
            id: 'Qbax5Oy7L8WKf74l',
            name: 'Buku A',
            publisher: 'Dicoding Indonesia',
        });
        expect(res.result.data.books).to.include({
            id: 'Qbax5Oy7L8WKf75l',
            name: 'Bukan Buku',
            publisher: 'Dicoding Indonesia',
        });
        expect(res.result.data.books).to.include({
            id: 'Qbax5Oy7L8WKf76l',
            name: 'What is This',
            publisher: 'Dicoding Indonesia',
        });
    });
    it('filter books by finished status', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/books?finished=1',
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.data.books).to.include({
            id: 'Qbax5Oy7L8WKf74l',
            name: 'Buku A',
            publisher: 'Dicoding Indonesia',
        });
        expect(res.result.data.books).to.not.include({
            id: 'Qbax5Oy7L8WKf75l',
            name: 'Bukan Buku',
            publisher: 'Dicoding Indonesia',
        });
        expect(res.result.data.books).to.not.include({
            id: 'Qbax5Oy7L8WKf76l',
            name: 'What is This',
            publisher: 'Dicoding Indonesia',
        });
    });
});

module.exports = { lab };
