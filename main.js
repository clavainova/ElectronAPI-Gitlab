//-------------------------------GUIDE-------------------------------


/*
    IMPORTS
    NAVIGATION
    GENERATE MENU
    LOGIN
    LOCAL JSON HANDLING
    SERVER JSON HANDLING 
*/


//-------------------------------IMPORTS-------------------------------

//internal
var isLoggedIn = false;
var user, pass;
var DbName = "Projet-Fil-Rouge";

//electron
const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron')
const path = require('path');
const config = require('./src/config');
const storage = require('./src/main/storage');

//mongodb
const MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb+srv://admin:seatbelt34@cluster0.llbg1.mongodb.net/test?authSource=admin&replicaSet=atlas-lpvzs6-shard-0&readPreference=primary";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//server
const http = require('http');
const express = require('express');
const eapp = express();


const server = http.createServer(function (request, response) {
  console.dir(request.param)

  //-------------------------------LOGIN AND REQUESTS-------------------------------

  if (request.method == 'POST') {
    console.log('POST');
    var body = '';
    request.on('data', function (data) {
      body += data;
      //console.log('Partial body: ' + body);
    })
    request.on('end', function () {
      console.log('Body: ' + body);
      response.writeHead(200, { 'Content-Type': 'text/html' });

      body = JSON.parse(body);
      postReq();

      //switch(body) to differentiate data types

      async function postReq() {
        // connect to your cluster
        let record; //data to insert
        switch (body.Type) {
          //to validate a login
          case "Login":

            let alreadySent = false;
            try {
              //try connecting
              user = body.Username;
              pass = body.Password;
              let client, url = 'mongodb+srv://' + body.Username + ':' + body.Password + '@cluster0.llbg1.mongodb.net/test?retryWrites=true&w=majority';
              console.log(url);
              client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
              await client.connect();
            }
            catch (err) {
              //it failed? send a rejection
              console.log("connection error: " + err);
              isLoggedIn = false;
              response.end("error"); //this used to be false
              alreadySent = true;
            }
            finally {
              //after, if no message already sent, send positive request
              //no error, credentials correct
              if (alreadySent == false) {
                isLoggedIn = true;
                response.end('post received');
              }
            }
            break;
          //to create a record
          case "Create":
            switch (body.ElementType) {
              case "Player":
                record = { FirstName: body.Name, LastName: body.Surname, Role: 1 };
                insertRecord(record, "eUsers");
                break;
              case "Team":
                record = { Players: body.Players, Name: body.ID };
                insertRecord(record, "eTeams");
                break;
              case "Game":
                record = { duration: body.Duration, teams: body.Teams };
                insertRecord(record, "eGames");
                break;
              default:
                response.end("invalid element type");
                break;
            }
            break;
          //to read a record
          case "Read":
            switch (body.ElementType) {
              case "Player":
                getRecords("eUsers");
                break;
              case "Team":
                getRecords("eTeams");
                break;
              case "Game":
                getRecords("eGames");
                break;
              default:
                console.log("invalid element type");
                break;
            }
            break;
          /*
        //to update a record
          case "Update":
            break;
          //to delete a record
          case "Delete":
            break;
            */
          default:
            response.end("invalid request type");
            break;
        }

        function getUrl() {
          try {
            return 'mongodb+srv://' + user + ':' + pass + '@cluster0.llbg1.mongodb.net/test?retryWrites=true&w=majority';
          } catch (e) {
            console.log(e);
            return false;
          }
        }

        function insertRecord(record, collectionName) {
          MongoClient.connect(getUrl(), function (err, db) {
            if (err) throw err;
            var dbo = db.db(DbName);
            dbo.collection(collectionName).insertOne(record, function (err, res) {
              if (err) {
                throw err;
                response.end('error');
              }
              else {
                console.log("1 document inserted");
                response.end('post received');
                db.close();
              }
            });
          });
        }

        function getRecords(collectionName) {
          MongoClient.connect(getUrl(), function (err, db) {
            if (err) throw err;
            var dbo = db.db(DbName);
            dbo.collection(collectionName).find({}).toArray(function (err, result) {
              if (err) {
                throw err;
                response.end('error');
              }
              else {
                console.log("data retrieved");
                response.end(JSON.stringify(result));
                db.close();
              }
            });
          });
        }
      }
    })

    //on all other requests
  } else {
    console.log('GET')
    var html = `
            <html>
                <body>
                    <form method="post" action="http://localhost:3000">Name: 
                        <input type="text" name="NAME" />
                        <input type="submit" value="Submit" />
                    </form>
                </body>
            </html>`
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end(html)
  }
})

const port = 3000
const host = '127.0.0.1'
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)