const File = require("../models/File"); 
const fs = require("fs");
const path = require("path");


const uploadFile = async (req, res) => {
  try {
    const { title } = req.body; 

    if (!req.file) {
      return res.status(400).send({ message: "לא נבחר קובץ להעלאה" });
    }

    const newFile = new File({
      name: req.file.name,        
      path: req.file.path,                 
      type: req.file.mimetype.split('/')[1], 
      size: (req.file.size / 1024).toFixed(2) + " KB", 
      title: title,                       
    });

    await newFile.save();

    res.status(201).send(newFile);
  } catch (err) {
    res.status(500).send({ message: "שגיאה בהעלאת קובץ", error: err.message });
  }
};



const getFilesByTitle = async (req, res) => {
  try {
    const { titleId } = req.params;
    const files = await File.find({ title: titleId }).populate('title').exec();

    if (files.length === 0) {
      return res.status(404).send({ message: "לא נמצאו קבצים תחת כותרת זו" });
    }

    res.status(200).send(files);
  } catch (err) {
    res.status(500).send({ message: "שגיאה בהבאת קבצים לפי כותרת", error: err.message });
  }
};



// שליפת כל הקבצים
const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().populate('title').exec();
    res.status(200).send(files);
  } catch (err) {
    res.status(500).send({ message: "שגיאה בהבאת הקבצים", error: err.message });
  }
};



// הורדת קובץ
const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).send({ message: "קובץ לא נמצא" });
    }

    res.download(file.path, file.name);
  } catch (err) {
    res.status(500).send({ message: "שגיאה בהורדת קובץ", error: err.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).send({ message: "קובץ לא נמצא" });
    }

    // מחיקה מהשרת (פיזית)
    fs.unlink(path.resolve(file.path), async (err) => {
      if (err) {
        return res.status(500).send({ message: "שגיאה במחיקת קובץ מהשרת", error: err.message });
      }

      // מחיקה מהמסד נתונים
      await File.findByIdAndDelete(fileId);

      res.status(200).send({ message: "קובץ נמחק בהצלחה" });
    });
  } catch (err) {
    res.status(500).send({ message: "שגיאה במחיקת קובץ", error: err.message });
  }
};

const updateFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { newName, newTitle } = req.body;
    const newFile = req.file; // אם עלה קובץ חדש

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).send({ message: "קובץ לא נמצא" });
    }

    // אם עלה קובץ חדש, מוחקים את הקובץ הישן מהשרת
    if (newFile) {
      fs.unlink(path.resolve(file.path), (err) => {
        if (err) {
          console.error("שגיאה במחיקת הקובץ הישן:", err.message);
        }
      });

      // מעדכנים פרטי הקובץ במסד נתונים
      file.name = newFile.name.toLowerCase();
      file.path = newFile.path;
      file.type = newFile.mimetype.split("/")[1]; // לדוג' "pdf", "jpeg"
      file.size = newFile.size.toString();
    }

    // גם אם לא עלה קובץ חדש, ניתן לעדכן שם וכותרת
    if (newName) {
      file.name = newName.toLowerCase();
    }
    if (newTitle) {
      file.title = newTitle;
    }

    await file.save();

    res.status(200).send(file);

  } catch (err) {
    res.status(500).send({ message: "שגיאה בעדכון קובץ", error: err.message });
  }
};
module.exports = {
  uploadFile,
  getAllFiles,
  getFilesByTitle,
  downloadFile,
  deleteFile,
  updateFile
};

