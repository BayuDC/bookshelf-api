const Hapi = require('@hapi/hapi');
const routes = require('./routes');

/**
 *
 * @param {int} port
 * @param {string} host
 * @returns {import('@hapi/hapi').Server}
 */
const createServer = (host, port) => {
    const server = Hapi.server({
        host,
        port,
    });
    server.route(routes);

    return server;
};

module.exports = createServer;
