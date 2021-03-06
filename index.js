const createServer = require('./core/server');

const port = process.env.PORT || 5000;
const server = createServer('localhost', port);

server
    .start()
    .then(() => {
        console.log('Server running at', server.info.uri);
    })
    .catch(err => {
        console.log(err);
    });
