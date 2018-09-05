module.exports=function (mysql,redis,bcrypt,salt) {
  this.mysql=mysql;
  this.redis=redis;
  this.bcrypt=bcrypt;
  this.salt=salt;
  this.auth=function(uid,token) {
    var sql = "SELECT 1 FROM users WHERE uid=? AND token=? ;";
  };
  this.getToken=function(pseudo,psswd) {

  };
  this.subscribe=function(pseudo,psswd) {

  };
}
