const express = require('express');
const {open} = require('sqlite');
const path = require('path');
const sqlite3 = require('sqlite3');

const dbPath = path.join(__dirname,"cricketTeam.db");
const app = express();
app.use(express.json());
let db = null;

const initializeDbAndServer = async()=>{
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database,

        });
        app.listen(3000,()=>{
            console.log("server running at http://localhost:3000/");
        });
    }catch(error){
        console.log(`Database Error:${error.message}`);
        process.exit(1);
    }
};

initializeDbAndServer();

const convertDbObjectToResponseObject  = (dbObject)=>{
    return{
        playerId:dbObject.playerId;
        playerName:dbObject.playerName;
        jerseyNumber:dbObject.jerseyNumber;
        role:dbObject.role;
    };
};

app.get("/players/",async(request,response)=>{
    const getPlayersQuery = `
    SELECT *
    FROM cricket_team ;`;
    const playersArray = await db.all(getPlayersQuery);
    response.send(
        playersArray.map((each_player) =>
        convertDbObjectToResponseObject(each_player)
    )
    );
});

app.get("players/:playerId",async(request,response)=>{
    const {playerId} = request.params;
    const eachPlayerQuery = `
    SELECT * 
    FROM cricket_table 
    WHERE player_id = '${playerId}';`;
    const player = await db.get(eachPlayerQuery);
    respond.send(convertDbObjectToResponseObject(player));
});

app.post("/players/",async(request,response)=>{
    const {playerName,jerseyNumber,role} = request.body;
    const postPlayerQuery = `
    INSERT INTO cricket_team(playerName,jerseyNumber,role),
    Values 
    ('${playerName}','${jerseyNumber}','${role}');`;
    const player = await db.run(postPlayerQuery);
    response.send("Player Added to the Team");
});

app.put("/players/:playerId",async(request,response)=>{
    const {playerName,jerseyNumber,role} = request.body;
    const {playerId} = request.params;
    const putPlayerQuery = `
    UPDATE cricket_team 
    SET 
    player_name = '${playerName}',
    player_id = '${playerId}',
    role = '${role}'
    WHERE player_id = '${playerId}':`;
    const playerArray = await db.run(putPlayerQuery);
    respond.send("Player Details Updated");


});


app.delete("players/:playerId/",async(request,response)=>{
    const {playerId} = request.params;
    const deletePlayerQuery = `
    DELETE FROM cricket_table 
    WHERE player_id = '${playerId}';`;
    respond.send("Player Removed");
});

module.exports = app;
