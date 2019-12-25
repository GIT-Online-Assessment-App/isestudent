app.controller('Index.RegisterController', Controller);

function Controller($location, $rootScope, RegistrationService){
  $rootScope.flag = 1;

  var rg = this;

  rg.signup = signup;
  function signup(){
    rg.loading = true;
    RegistrationService.Signup(rg.username, rg.email, rg.password, function(result){
      rg.regMsg = result;
      if(result.status == 'success'){
        rg.loading = false;
        
        alert(result.status);
        //console.log(result.message.status);
        window.location.href = "#!/register2";
        
      }else if(result.error){
        alert(result.error);
        rg.loading = false;
      }      
    })
    //window.location.href = "#!/dashboard";
  }
}





