const express = require('express');
const bcrypt = require('bcryptjs');
const database = require('../database');
const router = express.Router();

let regExpEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

router.post('/signIn', async (req, res) => 
{
    if (!req.body.dato) res.status(400).json({"error": "Debes utilizar un correo electrónico, nombre de usuario, id o teléfono válido para ingresar"});
    else if (!req.body.password) res.status(400).json({"error": "Debes utilizar una contraseña para ingresar"});
    else
    {
        let id = isNaN(parseInt(req.body.dato)) ? -1 : req.body.dato
        let correct = await database.query(`SELECT * FROM private WHERE id = ${id} OR user_name='${req.body.dato}' OR email='${req.body.dato}'`)
        if(!correct[0])
        {
          res.json({"error": "Usuario o contraseña incorrectos"});
          return;
        }
        let passwordCorrect = await bcrypt.compare(req.body.password, correct[0].password);
        if(passwordCorrect)
        {
            let userInfo = await database.query(`SELECT * FROM users WHERE id=${correct[0].id}`);
            let data = 
            {
                "id_user": parseInt(userInfo[0].id),
                "user": userInfo[0].user_name,
                "name": userInfo[0].name,
                "error": ''
            }
          req.session.id_user = parseInt(userInfo[0].id);
          req.session.user = userInfo[0].user_name;
          req.session.name = userInfo[0].name;
            res.json(data);
        }
        else res.json({"error": "Usuario o contraseña incorrectos"});
    }
})

router.post('/signUp', async (req, res) =>
{
    if (!req.body.user_name || !req.body.name || !req.body.email || !req.body.password ) res.status(400).json({"error": "Debes llenar todos los datos"});
    else if (!regExpEmail.test(req.body.email)) res.status(400).json({"error": "Debes ingresar un correo válido"});
    else if ((await database.query(`SELECT id FROM users WHERE user_name = '${req.body.user_name}'`))[0]) res.status(409).json({"error": "Nombre de usuario en uso"});
    else if ((await database.query(`SELECT id FROM private WHERE email = '${req.body.email}'`))[0]) res.status(409).json({"error": "Este correo ya está registrado"});
    else
    {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        let user_name = req.body.user_name
        let newUser = await database.query(`INSERT INTO users(name, user_name, created_at) VALUES('${req.body.name}', '${user_name}', NOW())`);
        let id = await database.query(`SELECT id FROM users WHERE user_name = '${user_name}'`)
        id = id[0].id
        let newPass = await database.query(`INSERT INTO private(id, user_name, password, email) VALUES(${id}, '${user_name}', '${req.body.password}', '${req.body.email}')`)
        res.status(201).json({"error": ""});
    }
})


module.exports = router;
