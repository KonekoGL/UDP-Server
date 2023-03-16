module.exports = function (server, options, done) {

    server.io.on('connection', (socket) => {

        socket.on('join', (data) => {
            // Join a specific room
            socket.join(data.roomId);
        });

        socket.on('broadcast', (data) => {
            // Send messages to all room devices
            socket.to(data.roomId).emit('message', data);
        });

        socket.on('message', (data) => {
            // Send messages to individual recipients
            server.io.to(data.recipient).emit('message', data);
        });

        socket.on('ping', (data) => {
            // Ping all room devices
            socket.to(data.roomId).emit('ping', data);
        });

        socket.on('pingreply', (data) => {
            // Reply the ping, specific recipient.
            server.io.to(data.recipient).emit('pingreply', data);
        });
    
    });

    done();
};