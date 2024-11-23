const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

// Middlewares
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

// Morgan
morgan.token('req-body', (req) => {
    return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

// INFO page
app.get('/info', (request, response) => {
    Person.countDocuments({})
    .then(count => {
        response.send(`<div><p>Phonebook has info for ${count} people</p><br /><p>${Date()}</p></div>`)
    })
})

// GET all persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
  })

  // GET specific person
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    }).catch(error => {
        console.log(error.message)
    })
})

// DELETE a person
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {response.status(204).end()})
    .catch(error => next(error))
})

// POST a person
app.post('/api/persons', (request, response) => {
    const body = request.body

    const person = new Person ({
        name: body.name,
        number: body.number
    })

    if (person.name === null) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (person.number === null) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// UPDATE a person
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(response.status(200).end())
    .catch(error => next(error))
})

// Unkown endpoint
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: "unknown endpoint"})
}
app.use(unknownEndpoint)

//ErrorHandler
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    next(error)
  }
  app.use(errorHandler)

app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on 0.0.0.0:3000');
})
  
// Testing GitHub deploy automation