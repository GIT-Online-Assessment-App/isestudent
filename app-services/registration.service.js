app.factory("RegistrationService", Service);

function Service($http, $localStorage, $rootScope){
  var service = {};
  service.Signup = Signup;
  service.updateInfo = updateInfo;
  return service;

  function Signup(username, email, password, callback){
    $http({
      method  : "POST",          
      url     : $rootScope.URLs.ip+":5052/student_sign_up",
      data    : {
        "username" : username,
        "email_id" : email,
        "password" : password
      }
    }).then(function successCallback(response){
      //handling success
      if (response.data.status == 'success') {
            $localStorage.currentStudent = response.data;
            callback($localStorage.currentStudent);

          }
          else if(response.data.status){
            callback(response.data);
          }
    }, function errorCallback(response){
      //handle error here
      callback(response.data);
    });
  }

  function updateInfo(email, usn, phone, branch, semester, callback){

    $http({
      method : "POST",
      url : $rootScope.URLs.ip+":5052/add_student_details",
      data : {
        email_id : email,
        details : {
          "usn" : usn,
          "phone_number" : phone,
          "branch" : branch,
          "semester" : semester
        }
      }

    }).then(function successCallback(response){
        if(response.data.status){
          callback(response.data);
        }else{
          callback(response.data);
        }
    }, function errorCallback(response){
      callback(response.data);
    });

  }
}