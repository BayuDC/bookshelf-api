const lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const server = require('../core/server')();
const { before, after, describe, it } = lab;

before(async () => await server.initialize());
after(async () => await server.stop());

let bookId;

describe('POST /books', () => {
    it('respond with 400 if no name is provided', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/books',
        });

        expect(res.statusCode).to.equal(400);
        expect(res.result).to.equal({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
    });
    it('respond with 400 if no readPage greater than pageCount', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/books',
            payload: {
                name: 'test',
                pageCount: 10,
                readPage: 20,
            },
        });

        expect(res.statusCode).to.equal(400);
        expect(res.result).to.equal({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
    });
    it('respond with 201 if success', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/books',
            payload: {
                name: 'Buku A',
                year: 2010,
                author: 'John Doe',
                summary: 'Lorem ipsum dolor sit amet',
                publisher: 'Dicoding Indonesia',
                pageCount: 100,
                readPage: 25,
                reading: false,
            },
        });

        expect(res.statusCode).to.equal(201);
        expect(res.result.status).to.equal('success');
        expect(res.result.message).to.equal('Buku berhasil ditambahkan');
        expect(res.result.data).to.include('bookId');

        bookId = res.result.data.bookId;
    });
});
describe('GET /books', () => {
    it('respond with 200 if success', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/books',
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result).to.includes(['status', 'data']);
        expect(res.result.status).to.equal('success');
        expect(res.result.data).to.include('books');
        expect(res.result.data.books).to.be.an.array();
        expect(res.result.data.books[0]).to.only.includes(['id', 'name', 'publisher']);
    });
});
describe('GET /books/{bookId}', () => {
    it.skip('respond with 200 if success', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/books/' + bookId,
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.status).to.equal('success');
        expect(res.result.data).to.include('book');
        expect(res.result.data.book).to.be.an.object();
        expect(res.result.data.book).to.includes([
            'id',
            'name',
            'year',
            'author',
            'summary',
            'publisher',
            'pageCount',
            'readPage',
            'finished',
            'reading',
            'insertedAt',
            'updatedAt',
        ]);
    });
    it.skip('respond with 404 if not found', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/books/' + 'smashmykeyboard',
        });

        expect(res.statusCode).to.be(404);
        expect(res.result).to.equal({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
    });
});
describe('PUT /books/{bookId}', () => {
    it.skip('respond with 400 if no name is provided', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/books/' + bookId,
        });

        expect(res.statusCode).to.be(400);
        expect(res.result).to.equal({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
    });
    it.skip('respond with 400 if no readPage greater than pageCount', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/books',
            payload: {
                name: 'test',
                pageCount: 10,
                readPage: 20,
            },
        });

        expect(res.statusCode).to.be(400);
        expect(res.result).to.equal({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
    });
    it.skip('respond with 404 if not found', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/books/' + 'smashmykeyboard',
        });

        expect(res.statusCode).to.be(404);
        expect(res.result).to.equal({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
    });
    it.skip('respond with 200 if success', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/books/' + bookId,
            payload: {
                name: 'Buku A Updated',
                year: 2011,
            },
        });

        expect(res.statusCode).to.be(200);
        expect(res.result).to.equal({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
    });
});
describe('DELETE /books/{bookId}', () => {
    it.skip('respond with 404 if not found', async () => {
        const res = await server.inject({
            method: 'DELETE',
            url: '/books/' + 'smashmykeyboard',
        });

        expect(res.statusCode).to.be(404);
        expect(res.result).to.equal({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
    });
    it.skip('respond with 200 if success', async () => {
        const res = await server.inject({
            method: 'DELETE',
            url: '/books/' + bookId,
        });

        expect(res.statusCode).to.be(200);
        expect(res.result).to.equal({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
    });
});

module.exports = { lab };
