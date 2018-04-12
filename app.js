const http = require('http');
const net = require('net');

const hostname = '127.0.0.1';
const port = 8080;

var results = [];
var recording = false;

const server = http.createServer((req, res) => {
        // Handle Requests
        if (req.method === 'GET' && req.url === '/record') {
                // Start recording responses
                // Return: Timestamp of start of recording
                
                recording = true;
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/JSON');
                res.end(JSON.stringify({"time": Date.now()}));

        } else if (req.method === 'GET' && req.url === '/stop') {
                // Stop recording responses
                // Return: responses in JSON
                
                recording = false;
                res.statusCode = 200;
                res.setHeader('content-type', 'text/JSON');
                res.end(JSON.stringify(results));

        } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Error: This is not a valid endpoint\n');
        }
});

server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
});

const eyeConn = net.createConnection(6555, "localhost", () => {
        console.log("Connected to Eyetribe");
        eyeConn.write(JSON.stringify(
                {category:"tracker",
                 request:"set",
                 values: {
                        push: true,
                        version:  1
                 }
                })
        );
                                      
});

eyeConn.on('data', (data) => {
        entries = data.toString().split("\n");
        for (var i = 0; i < entries.length - 1; i++) {
                entry = JSON.parse(entries[i]);
                if (entry["category"] === "tracker") {
                        console.log(entry);
                        if ((entry["values"] != undefined) && recording) {
                                console.log("writing")
                                results.push(entry["values"]["frame"]);
                        }
                }
        }
                
});

eyeConn.on('end', () => {
        console.log("Disconnected from EyeTribe!");
});

// Die gracefully to ctrl-C
process.on('SIGINT', function() {
            console.log("ded");
            process.exit();
});
