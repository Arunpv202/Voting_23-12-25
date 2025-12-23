const Sequelize = require('sequelize');
const config = require('../config/database.js');
const db = {};

const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
    host: config.development.host,
    dialect: config.development.dialect
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Election = require('./election')(sequelize, Sequelize);
db.RegistrationToken = require('./registrationToken')(sequelize, Sequelize);
db.Candidate = require('./candidate')(sequelize, Sequelize);

// Associations
db.Election.hasMany(db.RegistrationToken, { foreignKey: 'election_id', sourceKey: 'election_id' });
db.RegistrationToken.belongsTo(db.Election, { foreignKey: 'election_id', targetKey: 'election_id' });

db.Election.hasMany(db.Candidate, { foreignKey: 'election_id', sourceKey: 'election_id' });
db.Candidate.belongsTo(db.Election, { foreignKey: 'election_id', targetKey: 'election_id' });

module.exports = db;
