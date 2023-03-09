const mongoose = require("../mongodb/db");
const { Schema, model } = mongoose;

const counterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
  });
  
  const userCounter = model('userCounter', counterSchema);
  
  module.exports = userCounter;