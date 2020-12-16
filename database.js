const mysql = require('mysql');

connection = mysql.createConnection({
    host: 'database-2.c8e4q2gd2tmb.eu-central-1.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'adminadmin',
    database: 'pirate_db'
});

connection.connect((error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log('Database Connected!');
    }
});