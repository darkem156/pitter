const router = require('express').Router();
const { query } = require('../controllers/models.js');
const { signUp, signIn } = require('../controllers/sign.js');
const { getPublications, publish, publication } = require('../controllers/publication.js');
const { user, follow, unFollow } = require('../controllers/user.js');
 
router.get("/getSession", (req, res) =>
{
  if(req.session.id_user) res.json({ session: true, id_user: req.session.id_user })
  else res.status(401).json({ session: false });
})

router.post('/signUp', signUp)
router.post('/signIn', signIn)

router.get('/getPublications', getPublications)

router.get('/user/:id', user)
router.get('/user/:id/follow', follow)
router.get('/user/:id/unFollow', unFollow)

router.get('/publication/:id', publication)
router.post('/publication/publish', publish)

module.exports = router;
