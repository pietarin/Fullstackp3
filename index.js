require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
var morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :response-time ms :body'))

const generateId = () => {
    const min = 5
    const max = 100000
    return Math.floor(Math.random() * (max - min)) + min;
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        id: generateId(),
        name: body.name,
        number: body.number || false,
    })

    person.save().then(savedPerson => {
        console.log(`Added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
        response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

app.get('/', (request, response, next) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/info', (request, response, next) => {
    const amount = person.length
    const date = Date()
    response.send(`<p>Phonebook has info for ${amount} people <br/> ${date}</p>`)
})

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(result => {
        response.json(result)
        console.log("phonebook:")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)
    Person.findById(request.params.id).then(result => {
        if (result) {
            response.json(result)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

/*
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}
*/

/*let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]
*/


/*
    if (body.content === undefined) {
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }
 
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
 
    if (person.some(e => e.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
 
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
*/
