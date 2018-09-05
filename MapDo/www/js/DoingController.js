function doingControllerModel(){
  //marker variables

  this.localStorage=new LocalStoredMarker();
  this.latitude=null;
  this.longitude=null;
  this.userMarker={uid:null,pseudo:"",doingCategory:null,message:null,customCategory:'',duration:null,h:"",m:"",talk:false,meet:false};
  this.locationNeverSet=true;

  this.onLocationChangedCallback=[];
  this.onDoingChangeCallback=[];
  this.GeolocationErrorCallback=[];
  this.onUserMarkerContentChangedCallback=[];
  this.LocalStrangerMarkerGotCallback=[]

  this.setDoing=function(doingArray) {
    this.userMarker.doingCategory=doingArray.doingCategory;
    this.userMarker.message=doingArray.message;
    //this.userMarker.customText=doingArray.customText;
    this.userMarker.duration=doingArray.duration;//!!!!should convert hours mintues to seconds ²-- Done !
    this.userMarker.h=doingArray.h;
    this.userMarker.m=doingArray.m;
    this.localStorage.setUserMarker(this.userMarker);
    this.userMarkerContentChanged();
  };

  this.toggleTalk=function () {
    this.userMarker.talk=(!this.userMarker.talk);
    this.userMarkerContentChanged();
  };

  this.toggleMeet=function() {
    this.userMarker.meet=(!this.userMarker.meet);
    this.userMarkerContentChanged();
  };

  this.onUserMarkerContentChanged=function(callback) {
    this.onUserMarkerContentChangedCallback.push(callback);
  };

  this.userMarkerContentChanged=function(){//trigger callbacks
    if (this.userMarker.uid != null && this.userMarker.doingCategory != null && this.userMarker.message != null && this.userMarker.duration != null) {
      for (i = 0; i < this.onUserMarkerContentChangedCallback.length; i++){this.onUserMarkerContentChangedCallback[i](this.userMarker);}
      this.userMarker['latitude']=this.latitude;
      this.userMarker['longitude']=this.longitude;
      //socket.emit('userMarkerContentChanged',this.userMarker);
      console.log("Ajax");
      $.post('http://vps392456.ovh.net:8000/markerChanged',this.userMarker,function (json) {
        console.log(json);
      });
    }
  }.bind(this);
  this.onDurationChanged=function() {

  };
  this.onDoingFinished=function(){

  };


  this.onLocalStrangerMarkerGot=function(callback){
    this.LocalStrangerMarkerGotCallback.push(callback);
  }.bind(this);
  this.LocalStrangerMarkerGot=function(markerArray){
    for (i = 0; i < this.LocalStrangerMarkerGotCallback.length; i++){this.LocalStrangerMarkerGotCallback[i](markerArray);}
  }.bind(this);
  this.getLocalStrangerMarker=function(data){//change update map area
    //socket.emit('getLocalStrangerMarker',data);
    $.post('http://vps392456.ovh.net:8000/LocalStrangerMarker',data,function (json) {
        console.log(json);
        this.LocalStrangerMarkerGot(json);
    }.bind(this));
  }.bind(this);

  /*socket.on('LocalStrangerMarkerGot', function(markerArray){
    this.LocalStrangerMarkerGot(markerArray);
  }.bind(this));*/

  this.setLocation=function(position) {
    this.latitude=position.coords.latitude;
    this.longitude=position.coords.longitude;
    this.locationNeverSet=false;
    this.localStorage.setUserLocation({coords:{latitude:this.latitude,longitude:this.longitude}});
    console.log(JSON.stringify({coords:{latitude:this.latitude,longitude:this.longitude}}));
    //for (i = 0; i < this.onLocationChangedCallback.length; i++){this.onLocationChangedCallback[i](this.latitude,this.longitude);}
    this.userMarkerLocationChanged()
  }.bind(this);
  this.onUserMarkerLocationChanged=function(callback){
    this.onLocationChangedCallback.push(callback);
  }.bind(this);
  this.userMarkerLocationChanged=function(){
    if (this.latitude != null) {
      for (i = 0; i < this.onLocationChangedCallback.length; i++){this.onLocationChangedCallback[i](this.latitude,this.longitude);}
    }
  }.bind(this);
  this.GeolocationError=function(error) {
    for (i = 0; i < this.GeolocationErrorCallback.length; i++){this.GeolocationErrorCallback[i](error);}
  }.bind(this);
  this.onGeolocationError=function (callback) {
    this.GeolocationErrorCallback.push(callback);
  }.bind(this);
  this.getCurrentUserMarkerLocation=function () {
    if (device.platform	!="Android") {
      navigator.geolocation.getCurrentPosition(this.setLocation,this.GeolocationError,{enableHighAccuracy:false,maximumAge:Infinity, timeout:30000});
    }else {
      cordova.plugins.locationServices.geolocation.getCurrentPosition(this.setLocation,this.GeolocationError,{enableHighAccuracy:false,maximumAge:Infinity, timeout:30000});
    }
    console.log(this);
  }.bind(this);

  if (this.localStorage.getUserLocation()) {
    this.setLocation(this.localStorage.getUserLocation());
  }
  if (this.localStorage.getUserMarker()) {
    this.setDoing(this.localStorage.getUserMarker());
  }

  if (device.platform	!="Android") {
    navigator.geolocation.getCurrentPosition(this.setLocation,this.GeolocationError);
    this.watchId=navigator.geolocation.watchPosition(this.setLocation,null,{timeout:1000,enableHighAccuracy:true});
  }else {
    cordova.plugins.locationServices.geolocation.getCurrentPosition(this.setLocation,this.GeolocationError);
    this.watchId=cordova.plugins.locationServices.geolocation.watchPosition(this.setLocation,null,{timeout:1000,enableHighAccuracy:true});
  }

}
