// Construct Timeline
timeline = [] 

var trial = {
    type: "eyetribe-demo"
}
timeline.push(trial);

//timeline.push(instructions_block);

// start the experiment 
jsPsych.init({
timeline: timeline,
on_finish: function() {
  jsPsych.data.addProperties({"rand_id": id});
  $.ajax({
    type:'post',
    cache: false,
    url: "save_data.php",
    data: {filename: id + ".csv", filedata: jsPsych.data.dataAsCSV()}
  });
  $.ajax({
    type:'post',
    cache: false,
    url: "save_data.php",
    data: {filename: id + ".json", filedata: jsPsych.data.dataAsJSON()}
  });
  $(".jspsych-display-element").html("The results have been recorded! Data was recorded under the subject ID: <b>" + id + "</b>");
}
});
