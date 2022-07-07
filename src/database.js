//db conection
const mysql = require('mysql');
const conection = 
{
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'pitter'
}

dbConect = (query) =>{
    const con = mysql.createConnection(conection);
    let data = new Promise((resolve, reject)=>{
        con.query(query,  (err, results)=>{
            if(err) return reject(err);
            return resolve(results);
        });
    });
    con.end();
    return data;
};

options = () =>
{
    return conection;
}

module.exports.dbConect = dbConect;
module.exports.options = options;