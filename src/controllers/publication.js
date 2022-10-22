const { Publication, query } = require('./models.js');

const getPublications = async (req, res) =>
{
  if(!req.session.id_user) res.status(401).json({ error: "Must LogIn" })
  let data = await query(`SELECT * FROM Publications INNER JOIN Follows ON id_following=id_user  INNER JOIN Users ON id_user=Users.id WHERE id_follower=${ req.session.id_user } LIMIT 10;`)
  if(!data[0][0])
  {
    data = await query(`SELECT * FROM Publications INNER JOIN Users ON id_user = id ORDER BY Publications.createdAt DESC LIMIT 10`);
  }
  const publications = data[0].map(publication => ({
    content: publication.content,
    id_user: publication.id_user,
    date: publication.createdAt,
    name: publication.name,
    user_name: publication.user_name
  }
  ))
  res.json(publications);
}

const publication = async (req, res) =>
{
  const data = await Publication.findOne({ where: { id_pub: req.params.id } })

  if(data) res.json(data);
  else res.status(404).json({error: "Esta publicacion no existe"});
}

const publish = async (req, res) =>
{
  const { content } = req.body
  const { id_user } = req.session
  
  if(!req.session.id_user) res.status(401).json({ error: "Necesitas iniciar sesion para publicar" })
  if(content) 
  {
    const publication = await Publication.create({ content, id_user })  
    res.status(201).json({ estado: "publicada" })
  }
  else res.status(400).json({ error: "El contenido no puede estar vacío" })
}

module.exports= { getPublications, publish, publication };
