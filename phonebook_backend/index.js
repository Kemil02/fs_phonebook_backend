const { request } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')



morgan.token('content', (r) => JSON.stringify(r.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.use(express.json())
app.use(cors())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    console.log("Trying to delete...")
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    console.log("Deleted.")
    response.status(204).end()
}) 

app.post('/api/persons', (request, response) => {
    console.log("Post recieved")
    

    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    else if (persons.find(p => p.name === request.body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        id: getRandomID(),
        name: request.body.name,
        number: request.body.number
    }
    persons = persons.concat(person)
    response.json(person)
    console.log("Done")
})

function getRandomID() {
    return Math.floor(Math.random() * (10000 - 1) + 1); // The maximum is exclusive and the minimum is inclusive
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})