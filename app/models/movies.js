const mongoose = require('mongoose')
const { required } = require('nodemon/lib/config')

//Schema
const Schema = mongoose.Schema

const MovieSchema = new Schema({
     name : {
          type : String,
          trim : true,
          required : true
     },
     released_on : {
          type: Date,
          trim : true,
          required : true
     }
})

module.exports = mongoose.model('Movie', MovieSchema)