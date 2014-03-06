var express = require("express");
var crypto = require("crypto");
var fs = require("fs");

var default_size = 2048;
var log_file = fs.createWriteStream("./random.log", {flags: "a"});

var app = express();

app.use(express.logger({stream: log_file}));

app.get("/random/help", function(req, res) {
  fs.readFile("./help.txt", function(err, buffer) {
    res.setHeader("Content-Type", "text/plain");
    res.send(buffer.toString());
    res.end();
  });
});

app.get("/random", function(req, res) {
  var querySize;
  var randomString = "";
  var format = "plain";
  var encoding = "hex";
  var output;

  if (req.query.format)
    format = req.query.format;

  if (parseInt(req.query.size) < Math.pow(2, 16))
    querySize = parseInt(req.query.size);

  if (req.query.encoding === "number") {
   encoding = "number";
  }

  var randomBytes =  crypto.randomBytes(querySize || default_size); 
  
  if (encoding === "hex") {
    randomString = randomBytes.toString("hex");
  }
  else if (encoding === "number") {
    for (var i = 0; i < randomBytes.length; i++) {
      randomString += randomBytes[i];
    }
  }

  if (format === "pretty") {
    output = "<p style='overflow-wrap: break-word'>"
    + randomString
    + "</p>";
  }
  else if (format === "plain") {
    res.header("Content-Type", "text/plain");
    output = randomString;
  }

  res.send(output);
  res.end();
});

app.listen(8898);
