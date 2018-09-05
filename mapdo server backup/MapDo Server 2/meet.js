module.exports=function (notitication,redis) {
  app.post('/meetRequest', function (req, res) {
    req.body.uid;//current user,source
    req.body.targetUid;//user to meet
    notitication.sendTo();//TODO
    res.json({'succes':true});
  });
  app.post('/meetApproval', function (req, res) {
    res.json({'succes':true});
  });
}
