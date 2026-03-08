const sequelize = require('../config/database');
const User = require('./User')(sequelize);
const RefreshToken = require('./RefreshToken')(sequelize);

const models = {
    User,
    RefreshToken,

};

const defineAssociations = require('./associations');
defineAssociations(models);

module.exports = {
  sequelize,
  ...models,  
};