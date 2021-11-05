//-------------------------------ERROR CODES-------------------------------

function makeSuccessMessage(msg = "default") {
    closeError();
    let div = document.createElement("div");
    div.className = "successMessage";
    div.id = "error";
    let text;
    if (msg == "default") {
        text = document.createTextNode("Login successful! Use the Menu at the top of the window to navigate.");
    }
    else {
        text = document.createTextNode(msg);
    }
    div.appendChild(text);
    document.getElementById("body").appendChild(div);
}

function waitMessage(isOpen) {
    if (isOpen) {
        document.getElementById("waitMessage").remove();
    }
    else {
        let div = document.createElement("div");
        div.className = "waitMessage";
        div.id = "waitMessage";
        let text = document.createTextNode("Loading");
        div.appendChild(text);
        document.getElementById("body").appendChild(div);
    }
}

function makeErrorMessage(err) {
    closeError();
    let div = document.createElement("div");
    div.className = "errorMessage";
    div.onclick = function () { closeError(); };
    div.id = "error";
    let text;
    switch (err) {
        //new team
        case "012":
            text = document.createTextNode("ERROR: ID blank and team must contain at least 2 people");
            break;
        case "01":
            text = document.createTextNode("ERROR: ID Blank");
            break;
        case "02":
            text = document.createTextNode("ERROR: team must contain at least 2 people");
            break;
        //log in
        case "12":
            text = document.createTextNode("ERROR: No username entered");
            break;
        case "13":
            text = document.createTextNode("ERROR: No password entered");
            break;
        case "123":
            text = document.createTextNode("ERROR: No username or password entered");
            break;
        case "00":
            text = document.createTextNode("ERROR: Username or password incorrect");
            break;
        //new player
        case "5":
            text = document.createTextNode("ERROR: One or more fields blank");
            break;
        case "6":
            text = document.createTextNode("ERROR: Fields contain illegal characters");
            break;
        case "55":
            text = document.createTextNode("ERROR: Maximum 6 players.");
            break;
        case "56":
            text = document.createTextNode("ERROR: One or more fields blank and fields contain illegal characters");
            break;
        //new game
        case "7":
            text = document.createTextNode("ERROR: You must select exactly 2 teams");
            break;
        case "8":
            text = document.createTextNode("ERROR: Duration must be a number");
            break;
        case "9":
            text = document.createTextNode("ERROR: Duration should be between 10 and 300 minutes");
            break;
        case "10":
            text = document.createTextNode("ERROR: Credentials not recognised");
            break;
        case "99":
            text = document.createTextNode("ERROR: Server connection error. Check DB status.")
        default:
            text = document.createTextNode("Unknown error");
            break;
    }
    div.appendChild(text);
    document.getElementById("body").appendChild(div);
}

function closeError() {
    try {
        document.getElementById("body").removeChild(document.getElementById("error"));
    }
    catch (err) {
        return;
    }
}


//-------------------------------GAME.HTML-------------------------------



var selectedGame = []; //selected teams

//keep track of selected teams
function toggleG(teamId) {

    if (selectedGame.includes(teamId)) {
        selectedGame = selectedGame.filter(function (value, index, arr) {
            if (value == teamId) {
                return;
            }
            return value;
        });
        //set style to deselected
        document.getElementById(teamId).style.color = "white"
        document.getElementById(teamId).style.borderLeft = "15px solid white"
    }
    else {
        //set style to selected
        selectedGame.push(teamId);
        document.getElementById(teamId).style.color = " rgb(255, 217, 0)";
        document.getElementById(teamId).style.borderLeft = "15px solid rgb(255, 217, 0)";
    }
}

