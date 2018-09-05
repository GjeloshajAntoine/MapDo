function initSubscribeView() {
  $("#SubmitSubscribe").on('click',function(){
      profile.subscribe($("#PseudoSubscribe").val(),$("#PasswordSubscribe1").val(),function (data) {
        subscribeView.router.back();
        myApp.showToolbar('.tabbar');
        myApp.showNavbar('.navbar');
        myApp.showTab('#tab1');
      });
  });
  $("#PasswordSubscribe2").on('keyup',function(){
    if ($("#PasswordSubscribe1").val() == $("#PasswordSubscribe2").val()) {
      $("SubscribeErrorPassword").hide();
      document.getElementById("SubscribeErrorPassword").style.display="none";
    }else {
      $("SubscribeErrorPassword").show();
      document.getElementById("SubscribeErrorPassword").style.display="block";
    }
  });
  $("#PseudoSubscribe").on('keyup',function(){

  });
}
