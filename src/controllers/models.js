const { Sequelize, DataTypes } = require('sequelize');

const host = process.env.DB_HOST || 'localhost'
const username = process.env.DB_USER || 'root'
const password = process.env.DB_PASSWORD || 'password'
const database = process.env.DB_DATABASE || 'pitter'

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'mysql'
})

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  email: {
    type: DataTypes.CHAR,
    unique: true,
    allowNull: false,
    validate:
    {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  user_name: {
    type: DataTypes.CHAR(20),
    unique: true,
    allowNull: false
  },
});

const Publication = sequelize.define('Publication', {
  id_pub: {
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  id_user: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
})

const Follow = sequelize.define('Follow', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  id_follower: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  id_following: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
})

;(async () =>
{
  await sequelize.sync()  
})()

const query = async query => sequelize.query(query);

module.exports = { User, Publication, Follow, query }
