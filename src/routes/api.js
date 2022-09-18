const express = require('express');
const database = require('../database');
const follow = require('../functions/follow.js')
const router = express.Router();
 
router.get('/getPublications', async (req, res) =>
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

router.post('/initSession', (req, res) =>
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

module.exports = router;
