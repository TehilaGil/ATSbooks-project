const Book = require("../models/Book")
const Grade = require("../models/Grade")
const Title = require("../models/Title")


const titleController = require("../Controllers/titleController")


const createNewBook = async (req, res) => {
    const { name, grades, image } = req.body
    let gradesArr = [];
    // let titlesArr = [];

    if (!name) {
        return res.status(400).send("name is required")
    }
    const existBook = await Book.findOne({ name: name }).populate("grades");
    if (existBook) {
        return res.status(400).send("invalid name")
    }
    console.log(grades)
    grades ? gradesArr = grades.split(',') : ""
    // titles ? titlesArr = titles.split(',') : ""
    console.log(gradesArr)
    // const resGrade = gradesArr.map((ele) => Grade.find({ name: ele._id }))
    // console.log(resGrade)
    // const resTitle= titlesArr.map((ele) =>Title.find({ name: ele._id }))

    const book = await Book.create({ name, grades:gradesArr, image });

    if (!book.length > 0) {
        return res.status(201).send("invalid book")
    }
    res.json(book)
}

const getAllBooks = async (req, res) => {
    const books = await Book.find().lean().populate("grades")
    if (!books?.length) {
        return res.status(400).json({ message: 'No books found' })
    }
    res.json(books)
}

const getBookById = async (req, res) => {
    const { id } = req.params
    const book = await Book.findById(id).lean().populate("grades")
    if (!book) {
        return res.status(400).json({ message: 'No book found' })
    }
    res.json(book)
}

const updateBook = async (req, res) => {
    const { _id, name, grades, image } = req.body
    // Confirm data
    const book = await Book.findById(_id).populate("grades").exec()
    if (!book) {
        return res.status(400).json({ message: 'Book not found' })
    }
    const gradesArr = grades ? grades.split(',') : "";
    // const titlesArr = titles ? titles.split(',') : ""  

    //const resGrade = gradesArr.map((ele) => Grade.find({ name: ele }))

    book.name = name
    book.image = image
    book.grades = gradesArr
    // book.titles = titlesArr

    const updateBook = await book.save()
    const books = await Book.find().lean().populate("grades")
    if (!books?.length) {
        return res.status(400).json({ message: 'No books found' })
    }
    res.json(books)
}

const deleteBook = async (req, res) => {
    const { id } = req.params
    const book = await Book.findById(id).exec()
    if (!book) {
        return res.status(400).json({ message: 'book not found' })
    }

    const titles = await Title.find({ book: id }).exec();
    if (titles.length > 0) {
        // מחיקת כל הכותרות שקשורות לספר *** (שינוי)
        await Promise.all(titles.map((title) => title.deleteOne())); // מחיקת כל הכותרות בו-זמנית
    }
    const result = await Book.deleteOne()
    const books = await Book.find().lean().populate("grades")
    if (!books?.length) {
        return res.status(400).json({ message: 'No books found' })
    }
    res.json(books)
}

const getAllBooksByGrade = async (req, res) => {
    const { id } = req.params
    // getGradeById(id)//???

    if (!booksForGrade?.length) {
        return res.status(400).json({ message: 'There are no books for this grade' })
    }
    res.json(booksForGrade)
}




module.exports = { createNewBook, getAllBooks, getBookById, updateBook, deleteBook, getAllBooksByGrade }