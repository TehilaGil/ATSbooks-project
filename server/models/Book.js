const { kMaxLength } = require("buffer")
const mongoose = require("mongoose")


const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    grades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grade' // שם המודל של הכיתות
    }],
    // titles: {
    //     type:[mongoose.Schema.Types.ObjectId],
    //     ref:"Title"
    // },
    image: {
        type: String,
        required: true//?
        // default: 'Book'
    }

}, {
    timestamps: true
})


module.exports = mongoose.model("Book", bookSchema)