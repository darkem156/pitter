const express = require('express');
const database = require('../database');
const publish = require('../functions/publish');
const router = express.Router();
 
router.get('/:id', async (req, res)=>
{
    const data = await database.dbConect(`SELECT * FROM publicaciones where id_pub = ${req.url.split("/")[1]}`);
    console.log(data[0].id_pub);
    res.json(data);
});
/*
router.post('/publish', async(req, res) =>
{
    let published = await publish.publish(parseInt(req.body.id_usuario), req.body.content);
    res.send("publicada");
})*/

module.exports = router;