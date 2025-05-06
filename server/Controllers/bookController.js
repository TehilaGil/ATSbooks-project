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
        return res.status(400).send("image is required")
    }
    const existBook = await Book.findOne({ name: name }).populate("grades");
    if (existBook) {
        return res.status(400).send("invalid name")
    }

    //const resGrade = gradesArr.map((ele) => Grade.find({ name: ele }))
    

    if (typeof gradesArr === "string") {
        try {
            gradesArr = JSON.parse(gradesArr);
        } catch (error) {
            console.error("Failed to parse gradesArr:", error);
            return res.status(400).send("Invalid grades format");
        }
    }

    if (!Array.isArray(gradesArr)) {
        return res.status(400).send("grades must be an array");
    }
    const gradeDocs = await Promise.all(
        gradesArr.map(grade => Grade.findOne({ name: grade }))

    );
    console.log("gradeDocs", gradeDocs)
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

        return res.status(400).send("invalid book")
    }

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
    const { Id } = req.params

    // חפש את כל הספרים שהכיתה עם ה-ID הזה נמצאת במערך grades
    const books = await Book.find({ grades: Id }).lean().populate("grades")
    console.log(books);

    if (!books?.length) {
        return res.status(400).json({ message: 'No books found for this grade' })
    }

    res.json(books)
}
// const updateBook = async (req, res) => {
//     try {
//         const { _id, name, grades } = req.body;
//         const newImage = req.file ? '/uploads/bookImages/' + req.file.filename : null;

//         const book = await Book.findById(_id).populate("grades").exec();
//         if (!book) {
//             return res.status(400).json({ message: 'Book not found' });
//         }

//         // Update grades
//         let gradesArray = grades;
//         if (!Array.isArray(grades)) {
//             if (typeof grades === 'string') {
//                 gradesArray = grades.split(',').map(g => g.trim());
//             } else {
//                 return res.status(400).json({ message: 'Grades must be an array or comma-separated string' });
//             }
//         }

//         const gradeDocs = await Promise.all(
//             gradesArray.map(name => Grade.findOne({ name }))
//         );

//         const validGrades = gradeDocs.filter(doc => doc);
//         const gradeIds = validGrades.map(doc => doc._id);

//         // מחיקת התמונה הקודמת אם יש תמונה חדשה
//         if (newImage && book.image) {
//             const oldImagePath = path.join(__dirname, '../', book.image);
//             fs.unlink(oldImagePath, (err) => {
//                 if (err) {
//                     console.error(`Failed to delete old image: ${oldImagePath}`, err);
//                 } else {
//                     console.log(`Successfully deleted old image: ${oldImagePath}`);
//                 }
//             });
//         }

//         // עדכון הספר
//         book.name = name;
//         book.grades = gradeIds;
//         if (newImage) {
//             book.image = newImage;
//         }

//         const updatedBook = await book.save();
//         res.json(updatedBook);
//     } catch (error) {
//         console.error("Error updating book:", error.message);
//         res.status(500).json({ message: "Failed to update book", error: error.message });
//     }
// };
const updateBook = async (req, res) => {
    try {
        const { _id, name, grades } = req.body;
        console.log(name, grades)

        const newImage = req.file ? '/uploads/bookImages/' + req.file.filename : null;

        const book = await Book.findById(_id).populate("grades").exec();
        if (!book) {
            return res.status(400).json({ message: 'Book not found' });
        }
        
        console.log(typeof grades, grades)

        // Update grades
        let gradesArray = grades;
        

        console.log(typeof gradesArray, gradesArray)

        if (typeof gradesArray === "object" && !Array.isArray(gradesArray)) {
            gradesArray = Object.values(gradesArray);
        }
        

        console.log(typeof gradesArray, gradesArray)
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
// const deleteBook = async (req, res) => {
//     const { id } = req.params
//     const book = await Book.findById(id).exec()
//     if (!book) {
//         return res.status(400).json({ message: 'book not found' })
//     }
//     const titles = await Title.find({ book: id }).exec();
//     if (titles.length > 0 && Array.isArray(titles)) {
//         await Promise.all(titles.map(async (title) => {

//            await deleteTitle({ params: { id: title._id } }, res);

//         }));
//     }

//     const result = await Book.deleteOne({ _id: id })
//     const books = await Book.find().lean().populate("grades")
//     if (!books?.length) {
//         return res.json([]); // החזר מערך ריק במקום הודעת שגיאה
//     }
//     res.json(books)
// }



const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id).exec();
        if (!book) {
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

        const books = await Book.find().lean().populate("grades");
        res.json(books?.length ? books : []);
    } catch (error) {
        console.error("Error deleting book:", error.message);
        res.status(500).json({ message: "Failed to delete book", error: error.message });
    }
};


// const getAllBooksByGrade = async (req, res) => {
//     const { id } = req.params
//     // getGradeById(id)//???

//     if (!booksForGrade?.length) {
//         return res.status(400).json({ message: 'There are no books for this grade' })
//     }
//     res.json(booksForGrade)
// }




module.exports = { createNewBook, getAllBooks, getBookById, updateBook, deleteBook, getBooksForGrade }

// const multer = require("multer");
// const path = require("path");
// const Book = require("../models/Book");
// const Grade = require("../models/Grade");
// const Title = require("../models/Title");
// const { deleteTitle } = require('./titleController');

// // הגדרת אחסון הקבצים
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads"); // שמירת קבצים בתיקיית uploads
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, `${uniqueSuffix}-${file.originalname}`);
//     },
// });

// // מסנן קבצים (סוגים מותרים)
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
//     }
// };

// const upload = multer({ storage, fileFilter });


// const createNewBook = async (req, res) => {
//     const { name, grades } = req.body;
//     const image = req.file ? `/uploads/${req.file.filename}` : null; // שימוש בקובץ שהועלה

//     if (!name) {
//         return res.status(400).send("Name is required."); // בדיקה אם השם ריק
//     }
//     if (!image) {
//         return res.status(400).send("Image is required."); // בדיקה אם לא הועלה קובץ
//     }

//     // בדיקה אם הספר כבר קיים במערכת
//     const existBook = await Book.findOne({ name: name }).populate("grades");
//     if (existBook) {
//         return res.status(400).send("Invalid name. Book already exists.");
//     }

//     // מציאת הכיתות הרלוונטיות לפי שמות
//     const gradeDocs = await Promise.all(
//         grades.map((grade) => Grade.findOne({ name: grade }))
//     );

//     const validGrades = gradeDocs.filter((doc) => doc);
//     const gradeIds = validGrades.map((doc) => doc._id);

//     if (validGrades.length === 0) {
//         return res.status(400).send("No valid grades found for the book."); // בדיקת כיתות תקינות
//     }

//     try {
//         // יצירת הספר החדש
//         const book = await Book.create({ name, grades: gradeIds, image });

//         // יצירת הכותרים עבור הספר
//         const titles = ["Book", "Exams", "Exercises", "Disk"];
//         await Promise.all(
//             titles.map((titleName) => Title.create({ name: titleName, book: book._id }))
//         );

//         res.json(book); // החזרת הספר שנוצר בתגובה
//     } catch (error) {
//         console.error("Error creating book:", error);
//         return res.status(500).json({ message: "Failed to create book", error: error.message });
//     }
// };

// module.exports = { createNewBook, upload };