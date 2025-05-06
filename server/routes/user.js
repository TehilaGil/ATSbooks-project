const express=require("express")
const router=express.Router()
const userController=require("../Controllers/userController")
const verifyJWT=require("../middleware/verifyJWT")
const admirMiddleware=require("../middleware/admirMiddleware")


router.post('/register',userController.register)

router.post('/login',userController.login)

router.get('/',verifyJWT,admirMiddleware,userController.getAllUser)

router.put('/',verifyJWT,userController.updateUser)

router.delete('/:id',verifyJWT,admirMiddleware,userController.deleteUser)

router.put('/confirm',verifyJWT,admirMiddleware,userController.confirmUser)

router.post('/send-verification-code', userController.sendVerificationCode);
router.post('/reset-password-with-code', userController.resetPasswordWithCode);
// router.post('/register',userController.register)

// router.post('/login',userController.login)

// router.get('/',userController.getAllUser)

// router.put('/',userController.updateUser)

// router.delete('/:id',userController.deleteUser)

// router.put('/confirm',userController.confirmUser)



module.exports=router



