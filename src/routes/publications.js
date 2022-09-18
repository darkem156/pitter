const express = require('express');
const database = require('../database');
const publish = require('../functions/publish');
const router = express.Router();
 
router.get('/:id', async (req, res)=>
{
    const data = await database.query(`SELECT * FROM publicaciones where id_pub = ${req.url.split("/")[1]}`);
    res.json(data);
});

router.post('/publish', async (req, res) =>
{
  let published = await publish.publish(parseInt(req.session.id_user), req.body.content);
  res.json(published);
})

module.exports = router;
