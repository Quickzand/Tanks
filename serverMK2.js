const httpServer = require("http").createServer();

const port = 6969


var io = require('socket.io')(httpServer, {
    cors: {
        origin: "*"
    },
});

let rooms = [];
let players = [];
let map = [];
let alivePlayers = [];

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
        this.socketId = socket.id;
    }
}


// Returns a player in the player array with the given id
function findPlayerById(id) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            return players[i];
        }
    }
    return null;
}

// Removes a player from the player array with the given socket
function removePlayer(socket) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].socketId === socket.id) {
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
        tmpPlayer = new player(data.id, data.name, socket, data.playerNum, data.x, data.y, data.rotation, data.color);
        players.push(tmpPlayer);
        var tempPlayers = []
        for (i in players) {
            tempPlayers.push({
                id: players[i].id,
                name: players[i].name,
                color: players[i].color,
                x: players[i].x,
                y: players[i].y,
                rotation: players[i].rotation
            })
        }
        io.to(socket.id).emit("setPlayerList", tempPlayers);
        socket.broadcast.emit("newPlayer", {
            id: data.id,
            name: data.name,
            playerNum: data.playerNum,
            x: data.x,
            y: data.y,
            rotation: data.rotation,
            color: data.color
        });
        console.log("Added player ", tmpPlayer.name)
    });

    // Runs when a player disconnects
    socket.on("disconnect", function (data) {
        removePlayer(socket);
        players.filter(player => player.id !== socket.id)
        console.log("Player disconnected")
        console.log(players.length)
        io.emit("playerRemove", {
            id: data.id
        });
    });


    socket.on("updateTankArray", function (data) {
        socket.broadcast.emit("tanksUpdate", data);
    })

    // Receives an update from the client to update the player color and brodcast it to all other players
    socket.on("updatePlayerColor", function (data) {
        let player = findPlayerById(data.id);
        player.color = data.color;
        socket.broadcast.emit("updatePlayerColor", {
            id: data.id,
            color: data.color
        });
    });

    // Receives an update from the client to update the map and broadcast it to all other players
    socket.on("sendMap", function (data) {
        map = data;
        socket.broadcast.emit("updateMap", data);
    });

    // Receives an update from the client to start the round and broadcast it to all other players
    socket.on("startRound", function (data) {
        socket.broadcast.emit("startRound", data);
    });

    // Receives an update from the client to update the player name and brodcast it to all other players
    socket.on("updatePlayerName", function (data) {
        let player = findPlayerById(data.id);
        player.name = data.name;
        socket.broadcast.emit("updatePlayerName", {
            id: data.id,
            name: data.name
        });
    })

    // Receives a request from the client to become host and removes current host and broadcasts it to all other players
    socket.on("requestHostship", function (data) {
        for (i in players) {
            players[i].isHost = false;
        }
        let player = findPlayerById(data.id);
        player.isHost = true;
        console.log("Giving hostship to ", player.name);
        io.emit("updateHost", {
            id: data.id
        });
    })



});


function updatePlayerPosition(socket, player) {

    socket.broadcast.emit("updatePlayerPosition", {
        id: player.id,
        name: player.name,
        color: player.color,
        x: player.x,
        y: player.y,
        rotation: player.rotation
    });
}


// Starts an HTTP server on the given port, this is what actually starts the server
httpServer.listen(port, () => console.log("listening on port " + port));