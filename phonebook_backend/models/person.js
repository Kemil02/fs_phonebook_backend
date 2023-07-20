const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = `mongodb+srv://karlemillemstrom:8RKF4Q58NUNjkvjD@cluster0.d6dzmik.mongodb.net/?retryWrites=true&w=majority`


console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const contactSchema = new mongoose.Schema({

    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: p => `${p.value} is not a valid phone number!`
        }
    }
,
    id: String
})

contactSchema.set('toJSON', {
    transform: (document, toReturn) => {

        toReturn.id = toReturn._id.toString()

        delete toReturn._id
        delete toReturn.__v
    }
})



module.exports = mongoose.model('Person', contactSchema)