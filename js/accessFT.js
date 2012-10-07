var VOTES ='14w9xxUiqvHKWfRTBPk0NAJsF2_PFVaFHP87PqJ4',
TRAITS='1ucB6tnSm5cavx5_h0_NkvT_PM1iMUW-oMjJHBV0',
PEOPLE='1Atg0L0fIT2FZG0v50jKa7qR6JEydPcfJ6OHQQDM',
TRAITS_VOTES='1mvttpDkpEw6kLGQqdr29hFtlUaD6WHf6FCfBiyo',
API_KEY='AIzaSyB-RXon7sorCRGKIOg5JF4vTsTn2NTEb3U';


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

  $('ul').empty();
   var query = "SELECT PID, TID, text FROM " + TRAITS + " WHERE PID="+PID;
   ft2json.query(query, function(result) {
   console.log(result);
      for (var i=0; i<result.data.length; i++) {

        var id= result.data[i].TID;
      	$('ul').append("<li id='"+id+"'>"+result.data[i].text+
          '<a id="vote-up'+id+'" class="vote-btn gray button vote-up">Agree</a>'+
          '<a id="vote-down'+id+'" class="vote-btn gray button vote-down">Disagree</a></li>');
      	 

        //console.log($('ul #'+result.data[i].TID+' #vote-up'));
        $('#vote-up'+id).on('click', function(){
          var trait_ID = this.parentNode.id;
          console.log(trait_ID);
          $.post('http://people.ischool.berkeley.edu/~ruidai/cgi-bin/proxy.py', 
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
          $.post('http://people.ischool.berkeley.edu/~ruidai/cgi-bin/proxy.py', 
            {action: 'update_vote', TID: trait_ID, columnName: 'downs'},
            function(data) {
              //@Michael: update the vote count in UI
              console.log('updated vote');

            }); //end post
          return false;


        }); //click vote down
      } //end for


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


});

  // $('.carousel').load('people.html', function(){
  //   console.log($('.carousel-item:first-child')[0]);
  //   $('.carousel-item:first-child').show();


  // });
getTraitsByPerson(0);

