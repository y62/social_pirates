const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const database = require('./database');


const app = express();
const port = 8080;

app.use(express.static("frontend/public"));
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
    res.sendFile(path.join(__dirname + '/frontend/public/index.html'));
});

app.get('/resetPassword', (req, res) => {
    return res.sendFile(__dirname + '/frontend/public/resetPassword.html');
});

app.get('/information', (req, res) => {
    return res.sendFile(__dirname + '/frontend/public/information.html');
});

app.get('/contact', (req, res) => {
    return res.sendFile(__dirname + '/frontend/public/contact.html');
});

app.get('/adminHome', (req, res) => {
    return res.sendFile(__dirname + '/frontend/adminHome.html');
});

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        return res.sendFile(__dirname + '/frontend/home.html');
    } else {
        res.sendFile(__dirname + '/frontend/public/index.html');
    }
});


app.get('/pirates_page',(req, res) => {
    if (req.session.loggedin) {
         let sql = "SELECT * FROM members";
    let query = connection.query(sql, (err, rows) => {
        if (!err) {
            res.render('pirates_page', {
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



app.get('/add_member', (req, res) => {
        res.render('add_member', {
            title: "Opret Nyt Medlem!"
        });
});

app.post('/save_member',  (req, res) => {
    const name = req.body.name;
    const telephone = req.body.telephone;
    const email = req.body.email;
    const password = req.body.password;
    const data = {name, telephone, email, password};
    let sql = "INSERT INTO members SET ?";
    connection.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/pirates_page');
    });
});

app.get('/update/:memberId',(req, res) => {
    const memberId = req.params.memberId;
    let sql = `Select * from members where id = ${memberId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('update_member', {
            title : 'Opdater Pirat Medlem!',
            user : result[0]
        });
    });
});


app.post('/update',(req, res) => {
    const memberId = req.body.id;
    let sql = "update members SET name='"+req.body.name+"',  email='"+req.body.email+"',  telephone='"+req.body.telephone+"', password='"+req.body.password+"' where id ="+memberId;
    let query = connection.query(sql,(err, results) => {
        if(err) throw err;
        res.redirect('/pirates_page');
    });
});


// delete
app.get('/deleteMember/:member_id',(req, res) => {
    const member_id = req.params.member_id;
    let sql = `DELETE from members where id = ${member_id}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        // console.log(query)
        res.redirect('/pirates_page');
    });
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

// delete event
app.get('/deleteEvent/:event_id',(req, res) => {
    const event_id = req.params.event_id;
    let sql = `DELETE from events where id = ${event_id}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        // console.log(query)
        res.redirect('/events');
    });
});

app.get('/update_event/:event_id',(req, res) => {
    const event_id = req.params.event_id;
    if (req.session.loggedin) {
         let sql = `SELECT * FROM events WHERE id =${event_id}`;
         let query = connection.query(sql, (err, result) => {
        if (!err) {
            res.render('update_event', {
                title: "Update Event",
                event: result[0]
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

app.post('/updateEvent',(req, res) => {
    const event_Id = req.body.id;
    let sql = "UPDATE events SET event_name='"+req.body.event_name+"',  event_date='"+req.body.event_date+"',  event_time='"+req.body.event_time+"' where id ="+event_Id;
    let query = connection.query(sql,(err, results) => {
        if(err) throw err;
        res.redirect('/events');
    });
});



app.get('/volunteers_page',(req, res) => {
    if (req.session.loggedin) {
         let sql = "SELECT * FROM volunteers";
    let query = connection.query(sql, (err, rows) => {
        if (!err) {
            res.render('volunteers_page', {
                title: "Volunteers_list",
                volunteers: rows
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

app.get('/add_volunteer', (req, res) => {
    res.render('add_volunteer', {
        title: "Opret ny frivillig!"
    });
});


app.post('/save_volunteer',  (req, res) => {
    const volunteer_first_name = req.body.volunteer_first_name;
    const volunteer_last_name = req.body.volunteer_last_name;
    const volunteer_telephone = req.body.volunteer_telephone;
    const volunteer_email = req.body.volunteer_email;
    const volunteer_password = req.body.volunteer_password;
    const data = {volunteer_first_name, volunteer_last_name, volunteer_telephone, volunteer_email, volunteer_password};
    let sql = "INSERT INTO volunteers SET ?";
    connection.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/volunteers_page');
    });
});


// delete
app.get('/deleteVolunteer/:volunteer_id',(req, res) => {
    const volunteer_id = req.params.volunteer_id;
    let sql = `DELETE from volunteers where id = ${volunteer_id}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        // console.log(query)
        res.redirect('/volunteers_page');
    });
});


app.get('/updateVolunteers/:volunteer_id',(req, res) => {
    const volunteer_id = req.params.volunteer_id;
    let sql = `Select * from volunteers where id = ${volunteer_id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('update_volunteers', {
            title : 'Opdater Frivillig Pirat Medlem!',
            user : result[0]
        });
    });
});


app.post('/updateVolunteer',(req, res) => {
    const volunteer_id = req.body.id;
    let sql = "update volunteers SET volunteer_first_name='"+req.body.volunteer_first_name+"',  volunteer_last_name='"+req.body.volunteer_last_name+"',  volunteer_telephone='"+req.body.volunteer_telephone+"', volunteer_email='"+req.body.volunteer_email+"', volunteer_password='"+req.body.volunteer_password+"' where id ="+volunteer_id;
    let query = connection.query(sql,(err, results) => {
        if(err) throw err;
        res.redirect('/volunteers_page');
    });
});



app.listen(port, () => {
    console.log("Server is running on port: ", port)
});

app.get('/ajax', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(__dirname + '/frontend/ajax.html') 
    }
})
