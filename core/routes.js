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
];
