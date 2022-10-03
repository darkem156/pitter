const express = require('express');
const database = require('../database');
const follow = require('../functions/follow.js')
const router = express.Router();
 
router.get('/getPublications', async (req, res) =>
{
    if (req.session.id_user > 0) 
    {
        let data = await database.query(`SELECT * FROM publicaciones JOIN users ON id_usuario = id JOIN following ON id_usuario = id_following WHERE id_follower = ${parseInt(req.session.id_user)} ORDER BY date DESC`)
        let date = new Date();
        date = parseInt(`${date.getFullYear()}0${date.getMonth()+1}${date.getDate()-1}000000`);
        if(!data[0]) data = await database.query(`SELECT * FROM publicaciones JOIN users ON (id_usuario = id) WHERE date > ${date} ORDER BY date DESC`);
        res.json(data);
    }
  else res.status(403).json({ error: "Must login" })
})

router.get("/getSession", (req, res) =>
{
  if(req.session.id_user) res.json({ session: true, id_user: req.session.id_user })
  else res.json({ session: false });
})

module.exports = router;
