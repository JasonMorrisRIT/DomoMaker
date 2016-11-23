const mongoose = require('mongoose');
const random = require('mongoose-random');

mongoose.Promise = global.Promise;

const _ = require('underscore');

let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = name => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  wins: {
    type: Number,
    min: 0,
    required: true,
  },
  path: {
    type: String,
    required: true,
    trim: true,
    //set: setPath,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = doc => ({
  name: doc.name,
  wins: doc.wins,
  path: doc.path,
});

/* DomoSchema.statics.syncRandom((err, result) => {
  console.log(result.updated);
}); */

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return DomoModel.find(search).select('name wins path').exec(callback);
};

DomoSchema.plugin(random, { path: 'r' });
DomoModel = mongoose.model('Domo', DomoSchema);


module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
