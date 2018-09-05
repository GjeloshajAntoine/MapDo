module.exports = function(app,mysql,connection,bcrypt,salt)
{
    app.post('/UserGetToken',function(req,res){//get or create token
      var sql = "SELECT * FROM users WHERE pseudo=? ;";
      var inserts = [req.body.pseudo];
      sql = mysql.format(sql, inserts);
      connection.query(sql, function (error, result, fields) {
        if (error != null || result.length==0) {
          res.json({success:false,message:"user not found"});
        }else {
          bcrypt.compare(req.body.psswd, result[0].psswd, function(err,success) {
              // res === false
              if (success) {
                result[0]["success"]=true;
                res.json(result[0]);
              }else {
                res.json({success:false,message:"bad password",code:"badpsswd"});
              }
          });
        }
      });
    });
    app.post('/UserSubscribe',function(req,res){//get password and pseudo
      bcrypt.hash(req.body.psswd, salt, function(err, hash) {
        var sql = "INSERT INTO users (pseudo,psswd,token) VALUES(?,?,uuid());";
        var inserts = [req.body.pseudo,hash];
        sql = mysql.format(sql, inserts);
        connection.query(sql, function (error, result, fields) {
          //console.log(error);
          //console.log('The solution is: ', result.insertId);
          if (error == null) {
            result.success=true;
            res.json(result);
          }else {
            var result={success:false,errno:error.errno}
            if (error.errno == 1062) {
              result.message="Pseudo already taken";
            }
            res.json(result);
          }
        });
      });

    });
    app.post('/UserPseudoAlreadyExist',function(req,res){//get password and pseudo
      var sql = "SELECT 1 FROM users WHERE pseudo=? ;";
      var inserts = [req.body.pseudo];
      sql = mysql.format(sql, inserts);
      connection.query(sql, function (error, result, fields) {
        console.log(error);
        console.log('The solution is: ', result.insertId);
        if (result.length ==0) {
          res.json(false);
        }else {
          res.json(true);
        }
      });
    });
    app.post('/UserChangeProfilePicture',function(req,res){//get password and pseudo

    });
    app.post('/UserChangePassword',function(req,res){//get password and pseudo
      bcrypt.hash(req.body.psswd, salt, function(err, hash) {
        var sql = "UPDATE users SET  psswd =?  WHERE uid=? and token=?";
        var inserts = [hash,req.body.uid,req.body.token];
        sql = mysql.format(sql, inserts);
        connection.query(sql, function (error, result, fields) {
          console.log(error);
          if (error) {

          }
          res.json(result);
        });
      });
    });

}
