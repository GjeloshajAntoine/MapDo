function initLoginView(myApp,subscribeView) {
  $("#loginButton").on('click',function () {
    profile.connect($("#loginPseudo").val(),$("#loginPsswd").val(),function(data) {
        if (data.success) {
          subscribeView.router.back();
          myApp.showToolbar('.tabbar');
          myApp.showNavbar('.navbar');
          myApp.showTab('#tab1');
        }else {
          $("loginError").html(data.code);
          $("loginError").show();

        }
      });
  });

}
