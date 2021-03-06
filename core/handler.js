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
        const { name, reading, finished } = request.query;
        let booksFiltered = books;

        if (name) booksFiltered = booksFiltered.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
        if (reading === '1') booksFiltered = booksFiltered.filter(book => book.reading);
        if (reading === '0') booksFiltered = booksFiltered.filter(book => !book.reading);
        if (finished === '1') booksFiltered = booksFiltered.filter(book => book.finished);
        if (finished === '0') booksFiltered = booksFiltered.filter(book => !book.finished);

        return h
            .response({
                status: 'success',
                data: {
                    books: booksFiltered.map(book => ({
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
    updateBook(request, h) {
        try {
            const { id } = request.params;
            const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload || {};
            const bookIndex = books.findIndex(book => book.id == id);
            const book = books[bookIndex];
            const updatedAt = new Date().toISOString();

            if (!book) {
                return h
                    .response({
                        message: 'Gagal memperbarui buku. Id tidak ditemukan',
                        status: 'fail',
                    })
                    .code(404);
            }
            if (!name) {
                return h
                    .response({
                        message: 'Gagal memperbarui buku. Mohon isi nama buku',
                        status: 'fail',
                    })
                    .code(400);
            }

            if (readPage > pageCount) {
                return h
                    .response({
                        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
                        status: 'fail',
                    })
                    .code(400);
            }

            books[bookIndex] = {
                ...book,
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
                updatedAt,
            };

            return h
                .response({
                    message: 'Buku berhasil diperbarui',
                    status: 'success',
                })
                .code(200);
        } catch (err) {
            return h
                .response({
                    status: 'error',
                    message: 'Buku gagal diperbarui',
                })
                .code(500);
        }
    },
    /**
     * @param {import('@hapi/hapi').Request} request
     * @param {import('@hapi/hapi').ResponseToolkit} h
     */
    destroyBook(request, h) {
        try {
            const { id } = request.params;
            const bookIndex = books.findIndex(book => book.id == id);
            const book = books[bookIndex];

            if (!book) {
                return h
                    .response({
                        message: 'Buku gagal dihapus. Id tidak ditemukan',
                        status: 'fail',
                    })
                    .code(404);
            }

            books.splice(bookIndex, 1);

            return h
                .response({
                    message: 'Buku berhasil dihapus',
                    status: 'success',
                })
                .code(200);
        } catch (err) {
            return h
                .response({
                    status: 'error',
                    message: 'Buku gagal dihapus',
                })
                .code(500);
        }
    },
};
