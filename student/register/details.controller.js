app.controller('Index.DetailsController', Controller);

function Controller($localStorage,AuthenticationService,RegistrationService, $http){
    var detail = this;
    detail.submit = submit;
    detail.logout = logout;
    detail.usnRegEx = '[0-9]GI[0-9]{2}[A-Z]{2}[0-9]{3}';
    if($localStorage.currentStudent){
      detail.email = $localStorage.currentStudent.email_id;
      detail.semesters = [1,2,3,4,5,6,7,8];
      detail.branches = [
        "Information Science",
        "Computer Science",
        "Electrical and Electronics Engineering",
        "Electrical Engineering",
        "Civil Engineering",
        "Mechanical Engineering"
      ];

    }else{
      alert("Session Timeout");
    } 


    function submit(){
      if($localStorage.currentStudent){
        RegistrationService.updateInfo(detail.email, detail.usn, detail.phone, detail.branch, detail.semester, function(result){

          if(result.status){
            alert('dash:'+result.email_id);
            window.location.href = "#!/";
          }else{
            alert('error:sdfdg '+result.error);
          } 
  
        });
      }
    }

    function logout(){
      AuthenticationService.Logout();        
  } 
}



/*$(document).ready(function() {

        $('.readonly').find('input, textarea, select, button').attr('disabled', 'disabled');

    }); */