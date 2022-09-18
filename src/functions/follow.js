const database = require('../database');

follow = (id_following, id_follower) =>
{
    if(parseInt(id_following) === id_follower) 
    {
        return {"followed": "no te puedes seguir a ti mismo"};
    }
    else database.query(`INSERT INTO following(id_following, id_follower) VALUES(${id_following}, ${id_follower})`);
    return {"followed": "followed"};
}

unFollow = (id_following, id_follower) =>
{
    database.query(`DELETE FROM following WHERE id_following = ${id_following} and id_follower = ${id_follower}`);
}

module.exports.follow = follow;
module.exports.unFollow = unFollow;
