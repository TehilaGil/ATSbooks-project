const express = require("express");
const router = express.Router();
const fileController = require("../Controllers/fileController");
const verifyJWT=require("../middleware/verifyJWT")
const admirMiddleware=require("../middleware/admirMiddleware")
const upload = require("../middleware/upload"); // <-- להוסיף את זה!


router.post("/", upload.single("file"), fileController.uploadFile);


router.get("/", fileController.getAllFiles);
router.get("/title/:titleId", fileController.getFilesByTitle);
router.get("/download/:fileId", fileController.downloadFile);
router.delete("/:fileId", fileController.deleteFile);
router.put("/:fileId", upload.single("file"), fileController.updateFile);

module.exports = router;
