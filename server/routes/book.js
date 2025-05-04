
const express=require("express")
const router=express.Router()
const bookController=require("../Controllers/bookController")
const verifyJWT=require("../middleware/verifyJWT")
const admirMiddleware=require("../middleware/admirMiddleware")
// const { upload } = require("../Controllers/bookController");

const multer = require("multer");
const path = require("path");


// Configure multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Save files in "uploads" folder
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, `${uniqueSuffix}-${file.originalname}`);
//     }
// });
// const upload = multer({ storage });
// router.post("/", upload.single("file"), createNewBook);
router.post('/',verifyJWT ,admirMiddleware,bookController.createNewBook)
//router.post('/api/books', upload.single('image'), bookController.createNewBook);

router.get('/',bookController.getAllBooks)

router.get('/:id',verifyJWT,bookController.getBookById)

router.put('/',verifyJWT ,admirMiddleware,bookController.updateBook)

router.delete('/:id',verifyJWT ,admirMiddleware,bookController.deleteBook)

router.get('/grade/:Id',verifyJWT,bookController.getBooksForGrade)














// router.post('/',verifyJWT,admirMiddleware,bookController.createNewBook)

// router.get('/',bookController.getAllBooks)

// router.get('/:id',verifyJWT,bookController.getBookById)

// router.put('/',verifyJWT,admirMiddleware,bookController.updateBook)

// router.delete('/:id',verifyJWT,admirMiddleware,bookController.deleteBook)

// router.get('/:id',bookController.getAllBooksByGrade)


module.exports=router
