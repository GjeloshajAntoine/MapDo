function LocalStoredMarker() {
   this.storage = window.localStorage;
   this.getUserMarker=function() {
     console.log(JSON.parse(this.storage.getItem('userMarker')));
    return JSON.parse(this.storage.getItem('userMarker'));
   };
   this.getUserLocation=function() {
     return JSON.parse(this.storage.getItem('userLocation'));
   };
   this.setUserMarker=function(marker) {
     console.log(marker);
     this.storage.setItem('userMarker', JSON.stringify(marker));
   };
   this.setUserLocation=function(location) {
     console.log(location);
     this.storage.setItem('userLocation', JSON.stringify(location));
   };
   this.clear=function () {
     this.storage.removeItem('Usermarker');
     this.storage.removeItem('userLocation');
   }
}
function localDataClass() {
  this.storage = window.localStorage;
  this.get=function(key){
    var value=JSON.parse(this.storage.getItem(key));
    if (value !=null) {
      return value;
    }else {
    //  throw "Key not found";
    return null;
    }
  };
  this.set=function(key,value) {
    this.storage.setItem(key,JSON.stringify(value));
  };
  this.clear=function(keys){
    for (var i = 0; i < keys.length; i++) {
      this.storage.removeItem(keys[i]);
    }
  };
}
var localData=new localDataClass();
