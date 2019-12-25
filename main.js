
var app = angular.module("myApp", ['ngRoute', 'ngMessages', 'ngStorage']);

app.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl : 'student/login/index.login.html',
      controller : 'Login.IndexController',
      controllerAs : 'lg'
    })
    .when('/register1', {
        templateUrl : 'student/register/index.register1.html',
        controller : 'Index.RegisterController',
        controllerAs : 'rg'
      })
      .when('/register2', {
        templateUrl : 'student/register/index.details.html',
        controller : 'Index.DetailsController',
        controllerAs : 'detail'
      })
      .when('/home', {
          templateUrl : 'student/dashboard/index.home.html',
          controller : 'Index.HomeController',
          controllerAs : 'exam'
          
      })
      .when('/dashboard', {
        templateUrl : 'student/dashboard/index.dashboard.html',
        controller : 'Index.DashboardController',
        controllerAs : 'dsh'
        
    })

    .otherwise('/');    //this thing has to be FIXED
})

.run(run);
function run($rootScope, $http, $location, $localStorage) {
        $rootScope.URLs = {
          //"ip": "http://10.13.3.242"
          //"ip": "http://10.10.2.219"
          "ip" : "http://10.10.3.160"
        }


        
      
      

        // keep user logged in after page refresh
        if ($localStorage.currentStudent) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentStudent.token;
        }
        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['#!', '#!register'];
        //var pubPages = ['#!register'];
        var restrictedPage = publicPages.indexOf(window.location.href)===-1;

        if (restrictedPage && !$localStorage.currentStudent) {
            //$location.path('/register');
            window.location.href ='#!/';
        }
        });

        
        //code to disable INSPECT ELEMENT
       /*  $(document).keydown(function(e){
          if(e.which === 123){
             return false;
          }
          else if ((e.ctrlKey && e.shiftKey && e.keyCode == 73) 
          || (e.ctrlKey && e.shiftKey && e.keyCode == 74) 
          || (e.ctrlKey && e.keyCode == 85) //code to prevent user from switching between Browser tabs
          || (e.ctrlKey && e.keyCode == 49)
          || (e.ctrlKey && e.keyCode == 50) 
          || (e.ctrlKey && e.keyCode == 51)
          || (e.ctrlKey && e.keyCode == 52)
          || (e.ctrlKey && e.keyCode == 53)
          || (e.ctrlKey && e.keyCode == 54)
          || (e.ctrlKey && e.keyCode == 55)
          || (e.ctrlKey && e.keyCode == 56)
          || (e.ctrlKey && e.keyCode == 57)) {
            
            return false;
        }
      });  */
      
    };
