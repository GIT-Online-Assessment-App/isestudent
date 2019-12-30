app.controller('Index.DashboardController', Controller);

function Controller($localStorage,QuestionPaperService, AuthenticationService) {
    var dsh = this;
    
    
    dsh.success = false;
    dsh.dispQuestions = dispQuestions;
    dsh.logout = logout;
    dsh.goToHome = goToHome;
    dsh.correct = {        
        "background" : "#c0f0cd"
    }
    dsh.wrong = {
        "background" : "#f7c6c6"
    }
    dsh.na = {
        "background" : "ccc"
    }
    
    initController();
    function initController(){
        if($localStorage.currentStudent){        
            dsh.uname = $localStorage.currentStudent.username;
            dsh.email = $localStorage.currentStudent.email_id;
            
            QuestionPaperService.prevResponses(dsh.email, function(result){
                
                if(result.status=='success'){
                    dsh.success = true;
                    
                    dsh.response_list = result.response_list;
                    dsh.no_tests = result.response_list.length
                    
                    
                    
                }else if(result.status == 'failed'){
                    if(result.error=='NO_RESPONSES'){
                    dsh.success = true;
                    dsh.errMsg = "Not Responded to any test Yet";
                    
                    
                    }
                }
                
                
            });
            
            
            
        }else{
            window.location.href = "#!/";
        }
        
        
        
    }
    
    function dispQuestions(q_paper){
        dsh.subject = q_paper.subject;
        dsh.ia = q_paper.ia;
        dsh.score = q_paper.score;
        dsh.semester = q_paper.semester;
        dsh.gate = q_paper.gate;
        
        dsh.responses = q_paper;
        dsh.options = q_paper.options;
    }
    function goToHome(){
        window.location.href = "#!home";
    }
    
    
    
    
    
    
    
    
    
    
    
    
    function logout(){
        AuthenticationService.Logout();        
    }   
    
}//end of Controller



