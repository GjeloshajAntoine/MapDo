var map,marker,doingController,socket,mainViewWithMap,profile;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        // Initialize app
        var myApp = new Framework7({template7Pages:true,precompileTemplates: true,});
        // If we need to use custom DOM library, let's save it to $$ variable:
        var $$ = Dom7;
        /*socket= io('http://vps392456.ovh.net:8000');
        socket.on('connect', function(){myApp.alert("socket connecté");});
        socket.on('disconnect', function(){myApp.alert("sochet déconnecté");});*/
        // Add view
        var mainView = myApp.addView('.view-main', {
          // Because we want to use dynamic navbar, we need to enable it for this view:
          scrollTopOnStatusbarClick:true
        });
        var subscribeView= myApp.addView('#subscribeView', {});
        doingController=new doingControllerModel();
        profile=new profileModel();
        mainViewWithMap=new mapMainView("mapid");

        myApp.onPageInit('subscribe', function (page) {
          initSubscribeView();
        })
        myApp.onPageInit('login', function (page) {
          console.log("loginpage");
          initLoginView(myApp,subscribeView);
        });
        myApp.onPageInit('settings', function (page) {
          console.log("settings");
          initSettingsView(myApp,subscribeView);
        });
        initSettingsView(myApp,subscribeView);
        if (profile.connected) {

        }else {
          subscribeView.router.load({url:'profile/choose.html'});
          myApp.hideToolbar('.tabbar');
          myApp.hideNavbar('.navbar');
          myApp.showTab('#subscribeView');
        }
        document.addEventListener("backbutton",function(){mainView.router.back()}, false);
        doingController.onGeolocationError(function (error) {
          console.log("GEO ERROR");
          console.log(error);
          myApp.alert(error.code,error.message);
        });

        /*var layer = new L.StamenTileLayer("watercolor");
        map = new L.Map("mapid", {
            center: new L.LatLng(37.7, -122.4),
            zoom: 0
        });
        map.addLayer(layer);
        doingController.onUserMarkerLocationChanged(function(latitude,longitude){
          if (marker ==null) {
            marker = L.marker([latitude,longitude]).addTo(map);
            marker.bindPopup('<h1>⛴ <b class="">Hello world!</b></h1><br>2<i class="icon f7-icons">persons</i>👣<em> 10:08</em>  ').openPopup();
            map.setView([latitude,longitude],12);
          }else {
            marker.setLatLng([latitude,longitude]);
            map.setView([latitude,longitude]);
          }
        });*/

      //  map.setView([51.505, -0.09], 2);
        /*
        marker = L.marker([51.505, -0.09]).addTo(map);
        marker.bindPopup('<h1>⛴ <b class="">Hello world!</b></h1><br>2<i class="icon f7-icons">persons</i>👣<em> 10:08</em>  ').openPopup();
        */
        var carVendors = {
            Feel : ['Happy', 'Sad', 'Bored', 'Mad', 'Depressed','Stressed','Cutsom','Want some friends',"Want to talk"],
            Intellectual : ['Debating', 'Philosophying', 'Mercedes', 'Volkswagen', 'Volvo'],
            Food : ['Eating','Drinking','Cooking','Wasting','Burning'],
            Traveling:['Visiting','Being lost','Someone Help ?'],
            Playing:['Video Game','Playing Chess'],
            Sport:['FootBall','BasketBall','Footing'],
            Entertainement:['Listening to Music','reading a Book','T.V']
        };
          var pickerDependent = myApp.picker({
              input: '#picker-activity',
              rotateEffect: true,
              formatValue: function (picker, values) {
                  return values[1];
              },
              cols: [
                  {
                      textAlign: 'left',
                      values: ['Feel', 'Intellectual', 'Food','Traveling','Playing','Sport','Entertainement'],
                      onChange: function (picker, country) {
                          if(picker.cols[1].replaceValues){
                              picker.cols[1].replaceValues(carVendors[country]);
                          }
                      }
                  },
                  {
                      values: carVendors.Feel,
                      width: 160,
                  },
              ]
          });
          var hours=Array.apply(null, {length: 24}).map(Function.call, Number);
          var displayHours=hours.map(function (h) {return h+" hours"});
          var minutes=Array.apply(null, {length:60}).map(Function.call, Number);
          var displayMinutes=minutes.map(function (m) {return m+" minutes"});
          var pickerDuration=myApp.picker({
                                input: '#picker-duration',
                                rotateEffect: true,
                                formatValue: function (picker, values) {
                                    return values[0]+' hours '+values[1] +" minutes";
                                },
                                cols: [
                                    {
                                        displayValues:displayHours,
                                        values: hours
                                    },
                                    {
                                        displayValues:displayMinutes,
                                        values: minutes
                                    },
                                ]
                            });
          $$('#startDoingButton').on('click',function(e){
            //{doingCategory:"",message:"",customText:"",duration:0,durationString:"",talk:false,meet:false};
            var doingCategory=pickerDependent.value[1];
            var message=$$('#doingMessage').val();
            var h=pickerDuration.value[0];
            var m=pickerDuration.value[1];
            var duration=(h*3600)+(m*60);
            doingController.setDoing({doingCategory:doingCategory,message:message,duration:duration,h:h,m:m});
            //mainView.router.back()
            myApp.accordionClose("#DoingAccordion");
          });
          doingController.onUserMarkerContentChanged(function (userMarker) {
            console.log("Chanede");
            for (category in carVendors) {
              if (carVendors[category].includes(userMarker.doingCategory)) {
                console.log("category: "+category);
                pickerDependent.setValue([category,userMarker.doingCategory]);
              }
            }
            $$('#doingMessage').val(userMarker.message);
            var hours   = Math.floor(userMarker.duration / 3600);
            var minutes = Math.floor((userMarker.duration - (hours * 3600)) / 60);
            pickerDuration.setValue([hours,minutes]);
          });
          doingController.userMarkerContentChanged();
          myApp.onPageInit('userTab', function (page) {
            console.log("INITPAGE");
            initProfilePage();
          });
          initProfilePage(myApp);

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();
