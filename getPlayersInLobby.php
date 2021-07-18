<?php 
    if(isset($_GET['lobbyId'])){
        $lobbyId = $_GET["lobbyId"];
    }
    else {
        $lobbyId = "";
        echo "Must enter lobby ID";
    }
    $mysqli = new mysqli('mysql.matthewsand.info', 'tankz_admin', 'slee9hum3staw@BRI', 'tankz');
    $query = "SELECT * FROM players WHERE lobbyId = '$lobbyId'";
    $result = $mysqli->query($query);
    $numRows = $result->num_rows;
    if($numRows == 0){
        echo "No players in lobby";
    }
    else{
        $players = array();
        while($row = $result->fetch_assoc()){
            $tmpObject = new stdClass();
            $tmpObject->nickname = $row["nickname"];
            $tmpObject->UUID = $row["UUID"];
            $tmpObject->UEID = $row["UEID"];
            $tempObject->score = $row["score"];
            array_push($players, $tmpObject);
        }
        echo json_encode($players);
    }
?>