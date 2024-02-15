const { MongoClient } = require('mongodb');
const logger = require('pino')();

module.exports = async function connectToCluster(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        logger.info(`Mongoose: Connecting to MongoDB`);
        logger.info(`Mongoose: URI: ${uri}`);
        await mongoClient.connect();
        logger.info(`Mongoose: Successfully connected to MongoDB`);
        return mongoClient;
    } catch (error) {
        logger.error(`Mongoose: Connection to MongoDB failed!`, error);
        process.exit();
    }
}
