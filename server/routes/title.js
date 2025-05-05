
const express=require("express")
const router=express.Router()
const titleController=require("../Controllers/titleController")
const verifyJWT=require("../middleware/verifyJWT")
const admirMiddleware=require("../middleware/admirMiddleware")


router.post('/',verifyJWT,admirMiddleware,titleController.createNewTitle)

router.get('/getTitlesByBook/:id',titleController.getTitlesByBook)

router.get('/:id',verifyJWT,titleController.getTitleById)

// router.delete('/:id',verifyJWT,admirMiddleware,titleController.deleteTitle)

router.get('/getTitlesByBook/:id',verifyJWT,titleController.getTitlesByBook)

// router.get('/:id',titleController.getTitleById)

router.delete('/:id',verifyJWT,admirMiddleware,titleController.deleteTitle)


module.exports=router
