
const express=require("express")
const router=express.Router()
const titleController=require("../Controllers/titleController")
const verifyJWT=require("../middleware/verifyJWT")
const admirMiddleware=require("../middleware/admirMiddleware")


router.post('/',titleController.createNewTitle)

router.get('/getTitlesByBook/:id',titleController.getTitlesByBook)

router.get('/:id',titleController.getTitleById)

// router.delete('/:id',verifyJWT,admirMiddleware,titleController.deleteTitle)

router.delete('/:id',titleController.deleteTitle)


module.exports=router
