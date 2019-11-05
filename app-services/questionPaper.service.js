app.factory("QuestionPaperService", Service);

function Service($http, $localStorage, $rootScope){
  var service = {};
  service.verifyKey = verifyKey;
  service.submitResponses = submitResponses;
  service.prevResponses = prevResponses;
  return service;



  //Method to Verify exam key 
  function verifyKey(email, examkey, callback){
    $http({
      method : "POST",
      url    :  $rootScope.URLs.ip+":5053/student_pass_key_auth",
      data   :  {
              "email_id" : email,
              "item_password" : examkey
      }
    }).then(function successCallback(response){
        if(response.data.status=='success'){
          callback(response.data);
        }else if(response.data.status=='failed'){
          callback(response.data);
        }
    }, function errorCallback(response){
          callback('Network/server error!');
    });
  }

  function submitResponses(data, callback){
    $http({
      method : "POST",
      url    : $rootScope.URLs.ip+":5053/student_response",
      data   :  data 
    }).then(function successCallback(response){
        if(response.data.status=='success'){
          callback(response.data);
        }else{
          callback(response.data);
        }
    }, function errorCallback(response){

    });
  }

  function prevResponses(email, callback){
    $http({
      method : "POST",
      url    :  $rootScope.URLs.ip+":5055/student_dashboard",
      data   :  {
        "email_id" : email
      }

    }).then(function successCallback(response){

      if(response.data.status=='success'){
        callback(response.data);
      }else{
        callback(response.data);
      }

    }, function errorCallback(response){
      callback('Network Error');      
    });
  }


}