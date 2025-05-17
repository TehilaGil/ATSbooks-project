
const File = require("../models/File")
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const { log } = require("console");



const uploadFile = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).send({ message: "לא נבחר קובץ להעלאה" });
    }

    const newFile = await File.create({
      name: req.file.originalname,
      path: req.file.path,
      size: Number((req.file.size / 1024).toFixed(2)),
      title: title,
    });

    res.status(201).send(newFile);
  } catch (err) {
    res.status(500).send({ message: "שגיאה בהעלאת קובץ", error: err.message });
  }
};

const getFilesByTitle = async (req, res) => {
  try {
    const { titleId } = req.params;
    const files = await File.find({ title: titleId }).populate("title").exec();

    if (!files || files.length === 0) {
      return res.status(204).send([]);
    }

    res.status(200).send(files);
  } catch (err) {
    res.status(500).send({
      message: "שגיאה בהבאת קבצים לפי כותרת",
      error: err.message,
    });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().populate("title").exec();
    res.status(200).send(files);
  } catch (err) {
    res.status(500).send({ message: "שגיאה בהבאת הקבצים", error: err.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).send({ message: "קובץ לא נמצא" });
    }

    res.download(file.path, file.name);
  } catch (err) {
    res.status(500).send({
      message: "שגיאה בהורדת קובץ",
      error: err.message,
    });
  }
};

const deleteFileFunction = async (fileId) => {
  const file = await File.findById(fileId);
  if (!file) throw new Error("File not found");

  try {
    await fs.promises.unlink(path.resolve(file.path));
  } catch (err) {
    if (err.code !== "ENOENT") throw err; // מסמך שלא נמצא - ממשיכים למחוק מה-DB
  }

  await File.deleteOne({ _id: fileId });
};

const deleteFile = async (req, res) => {
  const { fileId } = req.params;

  try {
    await deleteFileFunction(fileId);
    res.status(200).send({ message: "קובץ נמחק בהצלחה" });
  } catch (err) {
    console.error("שגיאה במחיקת הקובץ:", err.message);
    res.status(500).send({
      message: "שגיאה במחיקת קובץ",
      error: err.message,
    });
  }
};


const updateFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const existingFile = await File.findById(fileId);
    if (!existingFile) {
      return res.status(404).send({ message: "קובץ לא נמצא" });
    }

    if (!req.file) {
      return res.status(400).send({ message: "לא נבחר קובץ חדש לעדכון" });
    }

    const oldFilePath = path.join(__dirname, "..", existingFile.path);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }

    existingFile.name = req.file.originalname;
    existingFile.path = req.file.path;
    existingFile.size = Number((req.file.size / 1024).toFixed(2));
    await existingFile.save();

    res.status(200).send(existingFile);
  } catch (err) {
    console.error("שגיאה בעדכון קובץ:", err);
    res.status(500).send({ message: "שגיאה בעדכון קובץ", error: err.message });
  }
};



const viewFileContent = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).send({ message: "קובץ לא נמצא" });
    }

    const absolutePath = path.resolve(file.path);
    const contentType = mime.lookup(file.name) || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");

    const stream = fs.createReadStream(absolutePath);
    stream.pipe(res);

    stream.on("error", (err) => {
      res.status(500).send({
        message: "שגיאה בקריאת הקובץ",
        error: err.message,
      });
    });
  } catch (err) {
    res.status(500).send({
      message: "שגיאה בהצגת תוכן הקובץ",
      error: err.message,
    });
  }
};

module.exports = {
  uploadFile,
  getFilesByTitle,
  getAllFiles,
  downloadFile,
  deleteFileFunction,
  deleteFile,
  updateFile,
  viewFileContent,
};