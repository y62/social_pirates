const express = require("express");
const nodemon = require("nodemon");
const app = express();
const port = 8080;
app.use(express.static("frontend"));

//____________________________________________________________________________

app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/frontend/index.html');
});

app.get('/resetPassword', (req, res) => {
    return res.sendFile(__dirname + '/frontend/resetPassword.html');
});

app.get('/information', (req, res) => {
    return res.sendFile(__dirname + '/frontend/information.html');
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

app.listen(port, () => {
    console.log("Server is running on port: ", port)
});