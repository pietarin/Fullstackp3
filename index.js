require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :response-time ms :body'))

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
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/info', (request, response) => {
    const amount = person.length
    const date = Date()
    response.send(`<p>Phonebook has info for ${amount} people <br/> ${date}</p>`)
})

app.get('/api/people', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
        console.log("phonebook:")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
    })
})

app.get('/api/people/:id', (request, response) => {
    const id = Number(request.params.id)
    Person.findById(request.params.id).then(result => {
        if (result) {
            response.json(result)
        } else {
            response.status(404).end()
        }
    })
})

/*
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}
*/

const generateId = () => {
    const min = 5
    const max = 100000
    return Math.floor(Math.random() * (max - min)) + min;
}

app.post('/api/people', (request, response) => {
    const body = request.body

    const person = new Person ({
        id: generateId(),
        name: body.name,
        number: body.number || false,
    })

    person.save().then(savedPerson => {
        //console.log(`Added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
        response.json(savedPerson)
    })

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

})

app.delete('/api/people/:id', (request, response) => {
    const id = Number(request.params.id)
    Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})