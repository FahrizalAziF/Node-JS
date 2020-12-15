//---------------------------------Routing-----------------


var http = require('http');
var url = require('url');
var routes = require('routes')();
var view = require('swig');
var mysql = require('mysql');
var qString = require('querystring');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    database: 'tb_mahasiswa',
    password: ''
});


routes.addRoute('/', function (req, res) {
    var html = view.compileFile('./template/index.html');
    var output = html({
        pagename: 'Fahrizal Azi F'
    });
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.end(output);
});
routes.addRoute('/about', function (req, res) {
    var html = view.compileFile('./template/about.html');
    var output = html({
        pagename: 'Fahrizal Azi F'
    });
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.end(output);
});

routes.addRoute('/form', function (req, res) {

    if (req.method.toUpperCase() == "POST") {
        var data_post = "";
        req.on('data', function (chuncks) {
            data_post += chuncks;
        });

        req.on('end', function () {
            data_post = qString.parse(data_post);
            connection.query("insert into mahasiswa set ?", data_post, function (err, field) {
                if (err) throw err;

                res.writeHead(302, {
                    "Location": "/student"
                });
                res.end();
            })
        });
    } else {
        var html = view.compileFile('./template/form.html')();
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(html);
    }

});


routes.addRoute('/mahasiswa', function (req, res) {

    connection.query("select * from mahasiswa", function (err, rows, field) {
        if (err) throw err;
        //Tampil Keseluruhan
        //console.log(rows);

        //Tampil Satu Field
        /*rows.forEach(function (item) {
            console.log(item.nama);
            console.log(item.nim);
        });*/

        //Tampil JSON
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });
        res.end(JSON.stringify(rows));
    });
});

routes.addRoute('/student', function (req, res) {
    connection.query("select * from mahasiswa", function (err, rows, field) {
        if (err) throw err;

        var html = view.compileFile('./template/student.html');
        var output = html({
            title: "Data Mahasiswa",
            data: rows
        });
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(output);
    });
});

routes.addRoute('/insert', function (req, res) {
    connection.query('insert into mahasiswa set ?', {
        nim: "E41172259",
        nama: "Ega Kustian",
        prodi: "TIF"
    }, function (err, field) {
        if (err) throw err;

        res.writeHead(200, {
            "Content-Type": "text/plain"
        });
        res.end(field.affectedRows + " Affected Rows");
    });

});

routes.addRoute('/update/:nim', function (req, res) {

    connection.query('select * from mahasiswa where ?', {
        nim: this.params.nim
    }, function (err, rows, field) {
        if (rows.length) {
            var data = rows[0];
            if (req.method.toUpperCase() == "POST") {
                var data_post = "";
                req.on('data', function (chucks) {
                    data_post += chucks;
                });

                req.on('end', function () {
                    data_post = qString.parse(data_post);
                    connection.query('update mahasiswa set ? where ?', [
                        data_post,
                        {
                            nim: data.nim
                        }
                    ], function (err, field) {
                        if (err) throw err;


                        res.writeHead(302, {
                            "Location": "/student"
                        });
                        res.end();
                    });
                });

            } else {
                var html = view.compileFile('./template/update.html');
                var output = html({
                    data: data
                });
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(output);
            }
        } else {
            var html = view.compileFile('./template/404.html')();
            res.writeHead(202, {
                "Content-Type": "text/html"
            });
            res.end(html);
        }
    })

});

routes.addRoute('/delete/:nim', function (req, res) {
    connection.query('delete from mahasiswa where ?', {
        nim: this.params.nim
    }, function (err, field) {
        if (err) throw err;
        res.writeHead(302, {
            "Location": "/student"
        });
        res.end()
    })
})

routes.addRoute('/about/:nama?/:alamat?', function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.end("About Page ==>" + this.params.nama + " Alamatnya " + this.params.alamat);
});


http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    var match = routes.match(path);
    if (match) {
        match.fn(req, res);
    } else {
        var html = view.compileFile('./template/404.html')();
        res.writeHead(404, {
            "Content-Type": "text/html"
        });
        res.end(html);
    }
}).listen(8888);
console.log("Server is running...")