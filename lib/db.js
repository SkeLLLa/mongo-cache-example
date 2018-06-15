/// <reference types="node" />
/// <reference types="mongodb" />
/// <reference types="config" />

const {MongoClient} = require('mongodb');
const config = require('config').get('db');
let db;
let collection;

const mongo = {
  get db() {
    return db;
  },
  get collection() {
    return collection;
  },
  async connect() {
    try {
      const client = await MongoClient.connect(config.url);
      db = client.db(config.db);
      collection = db.collection(config.collection);
      await collection.createIndex(
        {expireAt: 1},
        {expireAfterSeconds: 0}
      );
      await collection.createIndex('key', {unique: true, dropDups: true});
    } catch (ex) {
      console.error(ex);
      console.log(`Can't connect to DB`);
      process.exit(1);
    }
  },
  close() {
    if (db) {
      db.close();
    }
  },
};

module.exports = mongo;
