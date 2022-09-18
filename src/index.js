//init server
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MySQLDB = require('express-mysql-session');
const database = require('./database');
const app = express();
const publish = require('./functions/publish');
const follow = require('./functions/follow');

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
        secret: 'xdjwmknchewcimkchvjmKFBV1oejucjbhi32ubufo3w1b',
        store: sessionStorage,
        resave: false,
        saveUninitialized: true
    }
))

//routes
app.use('/api/publication', require('./routes/publications'));
app.use('/api', require('./routes/sign'));

app.post('/api/initSession', (req, res) =>
{
    console.log(req.session);
    info = req.session;
    if(req.body.session === true)
    {
        console.log(req.session.id_user);
        if(req.session.id_user > 0) 
        {
            res.json({"sesion": "true", "id_user": req.session.id_user});
            return;
        }
        console.log(req.session.id_user>0);
        res.json({"sesion": "false"})
        return;
    }
    else
    {
        req.session.id_user = req.body.id_user;
        req.session.user = req.body.user;
        req.session.name = req.body.name;
        console.log(req.session.id_user);
        res.json({"sesion": "true"});
        return;
    }
})

app.get('/api/getPublications', async (req, res) =>
{
    if (req.session.id_user > 0) 
    {
        console.log(req.session.id_user);
        let data = await database.query(`SELECT * FROM publicaciones JOIN users ON id_usuario = id JOIN following ON id_usuario = id_following WHERE id_follower = ${parseInt(req.session.id_user)} ORDER BY date DESC`)
        //let date = (new Date(`${new Date().getFullYear()}-0${new Date().getMonth()+1}-${new Date().getDate()}`)).toJSON().split('T')[0];
        let date = new Date();
        date = parseInt(`${date.getFullYear()}0${date.getMonth()+1}${date.getDate()-1}000000`);
        if(!data[0]) data = await database.query(`SELECT * FROM publicaciones JOIN users ON (id_usuario = id) WHERE date > ${date} ORDER BY date DESC`);
        res.json(data);
    }
})

app.get('/user/:id', async (req, res) =>
{
    if(parseInt(req.url.split('/')[2]) === req.session.id_user) res.send('el usuario es el mismo');
    else res.sendFile(__dirname + '/public/user/user.html');
})

app.get('/api/user/:id', async (req, res)=>
{
    let id = req.url.split("/")[3];
    const data = await database.query(`SELECT * FROM users where id = ${id}`);
    if (data[0])
    {
        const followers = await database.query(`SELECT count(*) FROM following WHERE id_following = ${id}`);
        const following = await database.query(`SELECT count(*) FROM following WHERE id_follower = ${id}`);
        const publications = await database.query(`SELECT * FROM publicaciones WHERE id_usuario = ${id} ORDER BY date DESC`);
        let followed = req.session.id_user ? await database.query(`SELECT * FROM following WHERE id_follower = ${parseInt(req.session.id_user)} AND id_following = ${id}`) : false;
        if(followed[0]) data[0].followed = true;
        else data[0].followed = false;
        console.log(data[0].id);
        data[0].followers = followers[0]['count(*)']
        data[0].following = following[0]['count(*)']
        data[0].publications = publications;
        res.json(data);
    }
    else res.json([{"name": "Este Usuario No Existe"}]);
});

app.get('/api/user/:id/follow', async (req, res) =>
{
    let id = req.url.split("/")[3];
    let followed = follow.follow(id, parseInt(req.session.id_user));
    res.json(followed);
})

app.get('/api/user/:id/unFollow', async (req, res) =>
{
    let id = req.url.split("/")[3];
    let followed = follow.unFollow(id, parseInt(req.session.id_user));
    res.json({"followed": "unfollowed"});
})

//static files
app.use(express.static(__dirname + '/public'));

//initializing
app.listen(
    app.get('port'), () => {
        console.log('Server on port', app.get('port'));
    }
)
