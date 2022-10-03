const express = require('express');
const database = require('../database');
const follow = require('../functions/follow.js')
const router = express.Router();
 
router.get('/:id', async (req, res)=>
{
    const { id } = req.params;
    const data = await database.query(`SELECT * FROM users where id = ${id}`);
    if (data[0])
    {
        const followers = await database.query(`SELECT count(*) FROM following WHERE id_following = ${id}`);
        const following = await database.query(`SELECT count(*) FROM following WHERE id_follower = ${id}`);
        const publications = await database.query(`SELECT * FROM publicaciones WHERE id_usuario = ${id} ORDER BY date DESC`);
        const followed = req.session.id_user ? await database.query(`SELECT * FROM following WHERE id_follower = ${parseInt(req.session.id_user)} AND id_following = ${id}`) : false;
        if(followed[0]) data[0].followed = true;
        else data[0].followed = false;
        data[0].followers = followers[0]['count(*)']
        data[0].following = following[0]['count(*)']
        data[0].publications = publications;
        res.json(data);
    }
    else res.status(404).json([{"name": "Este Usuario No Existe"}]);
});

router.get('/:id/follow', async (req, res) =>
{
    const { id } = req.params;
    const followed = follow.follow(id, parseInt(req.session.id_user));
    res.status(201).json(followed);
})

router.get('/:id/unFollow', async (req, res) =>
{
    const { id } = req.params;
    const followed = follow.unFollow(id, parseInt(req.session.id_user));
    res.status(205).json({"followed": "unfollowed"});
})

module.exports = router;
