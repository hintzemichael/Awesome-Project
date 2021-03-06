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
      
      return false;
    });

    //Eliminates invisible characters 
    function trim(stringToTrim) {
          return stringToTrim.replace(/^\s+|\s+$/g,"");
    }

    //Evaluates states sent from Python proxy and modifies html of login elements accordingly
    function checkEmail (proxyRes){

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

            refresh_screen(); // updates the traits

            var slider = $('#slider'); //stores slider id
    
            //slider.tinycarousel({pager: true});
            //go to current PID (user)
            $('#go-to-me').click(function(){ 
            slider.tinycarousel_move(user_PID);
            return false;
            });

          } else{

            $('#tryAgain').html('Incorrect login information.  Please try again.');

          }
      });

      return false;

    });

    $('a.pagenum').click(function(){

      $('.pagenum').removeClass('active');
      var page = $(this).attr('rel');
      $('#slider').tinycarousel_move(page);
      $(this).addClass('active');
      return false;
    });

  }); //end document ready




//retrieves ups and downs for a given trait and updates the respective vote counts in the view
function getVotes(TID) {
  var query = "SELECT TID, ups, downs FROM " + VOTES + " WHERE TID="+TID;
  ft2json.query(query, function(result) {
    var data=result.data[0]; //only 1 result
    if (data!=null) {
      $('#vote-down-count'+TID).empty().append(data.downs).fadeIn();
      $('#vote-up-count'+TID).empty().append(data.ups).fadeIn();
    } else {
      $('#vote-down-count'+TID).empty().append("0").fadeIn();
      $('#vote-up-count'+TID).empty().append("0").fadeIn();      
    }
    });
}

function getTraitsAll() {
   var query = "SELECT PID, TID, text FROM " + TRAITS;
   ft2json.query(query, function(result) {
    });
}

//Get traits function (fetch all traits for PID)

//Vote up funtion for a given TID
//Vote down function for a given TID
function getTraitsByPerson(PID) {

  $('#traits-ul').empty();
   var query = "SELECT PID, TID, text FROM " + TRAITS + " WHERE PID="+PID;
   ft2json.query(query, function(result) {

      for (var i=0; i<result.data.length; i++) {
        //trait id
        var id= result.data[i].TID;
      	$('.trait-container ul').append("<li id='"+id+"'>"+result.data[i].text+

          //@RUI: replace with getVotes(trait_id), with proper trait id
          '<a id="vote-up'+id+'" class="vote-btn gray button vote-up">Agree <span id=vote-up-count'+id+'>'+'0'+'</span></a>'+
          '<a id="vote-down'+id+'" class="vote-btn gray button vote-down">Disagree <span id=vote-down-count'+id+'>'+'0'+'</span></a></li>');
      	
        getVotes(id);
    
        $('#vote-up'+id).on('click', function(){
          var trait_ID = this.parentNode.id;
          $.post(proxy, 
            {action: 'update_vote', TID: trait_ID, columnName: 'ups'},
            function(data) {
              getVotes(trait_ID);
              getSummedVotesByPerson (curr_PID);
            }); //end post

          

          return false;
        }); //click vote up
             

        $('#vote-down'+id).on('click', function(){
          var trait_ID = this.parentNode.id;
          $.post(proxy, 
            {action: 'update_vote', TID: trait_ID, columnName: 'downs'},
            function(data) {
              getVotes(trait_ID);
              getSummedVotesByPerson (curr_PID);
            }); //end post

          
          return false;
        }); //click vote down
      } //end for

      //this logic should be in the main function
     if (PID==user_PID) { //only able to add a trait for yourself.
       var trait_form = "<input id='new-trait-text' type='text' class='new-trait-input' placeholder='New Trait'/> <input id='add-trait' name='add-trait' type='submit' value ='Add'/>";
        $('#traits-ul').prepend("<li class='new-trait-li'>"+trait_form+'</li>');
          // Logged in user can add new traits for other to vote on
            $('#add-trait').click(function(){ 
            $('.new-trait-li p').empty();
            addNewTrait(user_PID);
            return false;
            });
     }
    });

}

function addNewTrait(PID) {
  var new_trait = $('#new-trait-text').val();
  if (new_trait == '' || validateText(new_trait) == false){
    $('<p class="warning">Traits can only be characters.</p>').appendTo('.new-trait-li');
  } else {
    $('#traits-ul').append("<li class='new-trait-li'>"+new_trait+'</li>');
    $.post(proxy, {action: 'add_trait', PID: PID, trait: new_trait});
  }
}

//validate Text is only char
function validateText (textval) { 
  var textregex = /[A-Za-z]/;
  return textregex.test(textval);
}

//gets the user's name and updates the UI
function getUserName(PID) {
  var query = "SELECT name FROM " + PEOPLE + " WHERE PID='"+PID+"'";

   ft2json.query(query, function(result) {
      if (result.data==null) {
        $('#PID-name').empty().append("").fadeIn();
      } else {
        $('#PID-name').empty().append(result.data[0].name).fadeIn();
      }
    });

}

function getTraitsByTID(TID) {
   var query = "SELECT PID, TID, text FROM " + TRAITS + " WHERE TID="+TID;
   ft2json.query(query, function(result) {
    });
}
function getTraitsAndVotesByPerson(PID) {
  var query = "SELECT TID, text, ups, downs FROM " + TRAITS_VOTES + " WHERE PID="+PID;
   ft2json.query(query, function(result) {
    });
}

function getSummedVotesByPerson (PID) {
  var query = "SELECT sum(ups) as sumups, sum(downs) as sumdowns FROM " + TRAITS_VOTES + " WHERE PID="+PID;
   ft2json.query(query, function(result) {
      var data=result.data[0]; //only 1 result 
      if (data ==null) {
        $('#summed-votes').empty().append("0").fadeIn();
      } else {
        var sum = parseInt(data.sumups)+parseInt(data.sumdowns);
        $('#summed-votes').empty().append(sum).fadeIn();
      }
      
    });
}



//update current screen - 1) get name, 2) Get Traits, 3) get votes for up and down, 4) get summed vote count 
function refresh_screen(){
  getTraitsByPerson(curr_PID);

  getUserName(curr_PID);

  //update total trait count 
  //
  getSummedVotesByPerson (curr_PID);
}