var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    database: 'tb_mahasiswa',
    password: ''
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});

app.get('/api/get', (req, res) => {
    let sql = "SELECT * FROM mahasiswa";
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
});


//Tambahkan data product baru
app.post('/api/post', (req, res) => {

    var nim = req.body.nim;
    var nama = req.body.nama;
    var prodi = req.body.prodi;

    connection.query('INSERT INTO mahasiswa (nim, nama,prodi) values (?,?,?)',
        [nim, nama, prodi],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok("Berhasil menambahkan user!", res)
            }
        });
});



app.listen(8888);
console.log("Server is running...");