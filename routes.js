const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const database = require('./database');
const createError = require("http-errors");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("frontend"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.set('views',path.join(__dirname,'frontend/views'));
app.set('view engine', 'ejs');



app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.post('/auth', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
        connection.query('SELECT * FROM members WHERE email = ? AND password = ?', [email, password], (error, results, fields) => {
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.email = email;
                res.redirect('/home');
            } else {
                res.redirect('/');
                res.end();
            }
        });
    } else {
        res.send('Indtast Email / Adgangskode');
        res.end();
    }
});

app.get('/logout',function(req,res){
    req.session.destroy((err) => {
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect('/');
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
});

app.get('/resetPassword', (req, res) => {
    return res.sendFile(__dirname + '/frontend/resetPassword.html');
});

app.get('/information', (req, res) => {
    return res.sendFile(__dirname + '/frontend/information.html');
});

app.get('/resetPassword', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html')
});

app.get('/createMember', (req, res) => {
    return res.sendFile(__dirname + '/frontend/views/createMember.ejs');
});

app.get('/contact', (req, res) => {
    return res.sendFile(__dirname + '/frontend/contact.html');
});

app.get('/adminHome', (req, res) => {
    return res.sendFile(__dirname + '/frontend/adminHome.html');
});

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        return res.sendFile(__dirname + '/frontend/home.html');
    } else {
        res.sendFile(__dirname + '/frontend/index.html');
    }
});

app.post('/saveM',(req, res) => {

    let data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        telephone: req.body.telephone,
        email: req.body.email,
        password: req.body.password
    };
    let sql = "INSERT INTO members SET ?";

    let query = connection.query(sql, data,(err, results) => {
        if(err) throw err;
        console.log(err);
        res.redirect('/members');
    });
});

//READ

//read(get) all members
app.get('/members',(req, res) => {

    let sql = "SELECT * FROM members";
    let query = connection.query(sql, (err, rows) => {
        if (!err) {
            res.render('members_list', {
                title: "Members_list",
                members: rows
            });
        } else {
            throw err;
        }
    });
});
// UPDATE
// update a member
app.get('/update/:memberId',(req, res) => {
    const member_id = req.params.member_id;
    let sql = `SELECT * from members where member_id = ${member_id}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.render('updateMember', {
            title: "Edit member Info ",
            member_id: result [0],

        });
    });
});

app.post('/updated',(req, res) => {



    const member_id = req.body.member_id;
    let sql = `UPDATE members SET
            first_name = '"+ req.body.first_name +"',
            last_name= '"+ req.body.last_name +"',
            telephone = '"+ req.body.telephone +"',
            email = '"+ req.body.email +"',
            password = '"+ req.body.password
            }+"' WHERE member_id = ${member_id};`;
    let query = connection.query(sql,(err, results) => {
        if(err) throw err;
        res.redirect('/members');


    });
});


// delete
app.get('/deleteMember/:member_id',(req, res) => {

    const member_id = req.params.member_id;
    let sql = `DELETE from members where member_id = ${member_id}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        // console.log(query)
        res.redirect('/members');
    });
});

app.listen(port, () => {
    console.log("Server is running on port: ", port)
});
