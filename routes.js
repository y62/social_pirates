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
    return res.sendFile(__dirname + '/frontend/views/sign_up.ejs');
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


app.get('/members',(req, res) => {
    if (req.session.loggedin) {
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
    }
    else {
        res.redirect('/')
    }
   
});



app.get('/add', (req, res) => {
        res.render('sign_up', {
            title: "BLIV EN PIRAT"
        });
});


app.post('/save',  (req, res) => {
    const name = req.body.name;
    const telephone = req.body.telephone;
    const email = req.body.email;
    const password = req.body.password;
    const data = {name, telephone, email, password};
    let sql = "INSERT INTO members SET ?";
    connection.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

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




app.get('/events',(req, res) => {
    if (req.session.loggedin) {
         let sql = "SELECT * FROM events";
    let query = connection.query(sql, (err, rows) => {
        if (!err) {
            res.render('events_page', {
                title: "Events_page",
                events: rows
            });
        } else {
            throw err;
        }
    });
    }
    else {
        res.redirect('/')
    }
   
});

app.get('/createEvent', (req, res) => {
    if (req.session.loggedin) {
        res.render('create_event', {
            title: "Opret Coding Pirates Event"
        }) 
    }
})

app.post('/save_event',  (req, res) => {
    const event_name = req.body.event_name;
    const event_date = req.body.event_date;
    const event_time = req.body.event_time;
    
    const data = {event_name, event_date, event_time};
    let sql = "INSERT INTO events SET ?";
    connection.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/events');
    });
});