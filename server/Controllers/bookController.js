const Book = require("../models/Book")
const Grade = require("../models/Grade")
const Title = require("../models/Title")
const { deleteTitle } = require('./titleController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/bookImages');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

const createNewBook = async (req, res) => {

    const { name, grades } = req.body
    // if(!name)
    const image = req.file ? '/uploads/bookImages/' + req.file.filename : null;

    let gradesArr = [];
    gradesArr = grades
    console.log(image)
    if (!name) {
        return res.status(400).send("name is required")
    }
    if (!image) {
    console.log("🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️"+gradesArr);

        return res.status(400).send("image is required")
    }
    const existBook = await Book.findOne({ name: name }).populate("grades");
    if (existBook) {


        return res.status(402).send("invalid name")
    }

    //const resGrade = gradesArr.map((ele) => Grade.find({ name: ele }))
    // console.log("👌👌👌👌👌👌👌👌👌👌👌👌👌"+gradesArr);
    
    let gradeDocs=[]

    if (typeof gradesArr === "string"&&gradesArr!="[]") {
        try {
            console.log("🎂🎂🎂🎂🎂🎂🎂"+typeof gradesArr)
            
            gradesArr = JSON.parse(gradesArr);
            console.log("✔✔✔✔✔✔✔✔✔✔"+gradesArr)
if (!Array.isArray(gradesArr)) {
        return res.status(400).send("grades must be an array");
    }
             gradeDocs = await Promise.all(
                gradesArr.map(grade => Grade.findOne({ name: grade }))
               
            );
            console.log("👌👌👌👌👌👌👌👌👌👌👌👌👌"+gradesArr);
        } catch (error) {
            console.error("Failed to parse gradesArr:", error);
            return res.status(400).send("Invalid grades format");
        }
    }

    
   
    console.log("gradeDocs", gradeDocs)
    // סינון רק כיתות שנמצאו בפועל
    const validGrades = gradeDocs.filter(doc => doc);
    const gradeIds = validGrades.map(doc => doc._id);

    // if (validGrades.length === 0) {
    //     return res.status(400).send("No valid grades found for the book");
    // }

    console.log("222",name,  gradeIds, image)

    const book = await Book.create({ name, grades: gradeIds, image });
    console.log("@@@@@@@");

    console.log(book)
    if (!book) {
        console.log("invalid");

        return res.status(400).send("invalid book")
    }

    try {
        

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
    try{
    const books = await Book.find().lean().populate("grades")
   res.json(books)
}
catch{
        return res.status(400).json({ message: 'there is a bloblem louding the books' })
}
    
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
    const { Id } = req.params

    // חפש את כל הספרים שהכיתה עם ה-ID הזה נמצאת במערך grades
    try{
    const books = await Book.find({ grades: Id }).lean().populate("grades")
    console.log(books);
        res.json(books)
}
    catch {
        return res.status(400).json({ message: 'there is a bloblem louding the books' })
    }


}

const updateBook = async (req, res) => {
    try {
        const { _id, name, grades } = req.body;

        const newImage = req.file ? '/uploads/bookImages/' + req.file.filename : null;
console.log("jjjjj",newImage);

        const book = await Book.findById(_id).populate("grades").exec();
        if (!book) {
            return res.status(400).json({ message: 'Book not found' });
        }
        

        // Update grades
        let gradesArray = grades;
        


        if (typeof gradesArray === "object" && !Array.isArray(gradesArray)) {
            gradesArray = Object.values(gradesArray);
        }
        

        // Ensure gradesArray is an array
        if (!Array.isArray(gradesArray)) {
            return res.status(400).send("Grades must be an array or an object convertible to an array");
        }

        console.log("Final gradesArray:", gradesArray);

   
        const gradeDocs = await Promise.all(
            gradesArray.map(name => Grade.findOne({ name }))
        );
        

        const validGrades = gradeDocs.filter(doc => doc);
        const gradeIds = validGrades.map(doc => doc._id);

        // מחיקת התמונה הקודמת אם יש תמונה חדשה
        if (newImage && book.image) {
            const oldImagePath = path.join(__dirname, '../', book.image);
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error(`Failed to delete old image: ${oldImagePath}`, err);
                } else {
                    console.log(`Successfully deleted old image: ${oldImagePath}`);
                }
            });
        }
        
        // עדכון הספר
        book.name = name;
        book.grades = gradeIds;
        if (newImage) {
            book.image = newImage;
        }
    
        const updatedBook = await book.save();
    
       return  res.json(updatedBook);

    } catch (error) {
        console.error("Error updating book:", error.message);
        res.status(500).json({ message: "Failed to update book", error: error.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id).exec();
        if (!book) {
            console.log("🎉🎉🎉🎉🎉🎉🎉🎉");
            return res.status(400).json({ message: 'book not found' });
        }

        if (book.image) {
            const imagePath = path.join(__dirname, '../', book.image); 
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(`Failed to delete image file: ${imagePath}`, err);
                } else {
                    console.log(`Successfully deleted image file: ${imagePath}`);
                }
            });
        }


        const titles = await Title.find({ book: id }).exec();
        if (Array.isArray(titles)) {
            for (let title of titles) {
                await deleteTitle(title._id); // שים לב - אין שימוש ב-res
            }
        }

        await Book.deleteOne({ _id: id });
        res.status(200).json();
    } catch (error) {
        console.error("Error deleting book:", error.message);
        res.status(500).json({ message: "Failed to delete book", error: error.message });
    }
};





module.exports = { createNewBook, getAllBooks, getBookById, updateBook, deleteBook, getBooksForGrade }

