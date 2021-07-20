const httpServer = require("http").createServer();

const port = 6969


var io = require('socket.io')(httpServer, {
    cors: {
        origin: "*"
    },
});
// io.listen(6969);
let rooms = [];
let players = [];


class player {
    constructor(id, name, socket, playerNum) {
        this.id = id;
        this.name = name;
        this.socket = socket;
        this.playerNum = playerNum;
        this.room = null;
        this.isReady = false;
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
    }
}



function updatePlayerList() {
    let playerList = [];
    for (let i = 0; i < players.length; i++) {
        playerList.push({
            id: players[i].id,
            name: players[i].name,
            playerNum: players[i].playerNum,
            x: players[i].x,
            y: players[i].y,
            rotation: players[i].rotation,
        });
    }
    io.emit('playerList', playerList);
}


function updatePlayerName(socketId, name) {
    for (var i = 0; i < players.length; i++) {

        if (players[i].id === socketId) {

            players[i].name = name;
        }
    }
}

function removePlayer(socketId) {
    for (var i = 0; i < players.length; i++) {

        if (players[i].id === socketId) {

            players.splice(i, 1);
        }
    }
}


io.on('connection', function (socket) {
    console.log("CONNECTION WITH " + socket.id);
    socket.on("joinRoom", function (roomCode) {
        joinRoom(roomCode)
    });

    socket.on("connectToGame", function (data) {
        tmpPlayer = new player(socket.id, data.name, socket, data.playerNum);
        players.push(tmpPlayer);
        updatePlayerList()
        console.log("Added player ", tmpPlayer.name)
    });
    socket.on("disconnect", function () {
        removePlayer(socket.id);
        players.filter(player => player.id !== socket.id)
        console.log("Player disconnected")
        updatePlayerList()
    });
    socket.on("move", function (data) {
        let player = players.find(function (player) {
            return player.id === socket.id;
        });
        player.x = data.x;
        player.y = data.y;
        player.rotation = data.rotation;
        updatePlayerList()
    });
    socket.on("ready", function (data) {
        let player = players.find(function (player) {
            return player.id === socket.id;
        });
        player.isReady = true;
        updatePlayerList()
    });
    socket.on("unready", function (data) {
        let player = players.find(function (player) {
            return player.id === socket.id;
        });
        player.isReady = false;
        updatePlayerList()
    });
    socket.on("updatePlayerNumber", function (data) {
        let player = players.find(function (player) {
            return player.id === socket.id;
        });
        player.playerNum = data.playerNum;
        updatePlayerList()
    });

    socket.on("updatePlayerName", function (data) {
        let player = players.find(function (player) {
            return player.id === socket.id;
        });
        player.name = data.name;
        updatePlayerList()
    });
});

httpServer.listen(port, () => console.log("listening on port " + port));