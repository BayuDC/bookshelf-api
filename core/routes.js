const { storeBook, indexBook, showBook, updateBook, destroyBook } = require('./handler');

module.exports = [
    {
        method: 'get',
        path: '/',
        /**
         * @param {import('@hapi/hapi').Request} request
         * @param {import('@hapi/hapi').ResponseToolkit} h
         */
        handler: (request, h) => {
            return 'Hello World!';
        },
    },
    {
        method: 'post',
        path: '/books',
        handler: storeBook,
    },
    {
        method: 'get',
        path: '/books',
        handler: indexBook,
    },
    {
        method: 'get',
        path: '/books/{id}',
        handler: showBook,
    },
    {
        method: 'put',
        path: '/books/{id}',
        handler: updateBook,
    },
    {
        method: 'delete',
        path: '/books/{id}',
        handler: destroyBook,
    },
];
