module.exports = function(app,mysql,db,connection,bcrypt,salt,geo,client)
{
    var uid = require('uid-safe')
    var publicMessageSet = geo.addSet('publicMessage');

    app.post('/publicMessage/sendMessage',function(req,res){//create or use former chat room
      req.body.data.pseudo;
      req.body.data.uid;
      req.body.data.message;
      req.body.data.coord;
      //TODO Current Date !
      var latitude=parseFloat(req.body.data.latitude);
      var longitude=parseFloat(req.body.data.longitude);
      //TODO distance
      if (req.body.data.message=="") {
          res.json({success:false,muid:0});
      }else {
        var muid = uid.sync(18);
        req.body.data.muid=muid;
        //req.body.token
        client.HMSET("publicMessage:muid:"+muid,req.body.data);
        client.expire(uid,10000);
        publicMessageSet.addLocation("location:publicMessage:muid:"+muid,{latitude:latitude,longitude:longitude},function(err, reply){
          if(err) console.error(err)
          else console.log('added public Message:', reply)
          res.json({success:true,muid:muid});
        });
      }

    });

    app.post('/publicMessage/getMessages',function(req,res){//create or use former chat room
      req.body.uid;
      var latitude=parseFloat(req.body.latitude);
      var longitude=parseFloat(req.body.longitude);
      var distance=parseFloat(req.body.distance);
      var multi = client.multi();
      var options = {
          withCoordinates: true, // Will provide coordinates with locations, default false
          withHashes: true, // Will provide a 52bit Geohash Integer, default false
          withDistances: true, // Will provide distance from query, default false
          order: true, // or 'DESC' or true (same as 'ASC'), default false
          units: 'm', // or 'km', 'mi', 'ft', default 'm'
          count: undefined, // Number of results to return, default undefined
          accurate: false // Useful if in emulated mode and accuracy is important, default false
      };
      publicMessageSet.nearby({latitude:latitude, longitude:longitude},distance,options, function(err, messagesId){
        if(err){ console.error(err)}
        else{
          console.log('people messages:', messagesId,messagesId.length)
          for (var messageId of messagesId) {
            console.log(messageId);
            var uid =messageId.key.substring(9);//get id marker:uid
            multi.hgetall(uid);
          }
          multi.exec(function (err, messagesContent) {
            console.log("FINISHED");
            console.log(messagesContent);
            res.json({success:true,results:messagesContent});
          });
         }
      });
    });
}
