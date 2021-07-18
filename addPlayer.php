<?php 
    if(isset($_GET['lobbyId'])){
        $lobbyId = $_GET["lobbyId"];
    }
    else {
        $lobbyId = "";
        echo "Must enter lobby ID";
    }

     if(isset($_GET['nickname'])){
        $nickname = $_GET["nickname"];
    }
    else {
        $nickname = "";
        echo "Must enter nickname";
    }
    $mysqli = new mysqli('mysql.matthewsand.info', 'tankz_admin', 'slee9hum3staw@BRI', 'tankz');
    $query = "CALL addPlayer('$lobbyId','$nickname',@UUID);";
    $query2 = "SELECT @UUID;";
    $result = $mysqli->query($query);
    $result2 = $mysqli->query($query2);
    echo $result2->fetch_assoc()['@UUID'];
    $mysqli->close();
?>