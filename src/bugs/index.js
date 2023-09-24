const _ = require('lodash');
const validator = require('validator');

const db = require('../database');

const Bugs = module.exports;

require('./create')(Bugs);