const productionConfig = './config-dev.js';
const developConfig = './config-pro.js';

const fs = require('fs');

var config = null;

console.log('===process.env.NODE_ENV***', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'production') {
  console.log(`Load DBconfig ${productionConfig}...`);
  config = require(productionConfig);
} else {
  console.log(`Load DBconfig ${developConfig}...`);
  config = require(developConfig);
}

module.exports = config;