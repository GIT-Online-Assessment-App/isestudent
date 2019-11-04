app.controller('Index.RegisterController', Controller);

function Controller($location, $rootScope, RegistrationService){
  $rootScope.flag = 1;

  var rg = this;

  rg.signup = signup;
  function signup(){
    RegistrationService.Signup(rg.username, rg.email, rg.password, function(result){
      if(result.response){
        
        alert(result.response.email_id);
        //console.log(result.message.status);
        window.location.href = "#!/register2";
        
      }else if(result.error){
        alert(result.error);
      }      
    })
    //window.location.href = "#!/dashboard";
  }
}





