const Book = require("../models/Book")
const Grade = require("../models/Grade")
const Title = require("../models/Title")


const titleController = require("../Controllers/titleController")


const createNewBook = async (req, res) => {

    const { name, grades, image } = req.body
    let gradesArr = [];
    gradesArr = grades
    if (!name) {
        return res.status(400).send("name is required")
    }
    const existBook = await Book.findOne({ name: name }).populate("grades");
    if (existBook) {
        return res.status(400).send("invalid name")
    }
    console.log(gradesArr)
    //const resGrade = gradesArr.map((ele) => Grade.find({ name: ele }))

    const gradeDocs = await Promise.all(
        gradesArr.map(name => Grade.findOne({ name }))
    );
    console.log("111")

    // סינון רק כיתות שנמצאו בפועל
    const validGrades = gradeDocs.filter(doc => doc);
    const gradeIds = validGrades.map(doc => doc._id);

    if (validGrades.length === 0) {
        return res.status(400).send("No valid grades found for the book");
    }

    console.log("222")

    const book = await Book.create({ name, grades: gradeIds, image });
    console.log("@@@@@@@");

    console.log(book)
    if (!book) {
        console.log("invalid");

        return res.status(201).send("invalid book")
    }

    // const title1= 'Book'
    // const title2='Exams'
    // const title3='Exercises'
    // const title4= 'Disk'

    // const titleN1 = await Title.create({ name:title1, book: book._id });
    // const titleN2 = await Title.create({ name:title2, book: book._id });  
    // const titleN3 = await Title.create({ name:title3, book: book._id });
    // const titleN4 = await Title.create({ name:title4, book: book._id });
    // console.log(titleN1, titleN2, titleN3, titleN4);  // לדפוק לוג ולראות את התשובות

    // if (!titleN1 || !titleN2 || !titleN3 || !titleN4) {
    //     return res.status(500).json({ message: 'Failed to create title' });
    // }
    // res.json(book)


    try {
        console.log("ppp");

        const titles = ['Book', 'Exams', 'Exercises', 'Disk'];

        const titleDocs = await Promise.all(
            titles.map(name => Title.create({ name, book: book._id }))
        );

        console.log('Titles created:', titleDocs);

        res.json(book);
    } catch (error) {
        console.error('Error creating titles:', error);
        return res.status(500).json({ message: 'Failed to create titles', error: error.message });
    }

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

const getBooksForGrade = async (req, res) => {
    const { gradeId } = req.params

    // חפש את כל הספרים שהכיתה עם ה-ID הזה נמצאת במערך grades
    const books = await Book.find({ grades: gradeId }).lean().populate("grades")

    if (!books?.length) {
        return res.status(400).json({ message: 'No books found for this grade' })
    }

    res.json(books)
}
const updateBook = async (req, res) => {
    const { _id, name, grades, image } = req.body
    // Confirm data
    const book = await Book.findById(_id).populate("grades").exec()
    if (!book) {
        return res.status(400).json({ message: 'Book not found' })
    }

    // const titlesArr = titles ? titles.split(',') : ""  

    //const resGrade = gradesArr.map((ele) => Grade.find({ name: ele }))




    // book.titles = titlesArr
    const gradeDocs = await Promise.all(
        grades.map(name => Grade.findOne({ name }))
    );
    console.log("FOUND GRADE DOCS:", gradeDocs);
    // סינון רק כיתות שנמצאו בפועל
    const validGrades = gradeDocs.filter(doc => doc);
    const gradeIds = validGrades.map(doc => doc._id);

    book.name = name
    book.image = image
    book.grades = gradeIds

    console.log(name)
    console.log(grades)


    const updatebook = await book.save()
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