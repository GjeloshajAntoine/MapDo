function initProfilePage(myApp) {
  $('#ChangeImageProfile').on('click',function(e){
    console.log("clciked");
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    //var options = setOptions(srcType);
    //var func = createNewFileEntry;
    navigator.camera.getPicture(function cameraSuccess(imageUri) {
        myApp.alert(imageUri);
        $('#profileRoundDisplay').attr('src', imageUri);

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    },{ sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
  });
}
function profileModel() {
  this.uid;
  this.pseudo;
  this.token;
  this.connected=false;
  this.setConnection=function(data){
    this.connected=true;
    this.uid=data.uid;
    this.pseudo=data.pseudo;
    this.token=data.token;
    doingController.userMarker.uid=this.uid;
    doingController.userMarker.pseudo=this.pseudo;
    localData.set('uid',this.uid);
    localData.set('pseudo',this.pseudo);
    localData.set('token',this.token);
    doingController.userMarkerContentChanged();
  };
  this.connect=function (pseudo,password,callback) {
    var that=this;
    $.post('http://vps392456.ovh.net:8000/UserGetToken',{pseudo:pseudo,psswd:password},function (data) {
      console.log(data);
      //data=JSON.parse(data);
      that.setConnection(data);
      callback(data);
    });
  }.bind(this);
  this.subscribe=function (pseudo,password,callback) {
    var that=this;
    $.post('http://vps392456.ovh.net:8000/UserSubscribe',{pseudo:pseudo,psswd:password},function (data) {
      console.log(data);
      //data=JSON.parse(data);
      that.setConnection(data);
      callback(data);
    });
  };
  this.pseudoAlreadyExist=function (pseudo){
    $.post('http://vps392456.ovh.net:8000/UserPseudoAlreadyExist',{pseudo:pseudo},function (json) {
      console.log(json);
      data=JSON.parse(data);
    });
  };
  this.disconnect=function () {
    this.setConnection({uid:null,pseudo:null,token:null});
    this.connected=false;
    localData.clear(['uid','pseudo','token']);
  }
  if (localData.get('uid')) {
    this.uid=localData.get('uid');
    this.pseudo=localData.get('pseudo');
    this.token=localData.get('token');
    doingController.userMarker.uid=this.uid;
    doingController.userMarker.pseudo=this.pseudo;
    this.connected=true;
    doingController.userMarkerContentChanged();

  }

}
function localProfile() {
  var storage = window.localStorage;

}
function fillProfilePage() {
  $().val();
  $().val();
}
