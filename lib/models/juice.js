const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  name: RequiredString,
  ingredients: [RequiredString],
});

module.exports = mongoose.model('Juice', schema);