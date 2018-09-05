require('daemon')();

var express = require('express');
var app = express();
var server = require('http').Server(app);

var io = require('socket.io')(server);

var redis = require("redis"),
    client = redis.createClient();
var geo = require('georedis').initialize(client);
client.on("error", function (err) {
    console.log("Error " + err);
});

var arangojs = require('arangojs');
var db = arangojs(`http://127.0.0.1:8529`);
db.useDatabase("mapdo");
db.useBasicAuth("root",'Strepsils21');
//var collection = db.collection('chat_rooms');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const settings = {
    gcm: {
        id: null,
    },
    apn: {
        token: {
            key: './certs/key.p8', // optionally: fs.readFileSync('./certs/key.p8')
            keyId: 'ABCD',
            teamId: 'EFGH',
        },
    },
    adm: {
        client_id: null,
        client_secret: null,
    },
    wns: {
        client_id: null,
        client_secret: null,
        notificationMethod: 'sendTileSquareBlock',
    }
};
const PushNotifications = new require('node-pushnotifications');
const push = new PushNotifications(settings);

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'Strepsils21',
  database : 'mapdo'
});
connection.connect();

server.listen(8000);
//var user=
require("./user.js")(app,mysql,connection,bcrypt,salt);
require("./chat.js")(app,mysql,db,connection,bcrypt,salt);
require("./publicMessages.js")(app,mysql,db,connection,bcrypt,salt,geo,client);

var marker={};//test 'database'{uid:marker} uit:int marker:{}

app.post('/markerChanged', function (req, res) {
  var uid="marker:"+req.body.uid;
  console.log(uid);
  client.HMSET(uid,req.body);
  client.expire(uid,req.body.duration);
  var locationId="location:marker:"+req.body.uid;
  geo.addLocation(locationId, {latitude:parseFloat(req.body.latitude), longitude:parseFloat(req.body.longitude)}, function(err, reply){
    if(err) console.error(err)
    else console.log('added location:', reply)
  })
  if (req.body.duration == 0) {

  }else {
    client.expire(locationId,req.body.duration);
  }
  geo.location(locationId, function(err, location){
    if(err) console.error(err)
    else console.log('Location for Toronto is: ', location.latitude, location.longitude)
  })
  res.json({'succes':true});
});
app.post('/LocalStrangerMarker', function (req, res) {
  var options = {
	  withCoordinates: true, // Will provide coordinates with locations, default false
	  withHashes: true, // Will provide a 52bit Geohash Integer, default false
	  withDistances: true, // Will provide distance from query, default false
	  order: 'ASC', // or 'DESC' or true (same as 'ASC'), default false
	  units: 'm', // or 'km', 'mi', 'ft', default 'm'
	  count: undefined, // Number of results to return, default undefined
	  accurate: true // Useful if in emulated mode and accuracy is important, default false
  }
  console.log("latitude:"+req.body.latitude);
  console.log("longitude:"+req.body.longitude);
  var locationId="location:marker:"+req.body.uid;
  geo.nearby({latitude:req.body.latitude,longitude:req.body.longitude},req.body.distance, options, function(err, locations){
    if(err){
		    console.error(err);
    }
    else{
  		console.log('nearby locations:', locations);
  		var allStrangers=[];
  		var multi = client.multi();
  		console.log(locations);

  		for (var i = 0; i < locations.length; i++) {
  			var uid =locations[i]["key"].substring(9);//get id marker:uid
  			multi.hgetall(uid);
  		}

  		multi.exec(function (err, replies) {
  			console.log("FINISHED");
  			console.log(replies);
  			res.json(replies);
  		});
	}
  });
});


io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('getLocalStrangerMarker', function (data) {
    console.log("CONNECTER");
    console.log(data);
    console.log([marker[data.uid]]);
    socket.broadcast.emit("LocalStrangerMarkerGot",[marker[data.uid]]);
  });
  socket.on('userMarkerContentChanged', function (data) {
    console.log("DECONNECTER");
    marker[data.uid]=data;
    socket.broadcast.emit("LocalStrangerMarkerGot",[marker[data.uid]]);
    console.log([marker[data.uid]]);
  });
});