function validateGame() {
    if (selectedGame.length !== 2) {
        //if wrong number of games selected, error
        makeErrorMessage("7");
    }
    else if (document.getElementById("inputDuration").isNaN) {
        //duration isn't a number, error
        makeErrorMessage("8");
    }
    else if (document.getElementById("inputDuration").value < 10 || document.getElementById("inputDuration").value > 300) {
        //duration is outside of set range (need to specify range values)
        makeErrorMessage("9");
    }
    else {
        waitMessage(false); //show message is loading
        //send server the info it needs
        createGame();
    }

    function createGame() {
        waitMessage(false);
        var url2 = "http://127.0.0.1:3000/post/json";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url2);

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.status);
                console.log(xhr.responseText);
                waitMessage(true);
                if (xhr.responseText == "post received") {
                    //successful login
                    waitMessage(true);
                    makeSuccessMessage("Game added to DB.");
                }
                else {
                    //unsuccessful login
                    console.log("Error in database. See details above.");
                    makeErrorMessage("99");
                }
            }
        };

        var data = `{
        "Type":"Create",
        "ElementType":"Game",
        "Teams": "`+ selectedGame + `",
        "Duration": "`+ document.getElementById("inputDuration").value + `"
        }`;

        xhr.send(data);
    }
}

//load the teams as html
function printGamesHTML() {

    //get list of current teams from database

    waitMessage(false);
    var url2 = "http://127.0.0.1:3000/post/json";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url2);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            waitMessage(true);

            if (xhr.responseText == "error") {
                //unsuccessful load
                console.log("Error in database. See details above.");
                makeErrorMessage("99");
            }

            let teams = JSON.parse(xhr.responseText);
            console.log("games fetched:");
            console.log(teams);

            let i = 0;

            teams.forEach((item) => {
                let li = document.createElement("li");
                let h1 = document.createElement("h1");
                let text = document.createTextNode(i);
                i++;
                h1.appendChild(text);
                li.appendChild(h1);
                let p = document.createElement("p");
                text = document.createTextNode("Duration:");
                p.appendChild(text);
                li.appendChild(p);
                let span = document.createElement("span");
                text = document.createTextNode(item.duration);
                span.appendChild(text);
                li.appendChild(span);
                p = document.createElement("p");
                text = document.createTextNode("Teams:");
                p.appendChild(text);
                li.appendChild(p);

                let arr = item.teams.split(',');

                arr.forEach((elem) => {
                    span = document.createElement("span");
                    text = document.createTextNode(elem);
                    span.appendChild(text);
                    li.appendChild(span);
                });

                document.getElementById("gameTarget").appendChild(li);
            });
        }
    };


    var data = `{
            "Type":"Read",
            "ElementType":"Game"
            }`;

    xhr.send(data);
}

function printPlayerList() {

    //get list of current players from database

    waitMessage(false);
    var url2 = "http://127.0.0.1:3000/post/json";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url2);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");


    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) {
            console.log(xhr.status);
            waitMessage(true);

            if (xhr.responseText == "error") {
                //unsuccessful load
                console.log("Error in database. See details above.");
                makeErrorMessage("99");
            }

            let players = JSON.parse(xhr.responseText);
            console.log("players fetched:");
            console.log(players);

            let i = 1;
            players.forEach((item) => {
                let option = document.createElement("option");
                option.id = "userid" + i;
                option.setAttribute('onclick', "toggle('userid" + i + "')");
                let text = document.createTextNode(item.FirstName + " " + item.LastName);
                option.appendChild(text);
                document.getElementById("mySelect").appendChild(option);
                i++;
            });

        }
    }

    var data = `{
        "Type":"Read",
        "ElementType":"Player"
        }`;

    xhr.send(data);
}

function printTeamList() {

    //get list of current players from database

    waitMessage(false);
    var url2 = "http://127.0.0.1:3000/post/json";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url2);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");


    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) {
            console.log(xhr.status);
            waitMessage(true);

            if (xhr.responseText == "error") {
                //unsuccessful load
                console.log("Error in database. See details above.");
                makeErrorMessage("99");
            }

            let teams = JSON.parse(xhr.responseText);
            console.log("teams fetched:");
            console.log(teams);

            let i = 1;
            teams.forEach((item) => {
                let option = document.createElement("option");
                option.id = "team" + i;
                option.setAttribute('onclick', "toggleG('team" + i + "')");
                let text = document.createTextNode(item.Name);
                option.appendChild(text);
                document.getElementById("mySelect").appendChild(option);
                i++;
            });

        }
    }

    var data = `{
        "Type":"Read",
        "ElementType":"Team"
        }`;

    xhr.send(data);
}

//-------------------------------TEAM.HTML-------------------------------



var selectedTeam = []; //who did they choose

