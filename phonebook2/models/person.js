const mongoose = require('mongoose')

const url = process.env.M0NGODB_URL

mongoose.set('strictQuery',false)

mongoose.connect(url)
.then(result => {console.log("Connected succesfully")})
.catch(error => {console.log(error.message)})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports  = mongoose.model('Person', personSchema)