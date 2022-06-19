const database = require('../database');

publish = (id_user, content) =>
{
    if(content != '') database.dbConect(`INSERT INTO publicaciones(id_usuario, contenido, date) VALUES(${id_user}, '${content}', NOW())`);
    else return {"error": "El contenido no puede estar vacío"};
    return {"estado": "publicada", "error": ""}
}

module.exports.publish = publish;