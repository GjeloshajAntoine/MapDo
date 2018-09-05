/*var mapMainView ={
  name:"",
  customText:"",
  setDoing:function(name,customText) {

  },
  onSetDoingChange:function(){

  },
  onDoingFinished:function(){

  }
}*/
function markerTemplate(data) {
  var stringTemplate=markerTemplate='<h1>⛴ <b class="">'+data.message+'</b></h1><br>2<i class="icon f7-icons">persons</i>👣<em>'+data.h+':'+data.m+'</em>';
  var stringTemplate='<h3>⛴ <b class="">'+data.message+'</b></h3><br>2<i class="icon f7-icons">persons</i>👣<em>'+data.h+':'+data.m+'</em>';

  var compiledPopupTemplate = Template7.compile($('#template').html());
  var emojiCat={'happy':'=D',"T.V":"📺",'Listening to Music': "🎵"};
  if (data.doingCategory ===undefined) {
    data["doingCategory"]="happy";
  }
  //data["doingCategory"]="happy";
  data['emojiCat']=emojiCat[data['doingCategory']];
  return compiledPopupTemplate(data);
}
function iconTemplate(data) {
  var compiledIconTemplate = Template7.compile($('#iconTemplate').html());
  data["emojiActivity"]=emojiActivities[data.doingCategory];
  return compiledIconTemplate(data);

}

function mapMainView(elementID){
  this.locationNeverSet=true;
  this.userMarker=null;// marker of user
  this.userMarkerDataStoredBeforeMarkerCreated=null;
  this.strangerMarker={};//{"UserId":markerobject}
  this.layer = new L.StamenTileLayer("watercolor");//init map

  this.map = new L.Map(elementID, {//basic map config
      fullscreenControl: {
        pseudoFullscreen: false // if true, fullscreen to page width and height
      },
      maxZoom:17
  });
  this.markerTemplate=markerTemplate;
  this.iconTemplate=iconTemplate;
  this.map.addLayer(this.layer);


  doingController.onUserMarkerContentChanged(function(UserMarker){
    if (this.locationNeverSet) {//can't set the marker if no location so storing data it for later
      this.userMarkerDataStoredBeforeMarkerCreated=UserMarker;
    }else {
      var myIcon = L.divIcon({className:'testicondiv',html:this.iconTemplate(UserMarker)});
      this.userMarker.setIcon(myIcon);
      this.userMarker._popup.setContent(this.markerTemplate(UserMarker));
      this.userMarker.openPopup();
    }
  }.bind(this));
  doingController.onUserMarkerLocationChanged(function(latitude,longitude) {//update user marker on location update
    if (this.userMarker==null) {//if no user marker created

      //var myIcon = L.divIcon({html:'<div style="border-radius: 175px 175px 175px 175px;border:0px solid #000000;height:36px;width:36px;"></div>'});
    //  var myIcon = L.divIcon({className:'testicondiv',html:'<div style="content: url("'+'http://www.hdwallpapers.in/walls/cute_baby_in_autumn-wide.jpg'+'")>radomPicture</div>'});
    //  var myIcon = L.divIcon({className:'testicondiv',html:'<img class="testicondiv" src="img/profile.jpg" alt="Smiley face" height="24" width="25"> '});

      if (this.userMarkerDataStoredBeforeMarkerCreated !=null ) {//if data got before locations => use data
        var myIcon = L.divIcon({className:'testicondiv',html:this.iconTemplate(this.userMarkerDataStoredBeforeMarkerCreated)});
        this.userMarker=L.marker([latitude,longitude],{icon:myIcon}).addTo(this.map);

        this.userMarker.bindPopup(this.markerTemplate(this.userMarkerDataStoredBeforeMarkerCreated)).openPopup();
      }else {//if no data,create a hello
        var myIcon = L.divIcon({className:'testicondiv',html:this.iconTemplate({doingCategory:'Happy',pseudo:'This is You!'})});
        this.userMarker=L.marker([latitude,longitude],{icon:myIcon}).addTo(this.map);

        this.userMarker.bindPopup(this.markerTemplate({doingCategory:'Happy',message:'This is You!'})).openPopup();
      }

      this.userMarker.setLatLng([latitude,longitude]);
      //this.map.setZoom(13);
      //as the current user has just come show it by zoom into id
      console.log("lat lng:");
      console.log([latitude,longitude]);
      this.map.setView([latitude,longitude],12);
      this.userMarker.openPopup();
      console.log("marker was null");
    }else {//if created just update coord
      this.userMarker.setLatLng([latitude,longitude]);
      //this.map.setView([latitude,longitude],12);
      console.log("marker wasn't null");
    }
    console.log(this);
    this.locationNeverSet=false;
  }.bind(this));
  doingController.userMarkerLocationChanged();//fires callback for the above method to retrieve stored data

  this.map.on("zoomend",function (event) {//avulate distance and queries for marker within distance area
    var bounds1=this.map.getBounds()._northEast;
    var bounds2=this.map.getBounds()._southWest;
    var distance=this.map.distance(bounds1,bounds2)/2;
    console.log(distance);
    console.log("center is");
    console.log(this.map.getCenter());
    var latitude=this.map.getCenter().lat;
    var longitude=this.map.getCenter().lng;
    doingController.getLocalStrangerMarker({uid:doingController.userMarker.uid,distance:distance,latitude:latitude,longitude:longitude});//disant = metre
  }.bind(this));

  doingController.onLocalStrangerMarkerGot(function (markerArray) {
    for (var i = 0; i < markerArray.length; i++) {
      if(this.strangerMarker[markerArray[i].uid]){
        var myIcon = L.divIcon({className:'testicondiv',html:this.iconTemplate(markerArray[i])});
        this.strangerMarker[markerArray[i].uid].setIcon(myIcon);
        this.strangerMarker[markerArray[i].uid].setLatLng([markerArray[i].latitude,markerArray[i].longitude]);
        this.strangerMarker[markerArray[i].uid]._popup.setContent(this.markerTemplate(markerArray[i]));
        this.strangerMarker[markerArray[i].uid].openPopup();
      }else if(markerArray[i].uid !=doingController.userMarker.uid) {
        var myIcon = L.divIcon({className:'testicondiv',html:this.iconTemplate(markerArray[i])});
        this.strangerMarker[markerArray[i].uid]=L.marker([markerArray[i].latitude,markerArray[i].longitude],{icon:myIcon}).addTo(this.map);
        this.strangerMarker[markerArray[i].uid].bindPopup(this.markerTemplate(markerArray[i])).openPopup();
      }
    }
    console.log("updating other markers");
    console.log(markerArray);
  }.bind(this));
}
