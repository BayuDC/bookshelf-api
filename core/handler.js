const { nanoid } = require('nanoid');
const books = require('../data/books');

module.exports = {
    /**
     * @param {import('@hapi/hapi').Request} request
     * @param {import('@hapi/hapi').ResponseToolkit} h
     */
    storeBook(request, h) {
        try {
            const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload || {};
            const id = nanoid(16);
            const insertedAt = new Date().toISOString();
            const updatedAt = insertedAt;
            const finished = pageCount == readPage;

            if (!name) {
                return h
                    .response({
                        status: 'fail',
                        message: 'Gagal menambahkan buku. Mohon isi nama buku',
                    })
                    .code(400);
            }
            if (readPage > pageCount) {
                return h
                    .response({
                        status: 'fail',
                        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
                    })
                    .code(400);
            }

            books.push({
                id,
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading,
                insertedAt,
                updatedAt,
            });

            return h
                .response({
                    status: 'success',
                    message: 'Buku berhasil ditambahkan',
                    data: {
                        bookId: id,
                    },
                })
                .code(201);
        } catch (err) {
            return h
                .response({
                    status: 'error',
                    message: 'Buku gagal ditambahkan',
                })
                .code(500);
        }
    },
    /**
     * @param {import('@hapi/hapi').Request} request
     * @param {import('@hapi/hapi').ResponseToolkit} h
     */
    indexBook(request, h) {
        return h
            .response({
                status: 'success',
                data: {
                    books: books.map(book => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            })
            .code(200);
    },
    /**
     * @param {import('@hapi/hapi').Request} request
     * @param {import('@hapi/hapi').ResponseToolkit} h
     */
    showBook(request, h) {
        const { id } = request.params;
        const book = books.find(book => book.id == id);

        if (!book) {
            return h
                .response({
                    message: 'Buku tidak ditemukan',
                    status: 'fail',
                })
                .code(404);
        }

        return h
            .response({
                status: 'success',
                data: {
                    book,
                },
            })
            .code(200);
    },
    /**
     * @param {import('@hapi/hapi').Request} request
     * @param {import('@hapi/hapi').ResponseToolkit} h
     */
    updateBook(request, h) {},
    /**
     * @param {import('@hapi/hapi').Request} request
     * @param {import('@hapi/hapi').ResponseToolkit} h
     */
    destroyBook(request, h) {},
};
