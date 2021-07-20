 const host = window.location.host;
 const socket = io("ws://" + window.location.host + ":6969");
 console.log(host)

 socket.on("connect", function (data) {
     console.log("Connected to game");
     socket.emit("connectToGame", {
         "name": "Guest",
         "playerNum": "1"
     });
 });
 socket.on("playerList", (data) => {
     listPlayerNums(data)
 });


 $('input[type=radio][name=playerSelection]').change(function () {
     socket.emit("updatePlayerNumber", {
         "playerNum": this.value
     });
 });


 $("#playerName").change(function () {
     console.log("HERE")
     socket.emit("updatePlayerName", {
         "name": this.value
     });
 });




 function listPlayerNums(playerList) {
     var p1 = $("#p1List").empty();
     var p2 = $("#p2List").empty();
     var p3 = $("#p3List").empty();
     console.log(p1)
     console.log(playerList);
     for (i in playerList) {
         player = playerList[i];
         switch (player.playerNum) {
             case "1":
                 console.log("here")
                 p1.append('<li>' + player.name + '</li>');
                 break;
             case "2":
                 p2.append('<li>' + player.name + '</li>');
                 break;
             case "3":
                 p3.append('<li>' + player.name + '</li>');
                 break;
         }
     }
 }