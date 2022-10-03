//init server
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MySQLDB = require('express-mysql-session');
const database = require('./database');
const app = express();

//settings
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(morgan('dev'));
app.use(express.json());

//sessions
const sessionStorage = new MySQLDB(database.options);
app.use(session(
    {
        key: 'cookie-session',
        secret: process.env.COOKIE_SECRET || 'secret',
        store: sessionStorage,
        resave: false,
        saveUninitialized: true
    }
))

//routes
app.use('/api/publication', require('./routes/publications'));
app.use('/api', require('./routes/sign'));
app.use('/api', require('./routes/api'));
app.use('/api/user', require('./routes/user'));

app.get('/user/:id', async (req, res) =>
{
    if(req.params.id === req.session.id_user) res.send('el usuario es el mismo');
    else res.sendFile(__dirname + '/public/user/user.html');
})

//static files
app.use(express.static(__dirname + '/public'));

module.exports = app;
