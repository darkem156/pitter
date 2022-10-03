const express = require('express');
const database = require('../database');
const publish = require('../functions/publish');
const router = express.Router();
 
router.get('/:id', async (req, res)=>
{
    const data = await database.query(`SELECT * FROM publicaciones where id_pub = ${req.url.split("/")[1]}`);
  if(data[0]) res.json(data);
  else res.status(404).json({error: "Esta publicacion no existe"});
});

router.post('/publish', async (req, res) =>
{
  let published = publish.publish(parseInt(req.session.id_user), req.body.content);
  res.status(201).json(published);
})

module.exports = router;