//open validation window
function goValidate() {
    //did they enter an ID?
    let idEntered = document.getElementById("inputTeamID").value.trim() !== "" ? true : false;
    //console.log(document.getElementById("inputTeamID").value.trim());
    //at least 2 entries in team?
    let teamEntered = selectedTeam.length > 1 ? true : false;
    //if they have all compulsory fields... is there a teamID? have they chosen at least 2 people?
    if (idEntered && teamEntered) {
        document.getElementById("teamID").innerHTML = document.getElementById("inputTeamID").value;
        selectedTeam.forEach(elem => {
            //try catch to avoid adding duplicate items
            try {
                let exists = document.getElementById("confirm" + elem).onclick;
            }
            catch (e) {
                let li = document.createElement("li");
                li.innerHTML = document.getElementById(elem).value;
                li.id = "confirm" + elem;
                document.getElementById("teamMembers").appendChild(li);
                document.getElementById("validateBox").style.display = "block";
            }
        });
    }
    //if they have missed some fields
    else {
        let errCode = "0";
        if (!idEntered) {
            //id blank
            errCode = errCode + "1";
        }
        if (!teamEntered) {
            //team too small
            errCode = errCode + "2";
        }
        makeErrorMessage(errCode);
        clearData();
    }
}

//keep track of selected users
function toggle(userId) {
    if (selectedTeam.includes(userId)) {
        selectedTeam = selectedTeam.filter(function (value, index, arr) {
            if (value == userId) {
                return;
            }
            return value;
        });
        //set style to deselected
        document.getElementById(userId).style.color = "white"
        document.getElementById(userId).style.borderLeft = "15px solid white"
    }
    else {
        //set style to selected
        selectedTeam.push(userId);
        document.getElementById(userId).style.color = " rgb(255, 217, 0)";
        document.getElementById(userId).style.borderLeft = "15px solid rgb(255, 217, 0)";
    }
}

//send team to db
function createTeam() {
    waitMessage(false);
    var url2 = "http://127.0.0.1:3000/post/json";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url2);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            waitMessage(true);
            if (xhr.responseText == "post received") {
                //successful login
                makeSuccessMessage("Team added to DB.");
            }
            else {
                //unsuccessful login
                console.log("Error in database. See details above.");
                makeErrorMessage("99");
            }
        }
    };

    var data = `{
        "Type":"Create",
        "ElementType":"Team",
        "Players": "`+ selectedTeam + `",
        "ID": "`+ document.getElementById("inputTeamID").value + `"
        }`;

    xhr.send(data);
}

//empty fields if data invalid
function clearData() {
    selectedTeam.forEach(elem => {
        document.getElementById(elem).style.color = "white"
        document.getElementById(elem).style.borderLeft = "15px solid white"
    });
    //remove the entered text
    document.getElementById("teamID").innerHTML = "";
    document.getElementById("teamMembers").innerHTML = "";
    //empty array
    selectedTeam = [];
    //hide it
    document.getElementById("validateBox").style.display = "none";
}

//load the teams as html
function printTeamsHTML() {

    //get list of current teams from database

    waitMessage(false);
    var url2 = "http://127.0.0.1:3000/post/json";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url2);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            waitMessage(true);

            if (xhr.responseText == "error") {
                //unsuccessful load
                console.log("Error in database. See details above.");
                makeErrorMessage("99");
            }

            let teams = JSON.parse(xhr.responseText);
            console.log("teams fetched:");
            console.log(teams[0].Players);

            teams.forEach((item) => {
                let li = document.createElement("li");
                let h1 = document.createElement("h1");
                let text = document.createTextNode(item.Name);
                h1.appendChild(text);
                li.appendChild(h1);
                let p = document.createElement("p");
                text = document.createTextNode("Players:");
                p.appendChild(text);
                li.appendChild(p);

                let arr = item.Players.split(',');


                arr.forEach((elem) => {
                    let span = document.createElement("span");
                    text = document.createTextNode(elem);
                    span.appendChild(text);
                    li.appendChild(span);
                })

                document.getElementById("teamsTarget").appendChild(li);
            });
        }
    };


    var data = `{
            "Type":"Read",
            "ElementType":"Team"
            }`;

    xhr.send(data);
}

//-------------------------------PLAYER.HTML-------------------------------




