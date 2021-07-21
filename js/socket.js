 const host = window.location.host;
 const socket = io(window.location.host + ":6969", {
     secure: true
 });
 let connected = false;

 socket.on("connect", function (data) {
     console.log("Connected to game");
     socket.emit("connectToGame", {
         "name": "Guest",
         "playerNum": "1",
         "x": playerTank.x,
         "y": playerTank.y,
         "rotation": playerTank.rotation
     });
     connected = true;
 });
 socket.on("playerList", (data) => {
     updateLocalPlayerPositions(data);
 });

 socket.on("updateMap", (data) => {
     updateMap(data);
 });

 socket.on("disconnect", function (data) {
     console.log("Disconnected from game");
     connected = false;
 });

 function updatePlayerPosData(x, y, rotation) {
     if (connected) {
         socket.emit("playerMove", {
             "x": x,
             "y": y,
             "rotation": rotation
         });
     }
 }




 $('input[type=radio][name=playerSelection]').change(function () {
     switch (this.value) {
         case "1":
             playerTank = redTank;
             break;
         case "2":
             playerTank = blueTank;
             break;
         case "3":
             playerTank = greenTank;
             break;
     }
     playerNum = this.value;
     socket.emit("updatePlayerNumber", {
         "playerNum": this.value
     });
 });


 $("#nicknameInput").change(function () {

     socket.emit("updatePlayerName", {
         "name": this.value
     });
 });


 function updateMap(mapData) {
     wallArray = mapData
 }

 function setMap() {
     socket.emit("setMap", wallArray)
 }



 function updateLocalPlayerPositions(playerList) {
     for (i in playerList) {
         switch (playerList[i].playerNum) {
             case "1":
                 redTank.x = playerList[i].x;
                 redTank.y = playerList[i].y;
                 redTank.rotation = playerList[i].rotation;
                 break;
             case "2":
                 blueTank.x = playerList[i].x;
                 blueTank.y = playerList[i].y;
                 blueTank.rotation = playerList[i].rotation;
                 break;
             case "3":
                 greenTank.x = playerList[i].x;
                 greenTank.y = playerList[i].y;
                 greenTank.rotation = playerList[i].rotation;
                 break;
         }
     }
 }