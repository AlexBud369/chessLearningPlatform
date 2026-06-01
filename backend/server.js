require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./src/models');
const { runSchemaMigrations } = require('./src/db/runSchemaMigrations');
const { seedDefaultThemes } = require('./src/db/seedDefaultThemes');

const PORT = process.env.PORT || 5000

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("database is connected")

        await runSchemaMigrations(sequelize);
        console.log('Schema migrations applied');

        await seedDefaultThemes();
        console.log('Default themes seeded');

        await sequelize.sync({ alter: true });
        console.log('Models synchronized');

        app.listen(PORT, () => 
            console.log("server is running on the port " + PORT)
        );
       
    } catch (err) {
        console.error("Connection to db error " + err.message)
        process.exit(1);
    }
}

startServer();