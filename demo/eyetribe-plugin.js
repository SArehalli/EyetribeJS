jsPsych.plugins['eyetribe-demo'] = (function(){

    var plugin = {}

    function httpGetAsync(theUrl, callback) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() { 
                            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                                        callback(xmlHttp.responseText);
                        }
            xmlHttp.open("GET", theUrl, true); // true for asynchronous 
            xmlHttp.send(null);
    }
    plugin.info = {
            name: 'eyetribe demo',
            parameters: {
            }
    }

    plugin.trial = function(display_element, trial) {
            display_element.innerHTML = "<canvas id='canvas' width='2560' height='1440'></canvas>";
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');

            function update() {
                httpGetAsync("http://localhost:8080/eyepos", draw); 
                setTimeout(update, 100);
            }

            function draw(dataString) {
                var data = JSON.parse(dataString);
                const radius = 3;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.strokeRect(data["avg"]["x"] - radius,  data["avg"]["y"] - radius, 2 * radius, 2 * radius);
            }
            httpGetAsync("http://localhost:8080/record", update);



    }
    return plugin
})();
