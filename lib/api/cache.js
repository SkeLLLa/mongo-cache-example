/// <reference types="node" />
/// <reference types="mongodb" />
/// <reference types="express" />

const mongo = require('../db');
const config = require('config').get('cache');
const {getRandomString} = require('../data-generator');

const getValue = (value, ttl = config.ttl) => {
  const now = new Date();
  return {
    updatedAt: now,
    expireAt: new Date(now.getTime() + ttl),
    ttl,
    value,
  };
};

const updateOne = async (key, obj) => {
  const data = await mongo.collection.updateOne(
    {key},
    {$set: obj},
    {
      upsert: true,
    }
  );
  const count = await mongo.collection.count();
  // check if cache count exceeds cache size
  // and delete oldest entry
  if (count > config.size) {
    await deleteOledst();
  }

  return data;
};

const getOne = async (key) => {
  return mongo.collection.findOne({key});
};

const deleteOne = async (key) => {
  return mongo.collection.deleteOne({key});
};

const deleteOledst = async () => {
  const oldest = await mongo.collection.findOne({}, {sort: {updatedAt: 1}});
  await deleteOne(oldest.key);
  return;
};

const deleteAll = async () => {
  return mongo.collection.deleteMany({});
};

const getAll = async (fields = []) => {
  const projection = {_id: 0};
  fields.forEach((it) => {
    projection[it] = 1;
  });
  return mongo.collection.find({}, {projection}).toArray();
};

exports.get = async (req, res) => {
  try {
    const {key} = req.params;
    const {ttl} = req.query;
    if (typeof key === 'undefined') {
      res.status(400).send('Bad request');
      return;
    }
    const data = await getOne(key);
    if (data !== null) {
      console.info(`Cache HIT. "${data.value}"`);
      res.status(200).send(data.value);
      await updateOne(key, getValue(data.value, data.ttl));
      return data.value;
    }
    const newVal = await getRandomString();
    console.info(`Cache MISS. New value created "${newVal}"`);
    await updateOne(key, getValue(newVal, ttl));
    res.status(201).send(newVal);
    return newVal;
  } catch (ex) {
    console.error(ex);
    res.status(500).send('Something went wrong!');
  }
};

exports.getKeys = async (req, res) => {
  try {
    const data = await getAll(['key']);
    const result = data.map((it) => it.key);
    res.status(200).send(result);
    return result;
  } catch (ex) {
    res.status(500).send('Something went wrong!');
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await getAll(['key', 'value', 'ttl']);
    const result = data.map((it) => {
      return {
        key: it.key,
        value: it.value,
        ttl: it.ttl,
      };
    });
    res.status(200).send(result);
    return result;
  } catch (ex) {
    res.status(500).send('Something went wrong!');
  }
};

exports.set = async (req, res) => {
  try {
    const {key} = req.params;
    const value = req.body;
    const {ttl} = req.query;
    if (typeof key === 'undefined' || typeof value === 'undefined') {
      res.status(400).send('Bad request');
      return;
    }
    await updateOne(key, getValue(value, ttl));
    res.status(201).send('Ok');
  } catch (ex) {
    res.status(500).send('Something went wrong!');
  }
};

exports.delete = async (req, res) => {
  try {
    const {key} = req.params;
    if (typeof key === 'undefined') {
      res.status(400).send('Bad request');
      return;
    }
    const {deletedCount} = await deleteOne(key);
    if (deletedCount) {
      res.status(204).end();
      return;
    }
    res.status(404).end(`Key "${key}" not found`);
  } catch (ex) {
    res.status(500).send('Something went wrong!');
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await deleteAll();
    res.status(204).end();
  } catch (ex) {
    res.status(500).send('Something went wrong!');
  }
};
