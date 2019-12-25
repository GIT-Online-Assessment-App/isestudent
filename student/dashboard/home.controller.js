app.factory('PagerService', PagerService).controller('Index.HomeController', Controller);



function Controller($localStorage,QuestionPaperService,PagerService, AuthenticationService) {
    var exam = this;
    
    exam.proceed = proceed;
    exam.openFullscreen = openFullscreen;
    exam.submit = submit;
    exam.tabChangeCount = 0;
    exam.success = false;
    exam.logout_flag = true;
    exam.loading = false;
    exam.flagQuestion = flagQuestion;
    exam.flagOptions = flagOptions;
    exam.flagsArray = [];
    exam.arr = [];
    exam.resetAnswer = resetAnswer;
    //this array contain styles for Pager-Controls which is updated dynamically as per user interaction    
    exam.navigationDesign = [{      
        "border-width" : "thick",
        "border-color" : "",
        "text-decoration" : "",
        "font-weight" : "",
        "color" : ""
    }];
    
    exam.redBorder ={
        "border-color" : "red",
        "border-width" : "thick"
    }
    exam.noBorder ={
        "border-color" : "#ddd",
        "border-width" : "thick"        
    }
    exam.marked = {
        "background" : "#e1ffb8"
    }
    exam.notMarked = {
        "background" : "#fff"
    }
    
    
    
    exam.logout = logout;
    if($localStorage.currentStudent){        
        exam.uname = $localStorage.currentStudent.username;
        exam.email = $localStorage.currentStudent.email_id;
        //exam.submit = submit;        
    }
    
    
    
    
    
    function proceed(){
        exam.ok = confirm('Once Submitted you cannot change this inoformation!');
        if(exam.ok){     
            exam.loading = true;           
            QuestionPaperService.verifyKey(exam.email, exam.examkey, function(result){
                if(result.status=='success'){  
                    exam.loading = false; 
                    exam.logout_flag = false;
                    
                    //disabling ESCAPE key
                    $(document).keydown(function(event){
                        if(event.key === 'Escape'){                                
                            return false;
                        }   
                        else if(event.keyCode == 122) return false;                         
                    });
                    exam.openFullscreen(); 
                    //detecting change of tab...
                    window.addEventListener("visibilitychange", function() {
                        if (document.hidden && !exam.logout_flag){
                            console.log("Browser tab is hidden")
                            exam.tabChangeCount = exam.tabChangeCount + 1;
                            alert('Quiz will be Auto submitted on next tab Change!');
                            if(exam.tabChangeCount > 1){                               
                                clearInterval(exam.timeinterval);                                   
                                exam.submit();
                            }
                        } else {
                            console.log("Browser tab is visible")
                        }
                    });                       
                    //preventing tab/window close
                    window.addEventListener('beforeunload', function (e) {
                        e.preventDefault();
                        
                        e.returnValue = '';
                    });     
                    
                    
                    
                    exam.answers = [];     //this array contains answers marked by the student                           
                    exam.success = true;
                    exam.questions = result.questions;
                    exam.positive_marks = result.positive_marks
                    exam.negative_marks = result.negative_marks;
                    exam.qplen = exam.questions.length;
                    exam.dummyItems = exam.questions;
                    exam.pager = {};
                    exam.setPage = setPage;
                    
                    for(let i = 0; i<exam.qplen; i++){
                        exam.flagsArray[i+1] = false;   
                        exam.answers[i+1] = null; 
                        exam.navigationDesign.push({
                            "border-width" : "thick",
                            "border-color" : "",
                            "text-decoration" : "",
                            "font-weight" : "",
                            "color" : ""
                        });
                    }
                    
                    
                    
                    
                    //START------Pagination for displaying 1 question at a time
                    initController();
                    
                    function initController() {
                        // initialize to page 1
                        exam.setPage(1);
                    }
                    function setPage(page) {
                        if (page < 1 || page > exam.pager.totalPages) {
                            return;
                        }
                        
                        // get pager object from service
                        exam.pager = PagerService.GetPager(exam.dummyItems.length, page);
                        
                        // get current page of items
                        exam.items = exam.dummyItems.slice(exam.pager.startIndex, exam.pager.endIndex + 1);
                    }
                    //END--------Pagination for displaying 1 question at a time
                    
                    
                    //start timer function 
                    var time_in_minutes = result.time_limit;
                    var current_time = Date.parse(new Date());
                    var deadline = new Date(current_time + time_in_minutes*60*1000);
                    
                    
                    function time_remaining(endtime){
                        var t = Date.parse(endtime) - Date.parse(new Date());
                        var seconds = Math.floor( (t/1000) % 60 );
                        var minutes = Math.floor( (t/1000/60) % 60 );                    
                        return {'total':t, 'minutes':minutes, 'seconds':seconds};
                    }
                    
                    function run_clock(id,endtime){
                        var clock = document.getElementById(id);
                        function update_clock(){
                            var t = time_remaining(endtime);
                            clock.innerHTML = 'Time left: <br>'+t.minutes+' : '+t.seconds;
                            if(t.total<=0){
                                clearInterval(exam.timeinterval);                                   
                                exam.submit();
                            }
                        }
                        update_clock(); // run function once at first to avoid delay
                        exam.timeinterval = setInterval(update_clock,1000);
                    }
                    run_clock('clockdiv',deadline);
                    //stop timer  
                }else {
                    if(result.error=='gate_close_error'){
                        exam.loading = false;
                        alert('Please wait for the test to begin.\nConsult the faculty');
                    }else if(result.error=='test_repeat_error'){
                        exam.loading = false;
                        alert('You have already given the Test');
                    }                   
                    
                    
                }//if else ends here
            });            
        }
    }//end of proceed function
    
    
    //Fullscreen helper method
    var elem = document.documentElement;
    function openFullscreen() {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem = window.top.document.body; //To break out of frame in IE
            elem.msRequestFullscreen();
        }
    }
    
    //method to mark the border RED if marked for REVISIT
    function flagQuestion(index){
        exam.flagsArray[index] = !exam.flagsArray[index];
        exam.navigationDesign[index]["border-color"] = exam.flagsArray[index] ? "red" : "#ddd";
    }
    //method to make the font BOLD if the question is answered.
    function flagOptions(option, index){
        
        
            exam.arr[index] = option;
            exam.navigationDesign[index]["text-decoration"] = exam.arr[index] ==null ? "none" : "underline";
            exam.navigationDesign[index]["font-weight"] = exam.arr[index] ==null ? "normal" :"bold" ;
            exam.navigationDesign[index]["color"] = exam.arr[index] !=null ? "black" :  "black" ;
        
    }
    function resetAnswer(index1, index2){
        exam.answers[index1] = null;
        exam.arr[index2] = null;    
        
        exam.flagOptions(exam.answers[index1], index2);
    }
    
    
    
    function submit(){
        
        
        console.log('question len: '+ exam.questions.length);
        
        exam.aa = [];
        exam.qplen = exam.questions.length;
        for(let i=1; i<=exam.qplen; i++){
            
            exam.aa.push({
                "qno" : i,
                "student_answer" : (exam.answers[i] != null) ? exam.answers[i]:"NA"
            });
        }
        
        exam.data = {
            "email_id"  :   exam.email,
            "item_password" :   exam.examkey,
            "student_response"  : exam.aa,                    
        }
        
        QuestionPaperService.submitResponses(exam.data, function(result){
            if(result.status=='success'){
                exam.logout_flag = true;
                clearInterval(exam.timeinterval);
                alert('Exam Submitted Successfully! Your Score:'+result.score);
                $(document).ready(function() {
                    
                    $('.readonly').find('input, textarea, select, a, button').attr('disabled', 'disabled');
                    
                });
            }else{
                alert(result)
            }
        });
        
        
        
    }
    
    
    
    
    
    
    function logout(){
        AuthenticationService.Logout();        
    }    
    
    
}//end of Controller


//Pagination Service

function PagerService() {
    // service definition
    var service = {};
    
    service.GetPager = GetPager;
    
    return service;
    
    // service implementation
    function GetPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;
        
        // default page size is 10
        pageSize = pageSize || 1;
        
        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);
        
        var startPage, endPage;
        if (totalPages <= 100) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 20) {
                startPage = 1;
                endPage = 20;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
        
        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        
        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);
        
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}
