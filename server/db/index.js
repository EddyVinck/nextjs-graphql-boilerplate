const config = require("config");
const { connect } = require("./connect");
const hostname = config.get("mongoDb.hostname");
const port = config.get("mongoDb.port");
const dbName = config.get("mongoDb.dbName");
const dbUrl = `mongodb://${hostname}:${port}/${dbName}`;

module.exports = { connect, dbUrl };
