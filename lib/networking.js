/**
 * networking.js
 * 
 */
const net = require('net');
const { networkInterfaces } = require('os');
const logger = require('./logger');

const port = process.env.PORT || 5123;

const seeds = [
    '0.0.0.0:5123',
];

/**
 * 
 * @returns 
 */
const getHostIP = () => {
    const interfaces = networkInterfaces();
    const addresses = [];

    for (const iface of Object.keys(interfaces)) {
        for (const { address, family, internal } of iface) {
            if (family === 'IPv4' && !internal) {
                addresses.push(address);
            }
        }
    }

    // Assuming there is at least one non-internal IPv4 address
    return addresses[0];
};

/**
 * 
 * @param {*} data 
 */
const parseIncommingData = (data) => {
    logger.debug(`Incomming data: ${JSON.parse(data)}`);
};

/**
 * 
 * @param {*} type 
 * @param {*} data 
 */
const broadcast = (type, data) => {
    // Add logic here to loop through all connected clients and send a stringified object indicating a message type and data object.
};

/**
 * 
 * @param {*} peer 
 */
const connectToPeer = (peer) => {
    logger.debug(`Connecting to: ${peer}`);
    const [ peer_host, peer_port ] = peer.split(':');
    const socket = net.connect(peer_port, peer_host, () => {
        logger.debug(`Connected to: ${peer}`);

        // Add logic here to remember the peers we're connected to, store in peers file etc..
    });

    socket.on('data', parseIncommingData);

    socket.on('error', (error) => {
        logger.error(`Error connecting to ${peer}: ${error}`);
        socket.destroy();
    });
};

/**
 * 
 */
const server = net.createServer((socket) => {
    socket.on('data', parseIncommingData);
    socket.on('error', (error) => {
        logger.error(`Error with client connection: ${error}`);
        socket.destroy();
    })
});

server.on('error', (error) => {
    logger.error(`Server error: ${error}`);
});

server.listen(port, () => {
    logger.info(`Server started on port ${port}`);
});

// We should also add some logic to log if a peer is connected, and count X amount of retries for reconnects before stoping reconnects.
// Also on disconnect try to reconnect X amount of times max.
[...seeds].forEach(connectToPeer);

module.exports = {
    server
};