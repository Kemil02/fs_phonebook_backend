const mongoose = require('mongoose')

if (!(process.argv.length === 3 || process.argv.length === 5)) {
    console.log('please give appropriate arguments')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://karlemillemstrom:${password}@cluster0.d6dzmik.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)


const contactSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

const Person = mongoose.model('Person', contactSchema)

if (process.argv.length === 5) {
    const newPerson = new Person({
        id: getRandomID(),
        name: process.argv[3],
        number: process.argv[4]
    })
    newPerson.save().then(result => {
        console.log('Person saved!')
        mongoose.connection.close()
    })
}
else if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(p => {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}
else {
    mongoose.connection.close()
}


function getRandomID() {
    return Math.floor(Math.random() * (10000 - 1) + 1)
}