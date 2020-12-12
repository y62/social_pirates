const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const database = require('./database');

const app = express();
const port = 8080;

app.use(express.static("frontend"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.set('views',path.join(__dirname,'frontend/views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
                res.send('Forkert Email eller Adgangskode');
            }
            res.end();
        });

    } else {
        res.send('Indtast Email / Adgangskode');
        res.end();
    }
});

app.get('/', (req, res) => {
    req.session.loggedin = false;
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
    return res.sendFile(__dirname + '/frontend/createMember.html');
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
        res.send('Husk at logge ind!');
    }
    });

app.listen(port, () => {
    console.log("Server is running on port: ", port)
});
