const express = require('express');
const http = require('http');
const WebSocket = require('ws')
const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({
    server
})
wss.on("connection", function connection(ws) {
    console.log(ws)
    ws.on("message", function incoming(data) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});
server.listen(port, function () {
    console.log('Server listening on port ' + port);
});