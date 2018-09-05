function initSettingsView(myApp,subscribeView) {
  $('#settingsDisconnect').on('click', function () {
    console.log("click dis");
    var buttons = [
    {
        text: 'Disconnect',
        bold: true,
        onClick: function () {
            profile.disconnect();
            subscribeView.router.load({url:'profile/choose.html'});
            myApp.hideToolbar('.tabbar');
            myApp.hideNavbar('.navbar');
            myApp.showTab('#subscribeView');
        }
    },
    {
        text: 'Cancel',
        color: 'red'
    },
  ];
  myApp.actions(buttons);

});
}
