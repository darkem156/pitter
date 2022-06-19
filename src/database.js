//db conection
const mysql = require('mysql');
const conection = 
{
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'pitter'
}
const con = mysql.createConnection(conection);

dbConect = (query) =>{
    return new Promise((resolve, reject)=>{
        con.query(query,  (err, results)=>{
            if(err) return reject(err);
            return resolve(results);
        });
    });
};

options = () =>
{
    return conection;
}

module.exports.dbConect = dbConect;
module.exports.options = options;