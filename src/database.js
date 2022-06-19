//db conection
const mysql = require('mysql');
const conection = 
{
    host: 'bbrchz1ppsdnirgwxah8-mysql.services.clever-cloud.com',
    user: 'uct50hrdlx5xb3nv',
    password: 'majPlFfJZPfu99yzcSUG',
    database: 'bbrchz1ppsdnirgwxah8'
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