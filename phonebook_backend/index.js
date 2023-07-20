const { request } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()
const cors = require('cors')
const Person = require('./models/person')



morgan.token('content', (r) => JSON.stringify(r.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))



const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

//GET
app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(p => {
        response.json(p)
    }).catch(error => next(error))
})


app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${Person.length} people</p><p>${new Date}</p>`)
})


app.get('/api/persons/:id', (request, response, next) => {
    const inputID = request.params.id
    Person.findById(inputID).then(p => {
        if (p) {
            console.log(p)
            response.json(p)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
    
})


//DELETE
app.delete('/api/persons/:id', (request, response, next) => {
    const inputID = request.params.id

    Person.findByIdAndRemove(inputID).then(result => {

        response.status(204).end()

    }).catch(error => next(error))
}) 


//POST
app.post('/api/persons', (request, response, next) => {
    console.log("Post recieved")
    

    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    /*else if (persons.find(p => p.name === request.body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }*/
    const newPerson = new Person({
        id: getRandomID(),
        name: request.body.name,
        number: request.body.number
    })

    newPerson.save().then(newP => {
        response.json(newP)
    }).catch(error => {
        console.log('Error alert!')
        next(error)
    })
    
})


//PUT
app.put('/api/persons/:id', (request, response, next) => {
    const inputID = request.params.id
    const updatedPerson = request.body

    Person.findByIdAndUpdate(inputID, updatedPerson, { new: true, runValidators: true, context: 'query' }).then(p => {

        response.json(p)

    }).catch(error => next(error))

})




function getRandomID() {
    return Math.floor(Math.random() * (10000 - 1) + 1)
}

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})