function validatePlayer() {
    //are the fields empty?
    let nameEntered = document.getElementById("inputName").value.trim() !== "" ? true : false;
    let snameEntered = document.getElementById("inputSurname").value.trim() !== "" ? true : false;
    let regex = true;

    if ((nameEntered && snameEntered) && regex) {
        //is correct, display "success" message
        createPlayer();
        //also db communication here

    }
    else {
        let error = "";
        if (!nameEntered || !snameEntered) {
            //error: one or more fields blank
            error = error + "5";
        }
        if (regex) //should be a regex test to check for special characters
        {
            //error: one or more field contains special characters
            error = error + "6";
        }
        makeErrorMessage(error);
    }
}

function createPlayer() {
    waitMessage(false);
    var url2 = "http://127.0.0.1:3000/post/json";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url2);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            waitMessage(true);
            if (xhr.responseText == "post received") {
                //successful login
                makeSuccessMessage("Player added to DB.");
            }
            else {
                //unsuccessful login
                console.log("Error in database. See details above.");
                makeErrorMessage("99");
            }
        }
    };

    var data = `{
        "Type":"Create",
        "ElementType":"Player",
        "Surname": "`+ document.getElementById("inputSurname").value + `",
        "Name": "`+ document.getElementById("inputName").value + `"
        }`;

    xhr.send(data);
}



//-------------------------------INDEX.HTML-------------------------------


//this can get more precise when we have more restrictions
function verifyInputLocally() {
    if (document.getElementById("username").value.trim() == "") {
        if (document.getElementById("password").value.trim() == "") {
            //no username or password
            makeErrorMessage("123");
        }
        //no username, correct password
        makeErrorMessage("12");
    }
    else if (document.getElementById("password").value.trim() == "") {
        //correct username, no password
        makeErrorMessage("13");
    }
    else {
        console.log("all clear");
        login();
        //all correct, proceed with send
    }
    function login() {
        (async () => {
            var login = await testLogin(document.getElementById("username").value, document.getElementById("password").value);
            console.log(login);
        }
        )();

    }
}

//test login details - are they correct?


async function testLogin(cuser, cpass) {
    waitMessage(false);
    var url2 = "http://127.0.0.1:3000/post/json";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url2);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            if (xhr.responseText == "post received") {
                //successful login
                waitMessage(true);
                makeSuccessMessage();
            }
            else {
                //unsuccessful login
                waitMessage(true);
                console.log("Password did not match values in DB");
                makeErrorMessage("00");
            }
        }
    };

    var data = `{
    "Type":"Login",
    "Username": "`+ cuser + `",
    "Password": "`+ cpass + `"
    }`;

    xhr.send(data);

    /*
        let querystring = cuser + ":delimiter:" + cpass;
        var postData = querystring.stringify({
            key: "value"
        });
    
        // Your Request Options
        var options = {
    
            host: "example.com",
            port: 443,
            path: "/path/to/api/endpoint",
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
    
        // The Request
        var request = https.request(options, function (response) {
            response.on('data', function (chunk) {
                if (chunk) {
                    var data = chunk.toString('utf8');
                    // holds your data
                }
            });
        }).on("error", function (e) {
            // Some error handling
        });
    
        //optionally Timeout Handling
        request.on('socket', function (socket) {
            socket.setTimeout(5000);
            socket.on('timeout', function () {
                request.abort();
            });
        });
    
        request.write(postData);
        request.end();
    
        user = cuser;
        pass = cpass;
        try {  // connect to your cluster
            let url = 'mongodb+srv://' + user + ':' + pass + '@cluster0.llbg1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
            const client = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            // specify the DB's name
            const db = client.db('Projet-Fil-Rouge');
            // close connection
            client.close();
            return true;
        }
        catch (e) {
            return e;
        }
        */
}


function getCollection(collectionName) {
    //get list of current teams from database

    waitMessage(false);
    var url2 = "http://127.0.0.1:3000/post/json";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url2);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            waitMessage(true);

            if (xhr.responseText == "error") {
                //unsuccessful load
                console.log("Error in database. See details above.");
                makeErrorMessage("99");
            }
            return xhr.responseText;
        }
    };


    var data = `{
        "Type":"Read",
        "ElementType":"`+ collectionName + `"
        }`;

    xhr.send(data);
}