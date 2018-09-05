module.exports = function(app,mysql,db,connection,bcrypt,salt)
{
    var collection = db.collection('chat_rooms');

    //var aql = require('aqb');
    app.post('/ChatWith',function(req,res){//create or use former chat room
      req.body.pseudo;
      var test=["Ex2","userEx1"];
      db.query(
          'FOR doc IN chat_rooms'
          + '  FILTER  @test  ALL IN doc.users && doc.users ALL IN @test '
          + '  RETURN doc',
          {test:test}
      ).then(cursor => {
        return cursor.all();
      }).then(results=>{
        console.log(results);
        res.json(results[0]);
      });
      //res.json({success:false,message:"bad password"});
    });
    app.post('/ChatGetChatRooms',function(req,res){//create or use former chat room
      req.body.pseudo
      res.json({success:false,message:"bad password"});
    });
    app.post('/ChatSendTo',function(req,res){//get current user token and send to user id
      req.body.pseudo
      res.json({success:false,message:"bad password"});
    });
    app.post('/ChatGetOf',function(req,res){//get unreceived message from user token
      req.body.pseudo
      res.json({success:false,message:"bad password"});
    });

}
