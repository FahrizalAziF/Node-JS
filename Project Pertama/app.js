var http = require("http");
var fs = require("fs");
var url = require('url');
var qString = require('querystring');

http.createServer(function (req, res) {
    var kode = 0;
    var file = "";
    var access = url.parse(req.url);
    if (access.pathname == "/") {


        kode = 200;
        file = "index.html";
    } else if (access.pathname == "/about") {
        kode = 200;
        file = "about.html";
    } else if (access.pathname == "/form") {
        if (req.method.toUpperCase() == "POST") {
            var data_post = "";
            req.on('data', function (chunck) {
                data_post += chunck;
            });

            req.on('end', function () {
                data_post = qString.parse(data_post);
                res.writeHead(200, {
                    "Content_Type": "text/plain"
                });
                res.end(JSON.stringify(data_post));
            })

        }
        kode = 200;
        file = "form.html";
    } else if (access.pathname == "/json") {
        var data = qString.parse(access.query);
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });
        res.end(JSON.stringify(data));
        kode = 200;
        file = "json.html";
    } else {
        kode = 404;
        file = "404.html";
    }
    res.writeHead(kode, {
        "Content-Type": "text/html"
    });
    fs.createReadStream('./template/' + file).pipe(res);
}).listen(8888);

console.log("Server is running...");