'use strict';

module.exports = mongoose => new mongoose.Schema({
  noun: { type: String, required: true },
  verb: { type: String, required: true }
});
