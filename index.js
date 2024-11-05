const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

morgan.token('req-body', (req) => {
    return JSON.stringify(req.body);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// INFO page
app.get('/info', (request, response) => {
    response.send(`<div><p>Phonebook has info for ${persons.length} people</p><br /><p>${Date()}</p></div>`)
})

// GET all persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  // GET specific person
app.get('/api/persons/:id', (request, response) =>{
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

//DELETE a person
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

// POST a person
app.post('/api/persons', (request, response) => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(p => Number(p.id)))
    : 0

    const person = request.body

    if (!person.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!person.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const findPerson = persons.find(p => p.name === person.name)

    if (findPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    person.id = String(maxId + 1)
    persons = persons.concat(person)

    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})