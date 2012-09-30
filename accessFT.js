var VOTES ='14w9xxUiqvHKWfRTBPk0NAJsF2_PFVaFHP87PqJ4',
TRAITS='1ucB6tnSm5cavx5_h0_NkvT_PM1iMUW-oMjJHBV0',
PEOPLE='1Atg0L0fIT2FZG0v50jKa7qR6JEydPcfJ6OHQQDM',
TRAITS_VOTES='1mvttpDkpEw6kLGQqdr29hFtlUaD6WHf6FCfBiyo',
API_KEY='AIzaSyB-RXon7sorCRGKIOg5JF4vTsTn2NTEb3U';


function getVotesAll() {
  var query = "SELECT TID, ups, downs FROM " + VOTES;
  ft2json.query(query, function(result) {
    console.log(result);
    $("#ft-data").html(result);
    });
}
function getVotes(TID) {
  var query = "SELECT TID, ups, downs FROM " + VOTES + " WHERE TID="+TID;
  ft2json.query(query, function(result) {
    console.log(result);
    });
}

function getTraitsAll() {
   var query = "SELECT PID, TID, text FROM " + TRAITS;
   ft2json.query(query, function(result) {
      console.log(result);
    });
}
function getTraitsByPerson(PID) {
   var query = "SELECT PID, TID, text FROM " + TRAITS + " WHERE PID="+PID;
   ft2json.query(query, function(result) {
      console.log(result);
    });
}
function getTraitsByTID(TID) {
   var query = "SELECT PID, TID, text FROM " + TRAITS + " WHERE TID="+TID;
   ft2json.query(query, function(result) {
      console.log(result);
    });
}
function getTraitsAndVotesByPerson(PID) {
  var query = "SELECT TID, text, ups, downs FROM " + TRAITS_VOTES + " WHERE PID="+PID;
   ft2json.query(query, function(result) {
      console.log(result);
    });
}