const sequelize = require('../config/database');
const User = require('./User')(sequelize);

const models = {
    User,

};

const defineAssociations = require('.');
defineAssociations(models);

module.exports = {
  sequelize,
  ...models,  
};