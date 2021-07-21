 const host = window.location.host;
 const socket = io(window.location.host + ":6969", {
     secure: true
 });
 let connected = false;
 let currentPlayer = {
     x: 0,
     y: 0,
     rotation: 0,
 }
 let playerList = []
 socket.on("connect", function (data) {
     console.log("Connected to game");
     // Sends the player data to be put into the game server
     socket.emit("connectToGame", {
         "name": "Guest",
         "playerNum": "1",
         "x": currentPlayer.x,
         "y": currentPlayer.y,
         "rotation": currentPlayer.rotation,
         "color": "red"
     });
     // Creates a tank for the player that is controllable 
     currentPlayer.tank = new Tank(socket.id, 10, 10, 0, "red", "Guest")
     playerTank = currentPlayer.tank
     aliveTankArr.push(playerTank);
     // Sets connected to true and allows for sockets to send data
     connected = true;
 });

 socket.on("removeHost", function () {
     console.log("Stepping down as host...");
     currentPlayer.isHost = false;
 });


 socket.on("updateAliveTankArr", function (data) {
     aliveTankArr = data;
 })


 socket.on("startRound", function () {
     tankArr = []
     for (i in playerList) {
         tankArr.push(new Tank(playerList[i].id, playerList[i].x, playerList[i].y, playerList[i].rotation, playerList[i].color, playerList[i].name));
     }
     aliveTankArr = tankArr;
 })


 socket.on("playerList", (data) => {
     playerList = data;
     updateLocalPlayerPositions(data);
 });

 socket.on("updateMap", (data) => {
     updateMap(data);
 });

 socket.on("disconnect", function (data) {
     console.log("Disconnected from game");
     connected = false;
 });




 function becomeHost() {
     socket.emit("becomeHost")
     currentPlayer.isHost = true;
 }

 function updatePlayerPosData(x, y, rotation) {
     if (connected) {
         socket.emit("playerMove", {
             "x": x,
             "y": y,
             "rotation": rotation
         });
     }
 }

 function startRound() {
     socket.emit("requestStartRound");
 }


 function setPlayerIsAlive(playerNum, isAlive) {
     if (connected) {
         socket.emit("playerIsAlive", {
             "playerNum": playerNum,
             "isAlive": isAlive
         });
     }
 }

 $('input[type=radio][name=colorSelection]').change(function () {
     console.log("Changing color...")
     currentPlayer.color = this.value;
     currentPlayer.tank.setColor(this.value);
     console.log(currentPlayer.tank.color)
     socket.emit("updatePlayerColor", {
         "color": this.value
     });
 });


 $("#nicknameInput").change(function () {
     currentPlayer.nickname = this.value;
     currentPlayer.tank.nickname = this.value;
     socket.emit("updatePlayerName", {
         "name": this.value
     });
 });


 function updateMap(mapData) {
     wallArray = mapData
     gameState = "playing";


 }

 function setMap() {
     socket.emit("setMap", wallArray)
 }





 function updateLocalPlayerPositions(playerList) {
     for (i in playerList) {
         if (aliveTankArr) {
             for (j in aliveTankArr) {
                 if (playerList[i].id == aliveTankArr[j].id) {
                     aliveTankArr[j].x = playerList[i].x;
                     aliveTankArr[j].y = playerList[i].y;
                     aliveTankArr[j].rotation = playerList[i].rotation;
                 }
             }
         }
     }
 }