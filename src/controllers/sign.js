const bcrypt = require('bcryptjs');
const { User } = require('../controllers/models.js');
const { Op } = require('sequelize')

async function signUp(req, res)
{
  const { user_name, name, email } = req.body;
  let password = req.body.password

  const regExpEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; 
    
  if (!user_name || !name || !email || !password ) 
    res.status(400).json({"error": "Debes llenar todos los datos"});
  else if (!regExpEmail.test(email)) 
    res.status(400).json({"error": "Debes ingresar un correo válido"});
  else if (await User.findOne({ where: { user_name } })) 
    res.status(409).json({"error": "Nombre de usuario en uso"});
  else if (await User.findOne({ where: { email } })) 
    res.status(409).json({"error": "Este correo ya está registrado"});
  else
  {
    password = await bcrypt.hash(password, 8);
    const newUser = await User.create({
      name,
      email,
      password,
      user_name
    })
    res.status(201).json({ error: "" });
  }
}

async function signIn(req, res)
{
  const { dato, password } = req.body;
  if (!dato) 
  {
    res.status(400).json({"error": "Debes utilizar un correo electrónico, nombre de usuario o id" });
    return;
  }
  else if (!password) 
  {
    res.status(400).json({"error": "Debes utilizar una contraseña para ingresar"});
    return;
  }

  let id = isNaN(parseInt(dato)) ? -1 : dato
  const user = await User.findOne({ where: 
  { 
    [Op.or]: [
      { id: id },
      { user_name: dato },
      { email: dato }
    ]
  }})
  if(!user) 
  {
    res.json({"error": "Usuario o contraseña incorrectos"});
    return;
  }
  const passwordCorrect = await bcrypt.compare(password, user.password);
  if(passwordCorrect)
  {
    console.log(user.id)
    req.session.id_user = user.id;
    req.session.user = user.user_name;
    req.session.name = user.name;
    res.json({
      id_user: user.id,
      user: user.user_name,
      name: user.name
    });
  }
  else res.json({"error": "Usuario o contraseña incorrectos"});
}

module.exports = { signUp, signIn }
