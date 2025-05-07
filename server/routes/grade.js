const express=require("express")
const router=express.Router()
const gradeController=require("../Controllers/gradeController")
const verifyJWT=require("../middleware/verifyJWT")
const admirMiddleware=require("../middleware/admirMiddleware")



 router.post('/',verifyJWT,admirMiddleware,gradeController.creatNewGrade)

router.get('/:id',gradeController.getGradeById)

 router.get('/',gradeController.getAllGrade)

 router.put('/',verifyJWT,admirMiddleware,gradeController.updateGrade)

 router.delete('/:id',verifyJWT,admirMiddleware,gradeController.deleteGrade)


 
// router.post('/',gradeController.creatNewGrade)

// router.get('/:id',gradeController.getGradeById)

// router.get('/',gradeController.getAllGrade)

// router.put('/',gradeController.updateGrade)

// router.delete('/:id',gradeController.deleteGrade)

module.exports=router