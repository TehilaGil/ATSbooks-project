const express = require("express");
const router = express.Router();
const fileController = require("../Controllers/fileController");
const verifyJWT=require("../middleware/verifyJWT")
const admirMiddleware=require("../middleware/admirMiddleware")



router.post("/",verifyJWT,admirMiddleware, fileController.createFile); 
router.get("/title/:titleId", fileController.getFilesByTitle); 
router.get("/:id",verifyJWT, fileController.getFileById); 
router.put("/:id",verifyJWT,admirMiddleware, fileController.updateFile); 
router.delete("/:id",verifyJWT,admirMiddleware, fileController.deleteFile); 

module.exports = router;