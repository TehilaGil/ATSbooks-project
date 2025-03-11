
const express=require("express")
const router=express.Router()
const bookController=require("../Controllers/bookController")
const verifyJWT=require("../middleware/verifyJWT")
const admirMiddleware=require("../middleware/admirMiddleware")


router.post('/',verifyJWT,admirMiddleware,bookController.createNewBook)

router.get('/',bookController.getAllBooks)

router.get('/:id',verifyJWT,bookController.getBookById)

router.put('/',verifyJWT,admirMiddleware,bookController.updateBook)

router.delete('/:id',verifyJWT,admirMiddleware,bookController.deleteBook)

router.get('/:id',bookController.getAllBooksByGrade)


module.exports=router
