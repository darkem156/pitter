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

  if(!req.session.id_user) res.status(401).json({ error: "Necesitas iniciar sesion para publicar" })
  else if(published.error) res.status(400).json(published)
  else res.status(201).json(published)
})

module.exports = router;
