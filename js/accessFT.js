var VOTES ='14w9xxUiqvHKWfRTBPk0NAJsF2_PFVaFHP87PqJ4',
TRAITS='1ucB6tnSm5cavx5_h0_NkvT_PM1iMUW-oMjJHBV0',
PEOPLE='1Atg0L0fIT2FZG0v50jKa7qR6JEydPcfJ6OHQQDM',
TRAITS_VOTES='1mvttpDkpEw6kLGQqdr29hFtlUaD6WHf6FCfBiyo',
API_KEY='AIzaSyB-RXon7sorCRGKIOg5JF4vTsTn2NTEb3U';


var curr_PID= 0;  //stores the PID of the current profile.
var user_PID= 0; // stores PID of the current user; 
var proxy = "http://people.ischool.berkeley.edu/~ruidai/cgi-bin/proxy.py?callback=?";

// log in script
  $(document).on("ready",function(){

     
    //set-up for initial page view
    $('#welcome1').hide();
    $('#welcome2').hide();
    $('#access').hide();
    $('.main-content').hide();

    //formating for links on mouse hover
    $('a').hover(
      function(){$('a').css({'color': 'red'});},
      function(){$('a').css({'color': 'black'});}
      );

    //gets window size for formating divs
    $(function(){
        $('#blur') .css({'height': (($(window).height()))});
        $('#access, #get-account') .css({'height': (($(window).height())*.75)});
    });
    
    //gets window size on resize for formating divs
    $(window).resize(function(){
       $('#blur') .css({'height': (($(window).height()))});
       $('#access, #get-account') .css({'height': (($(window).height())*.75)});
    });

    //switches from sign-up page to sign-in
    $('#goToSignIn').on('click', function(){
      $('#get-account').hide();
      $('#access').show();
      $('#warning').html("");
    });

    //switches from sign-in page to sign-up
    $('#goToSignUp').on('click', function(){
      $('#access').hide();
      $('#get-account').show();
      $('#tryAgain').html("");
    });

    //Checks username against FT using python proxy
    $('#sign-up').on('submit' ,function(){
      
      var userName = $('#userName').val();
      userName = userName + "@ischool.berkeley.edu";

      //if (email.search(email_val) !== -1) {

        $.post(proxy, {action: 'get_token', email: userName}, function(data) {

          data = trim(data);
          checkEmail(data);

        });
      /*} else {

        $('#warning').html('*Invalid email format, try again');
        console.log('not a correct email');
      }*/
      
      return false;
    });

    //Eliminates invisible characters 
    function trim(stringToTrim) {
          return stringToTrim.replace(/^\s+|\s+$/g,"");
    }

    //Evaluates states sent from Python proxy and modifies html of login elements accordingly
    function checkEmail (proxyRes){

      //console.log(proxyRes);

      if (proxyRes === "NOT_FOUND"){
        $('#warning').html('Sorry, sign-up only available for UC Berkeley MIMS 2013 and 2014 students');

      } else if (proxyRes == 'SOMETHING_WRONG'){
        console.log('Error somewhere in proxy server processing');

      } else if (proxyRes == 'GENERATED'){

        $('#get-account').hide();
        $('#welcome1, #access').show();

      } else if (proxyRes == 'RESENT'){

        $('#get-account').hide();
        $('#welcome2, #access').show();

      } else {

        console.log('ooops...something is terribly wrong! debug time : (');

      }

    }

    //Checks user name and token against fusion table using python proxy.  Grants access 
    //or not based on value passed back.
    $('#log-in').on('submit', function(){

      console.log('log-in form submitted');

      var email_complete = $('#user').val()+"@ischool.berkeley.edu";

      $.post(proxy, {action: 'verify_token', email: email_complete, token: $('#token').val()},
        function(data) {

          data = trim(data);
          if (data != '-1'){

            $('#login-container').fadeOut('slow');
            $('#blur').fadeOut('slow');

            $('.main-content').fadeIn('slow');
            user_PID=data;
            console.log ("current user PID = "+user_PID);

            //move the carousel to curr_PID
            // TODO
            refresh_screen(); // updates the traits

          } else{

            $('#tryAgain').html('Incorrect login information.  Please try again.');

          }
      });

      return false;

    });

  }); //end document ready



function getVotesAll() {
  var query = "SELECT TID, ups, downs FROM " + VOTES;
  ft2json.query(query, function(result) {
    console.log(result.data);
    });
}
function getVotes(TID) {
  var query = "SELECT TID, ups, downs FROM " + VOTES + " WHERE TID="+TID;
  ft2json.query(query, function(result) {
    console.log(result.data[0]); //only 1 result
    });
}

function getTraitsAll() {
   var query = "SELECT PID, TID, text FROM " + TRAITS;
   ft2json.query(query, function(result) {
      console.log(result.data);
    });
}



function getTraitsByPerson(PID) {

  $('#traits-ul').empty();
   var query = "SELECT PID, TID, text FROM " + TRAITS + " WHERE PID="+PID;
   ft2json.query(query, function(result) {
    console.log(result);
      for (var i=0; i<result.data.length; i++) {

        var id= result.data[i].TID;
      	$('.trait-container ul').append("<li id='"+id+"'>"+result.data[i].text+
          '<a id="vote-up'+id+'" class="vote-btn gray button vote-up">Agree</a>'+
          '<a id="vote-down'+id+'" class="vote-btn gray button vote-down">Disagree</a></li>');
      	 

        //console.log($('ul #'+result.data[i].TID+' #vote-up'));
        $('#vote-up'+id).on('click', function(){
          var trait_ID = this.parentNode.id;
          console.log(trait_ID);
          $.post(proxy, 
            {action: 'update_vote', TID: trait_ID, columnName: 'ups'},
            function(data) {
              //@Michael: update the vote count in UI
              console.log('updated vote');

            }); //end post
          return false;


        }); //click vote up
       


        $('#vote-down'+id).on('click', function(){
          var trait_ID = this.parentNode.id;
          console.log(trait_ID);
          $.post(proxy, 
            {action: 'update_vote', TID: trait_ID, columnName: 'downs'},
            function(data) {
              //@Michael: update the vote count in UI
              console.log('updated vote');

            }); //end post
          return false;


        }); //click vote down
      } //end for

      //TODO
  console.log ("PID= "+ PID + "user_PID="+user_PID);
   if (PID==user_PID) { //only able to add a trait for yourself.
     var trait_form = "Enter a new Trait <input type='text' class='new-trait-input'/> <input type='submit' value ='Add'/>";
      $('#traits-ul').append("<li class='new-trait-li'>"+trait_form+'</li>');
   }
    });

}
function getTraitsByTID(TID) {
   var query = "SELECT PID, TID, text FROM " + TRAITS + " WHERE TID="+TID;
   ft2json.query(query, function(result) {
      console.log(result.data);
    });
}
function getTraitsAndVotesByPerson(PID) {
  var query = "SELECT TID, text, ups, downs FROM " + TRAITS_VOTES + " WHERE PID="+PID;
   ft2json.query(query, function(result) {
      console.log(result.data);
    });
}

function getSummedVotesByPerson (PID) {
  var query = "SELECT sum(ups) as sumups, sum(downs) as sumdowns FROM " + TRAITS_VOTES + " WHERE PID="+PID;
   ft2json.query(query, function(result) {
      console.log(result.data[0]); //only 1 result 
    });
}




$(document).on('ready', function() {

  console.log('document ready');
  $('#go-to-me').on('click', function(){
    console.log(curr_PID);
  });


});


function refresh_screen(){
  getTraitsByPerson(curr_PID);
}