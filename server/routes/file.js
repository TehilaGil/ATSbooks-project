const express = require("express");
const router = express.Router();
const fileController = require("../Controllers/fileController");
const verifyJWT=require("../middleware/verifyJWT")
const admirMiddleware=require("../middleware/admirMiddleware")
const upload = require("../middleware/upload"); // <-- להוסיף את זה!


router.post("/",verifyJWT ,admirMiddleware,upload.single("file"), fileController.uploadFile);


router.get("/", verifyJWT,fileController.getAllFiles);
router.get("/title/:titleId",verifyJWT, fileController.getFilesByTitle);
router.get("/download/:fileId",verifyJWT, fileController.downloadFile);
router.delete("/:fileId",verifyJWT ,admirMiddleware,fileController.deleteFile);
router.put("/:fileId",verifyJWT ,admirMiddleware, upload.single("file"), fileController.updateFile);
router.get('/view/:fileId',verifyJWT, fileController.viewFileContent);

module.exports = router;
