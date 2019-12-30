app.controller('Login.IndexController', Controller);

function Controller($location, AuthenticationService){
  var lg = this;
  lg.login = login;
  

  initController();
  function initController(){
    AuthenticationService.Logout();
  };
  function login(){
    lg.loading = true;
    AuthenticationService.Login(lg.email, lg.password, function(result){
      
      if(result.status == 'success' && result.details != ''){
              
        
        //$location.path('dashboard/');
        alert('Welcome '+result.username+'!');
        
        window.location.href = '#!home';

      }else if(result.status =='failed'){          
          lg.loading = false;
          
          lg.aa = result;
      }else if(result.details == ''){        
        window.location.href = '#!register2';
        alert('Please enter Your details to proceed!');
      }else{
        alert('Network err: '+result);
        lg.loading = false;
      }
      lg.loading = false;
    });
  };



 



}



function resetPassword(){
  alert("Contact Your Admin!");
}
