const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('req-body', (req) => {
    return JSON.stringify(req.body);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let persons = []

Person.find({}).then(person => {
    persons.push(person)
})

// INFO page
app.get('/info', (request, response) => {
    Person.find({}).then(person => {persons.push(person)})
    response.send(`<div><p>Phonebook has info for ${persons.length} people</p><br /><p>${Date()}</p></div>`)
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
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
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

    // const findPerson = persons.find(p => p.name === person.name)

    // if (findPerson) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }
    
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})


app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on 0.0.0.0:3000');
})
  