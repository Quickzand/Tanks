 const host = window.location.host;
 const socket = io(window.location.host + ":6969", {
     secure: true
 });
 let connected = false;
 let players = [];
 let playerList = []
 let currentPlayer = {}



 function findPlayerById(id) {
     for (let i = 0; i < playerList.length; i++) {
         if (playerList[i].id == id) {
             return playerList[i];
         }
     }
 }


 socket.on("connect", function () {
     console.log("Connected to game");
     // Sends the player data to be put into the game server
     tempId = makeid(8)
     socket.emit("connectToGame", {
         id: tempId,
         "name": "Guest",
         "playerNum": "1",
         "x": 5,
         "y": 5,
         "rotation": 0,
         "color": "red"
     });
     // Creates a tank for the player that is controllable 
     currentPlayer = new Tank(tempId, 10, 10, 0, "red", "Guest")
     playerTank = currentPlayer
     playerList.push(currentPlayer)
     // Sets connected to true and allows for sockets to send data
     connected = true;
 });

 socket.on("setPlayerList", function (data) {
     console.log("Player list received")
     playerList = data.map(function (player) {
         return new Tank(player.id, player.x, player.y, player.rotation, player.color, player.name)
     });
 })


 socket.on("newPlayer", function (data) {
     console.log("New player connected");
     // Adds the new player to the game
     newPlayer = new Tank(data.id, data.x, data.y, data.rotation, data.color, data.name);
     playerList.push(newPlayer);
 })

 socket.on("playerRemove", function (data) {
     console.log("Removing player ", data.id);
     // Removes the player from the game
     playerList.splice(playerList.indexOf(findPlayerById(data.id)), 1);
 })


 socket.on("tanksUpdate", function (data) {
     console.log(data)
     // Updates the player position
     playerList = data.tankArray.map(function (player) {
         return new Tank(player.id, player.x, player.y, player.rotation, player.color, player.name)
     });
     tankArr = playerList;
 })

 // Updates name of tank sent by server
 socket.on("updatePlayerColor", function (data) {
     tempPlayer = findPlayerById(data.id);
     tempPlayer.setColor(data.color);
 })

 // Updates name of player sent by server
 socket.on("updatePlayerName", function (data) {
     tempPlayer = findPlayerById(data.id);
     tempPlayer.nickname = data.name;
 })

 // Updates the host of the server 
 socket.on("updateHost", function (data) {
     console.log("Updating host...");
     console.log(data)
     if (data.id == currentPlayer.id) {
         currentPlayer.isHost = true;
     } else {
         for (i in playerList) {
             playerList[i].isHost = false;
         }
         player = findPlayerById(data.id);
         player.isHost = true;
     }
 })


 // Updates the map by updating wallArray
 socket.on("updateMap", function (data) {
     console.log("Updating map...");
     wallArray = data;
 })

 // Takes in a request to start the round and starts it
 socket.on("startRound", function (data) {
     console.log("Starting round...");
     // Starts the round
     gameState = "playing";
 })




 // Sends a request to the server to become host
 function requestHostship() {
     socket.emit("requestHostship", {
         "id": currentPlayer.id
     });
 }




 // Sends a command to the server to update the player color
 function updatePlayerColor(color) {
     console.log("Changing color...");
     console.log(color);
     currentPlayer.setColor(color);
     socket.emit("updatePlayerColor", {
         id: currentPlayer.id,
         "color": this.value
     });
 }


 // Sends a command to the server to update the player nickname
 function updatePlayerNickname(nickname) {
     console.log("Changing nickname...");
     currentPlayer.nickname = nickname;
     socket.emit("updatePlayerName", {
         "id": currentPlayer.id,
         "name": nickname
     });
 }

 // Sends the updated tank array to all other clients
 function sendUpdatedTankArray() {
     console.log("Sending updated tank array...");
     socket.emit("updateTankArray", {
         "id": currentPlayer.id,
         "tankArray": playerList
     });
 }

 // Sends the map to other clients
 function sendMap() {
     console.log("Sending map...");
     socket.emit("sendMap", wallArray);
 }

 function startRound() {
     console.log("Starting round...");
     socket.emit("startRound", {
         "id": currentPlayer.id
     });
 }

 // Updates the player's nickname when the input is changed
 $("#nicknameInput").change(function () {
     updatePlayerNickname(this.value)
 });




 // Updates player color when value is selected
 $('input[type=radio][name=colorSelection]').change(function () {
     updatePlayerColor(this.value)
 });


 // Makes a random ID based on the character string
 function makeid(length) {
     var result = '';
     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for (var i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() *
             charactersLength));
     }
     return result;
 }