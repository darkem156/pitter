const { query, User, Follow, Publication } = require('./models.js')

const user = async (req, res) =>
{
  const { id } = req.params;
  const data = await User.findOne({ where: { id } })
  if (!data) 
  {
    res.status(404).json({ name: "Este Usuario No Existe" })
    return;
  }

  const followers = (await Follow.findAndCountAll({ where: { id_following: id } })).count
  const following = (await Follow.findAndCountAll({ where: { id_follower: id } })).count

  const publications = (await Publication.findAll({ where: { id_user: id } })).map(publication => (
    {
      content: publication.content,
      date: publication.createdAt
    }
  ))
  const followed = req.session.id_user ? 
    Boolean(await Follow.findOne({ where: { id_follower: req.session.id_user, id_following: id } })) 
    : false

  res.json({
    name: data.name,
    id: data.id,
    user_name: data.user_name,
    publications,
    followers,
    following,
    followed
  });
}

const follow = async (req, res) =>
{
  const { id } = req.params;
  const { id_user } = req.session;
  if(!id_user) 
  {
    res.status(401).json({ error: "Debes iniciar sesion para seguir a un usuario" })
    return;
  }
  else if(id_user === id) 
  {
    res.status(409).json({ followed: "no te puedes seguir a ti mismo" });
    return;
  }

  const follow = await Follow.create({ id_follower: id_user, id_following: id })
  
  res.status(201).json({ followed: "followed" });
}

const unFollow = async (req, res) =>
{
  const { id_user } = req.session;
  const { id } = req.params;
  
  if(!id_user) 
  {
    res.status(401).json({ error: "Debes iniciar sesion para seguir a un usuario" })
    return;
  }

  const follow = await Follow.findOne({ where: { id_follower: id_user, id_following: id } })
  await follow.destroy();

  res.json({followed: "unfollowed"});
}

module.exports = { user, follow, unFollow }
