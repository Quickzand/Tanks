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
let map = [];

class player {
    constructor(id, name, socket, playerNum, x, y, rotation, color) {
        this.id = id;
        this.name = name;
        this.socket = socket;
        this.playerNum = playerNum;
        this.room = null;
        this.isReady = false;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.isAlive = true;
        this.isHost = false;
        this.color = color;
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
            isAlive: players[i].isAlive,
            color: players[i].color
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
        tmpPlayer = new player(socket.id, data.name, socket, data.playerNum, data.x, data.y, data.rotation, data.color);
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

    socket.on("setMap", function (data) {
        map = data;
        console.log("Map updated")
        for (i in players) {
            players[i].isAlive = true;
        }
        updatePlayerList();
        io.emit("updateMap", map);
    });

    socket.on("becomeHost", function () {
        for (var i in players) {
            if (players[i].isHost) {
                players[i].socket.emit("removeHost");
            }
            players[i].isHost = false;
        }
        let player = players.find(function (player) {
            return player.id === socket.id;
        });
        player.isHost = true;
        console.log("Transferred hostship")
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
    socket.on("playerIsAlive", function (data) {
        let player = players.find(function (player) {
            return player.playerNum == data.playerNum;
        });
        player ? player.isAlive = data.isAlive : console.log("Could not find player");

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

    // Socket command to change the display name of the player
    socket.on("updatePlayerName", function (data) {
        let player = players.find(function (player) {
            return player.id === socket.id;
        });
        player.name = data.name;
        updatePlayerList()
    });

    // Socket command run to update player position data
    socket.on("playerMove", function (data) {
        let player = players.find(function (player) {
            return player.id === socket.id;
        });

        player.x = data.x;
        player.y = data.y;
        player.rotation = data.rotation;
        updatePlayerList()

    });
});


// Starts an HTTP server on the given port, this is what actually starts the server
httpServer.listen(port, () => console.log("listening on port " + port));