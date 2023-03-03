'use strict';

/**
 * https://gist.github.com/AKIRA-MIYAKE/03b9ae80dbdf61bf28ef
 */
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import config from '../config';

const { clusterDomain } = config.sources.database;

const basename = path.basename(__filename);

const models = {};

/**
 * Set event listener to mongoose.connection
 */
mongoose.connection.on('error', error => {
  console.log(error);
});

mongoose.connection.on('open', () => {
  console.log(`Connected to ${clusterDomain} cluster....`);
});

/**
 * Assign models to 'models' object
 */
fs.readdirSync(__dirname)
  .filter(filename => {
    // Get file's name that lives in the same directory without myself.
    return filename.indexOf('.') !== 0 && filename !== basename;
  })
  .forEach(filename => {
    // If file's extension is not 'js', break.
    if (filename.slice(-3) !== '.js') return;

    const filepath = path.join(__dirname, filename);

    // When imported file use 'export default', object is assinged 'default'.
    const imported = require(filepath).default
      ? require(filepath).default
      : require(filepath);

    if (typeof imported.modelName !== 'undefined') {
      // Model definition file is expected exporting 'Model' of mongoose.
      models[imported.modelName] = imported;
    }
  });

models.source = mongoose;

export default models;
