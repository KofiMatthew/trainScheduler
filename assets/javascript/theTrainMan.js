
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAKrcC1jWFlvXAk4jFXtg_S5hq_4RcTaLI",
    authDomain: "firstfireb.firebaseapp.com",
    databaseURL: "https://firstfireb.firebaseio.com",
    projectId: "firstfireb",
    storageBucket: "firstfireb.appspot.com",
    messagingSenderId: "207436569646"
  };
  firebase.initializeApp(config);

$(document).ready(function() {

    var database = firebase.database();
// Initial Values
var name = "";
var dest = "";
var start = 0;
var freq = "";
// Capture Button Click
$("#add-train").on("click", function(event) {
    event.preventDefault();

    // Grabbed values from text boxes
    name = $("#name-input").val().trim();
    dest = $("#dest-input").val().trim();
    start = $("#start-input").val().trim();
    freq = $("#freq-input").val().trim();

    if (name != "" && dest != "" && start != "" && freq != "" ){
    // Code for handling the push
    database.ref().push({
      name: name,
      dest: dest,
      start: start,
      freq: freq,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    })};
  });

  database.ref().on("child_added", function(snapshot) {
    //variables for new rows
    var sv = snapshot.val();
    var trainName = (sv.name);
    var destination = (sv.dest);
    var startTime = (sv.start);
    var frequency = (sv.freq);

    //calculating next arrival & minutes away
    var first = moment(startTime, "HH:mm");
    var diff = moment().diff(first, 'minutes');
	var fromFirst = (Math.floor(diff / frequency) + 1) * frequency;
    var next = first.add(fromFirst, 'minutes');
    var minAway = next.diff(moment(), 'minutes') + 1;
    var nextArr = next.format('LT');

    // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextArr),
    $("<td>").text(minAway),
  );
  $("#train-table > tbody").append(newRow);

    // Handle the errors
  }, 
  function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
});