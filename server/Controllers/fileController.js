const File = require("../models/File"); 
const fs = require("fs");
const path = require("path");
const mime = require('mime-types');


const uploadFile = async (req, res) => {
  try {
    const { title } = req.body; 

    if (!req.file) {
      return res.status(400).send({ message: "לא נבחר קובץ להעלאה" });
    }

    const newFile = await File.create({
      name: req.file.originalname,
      path: req.file.path,
      // type: req.file.mimetype.split('/')[1],
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
    const files = await File.find({ title: titleId }).populate('title').exec();

    if (files.length === 0) {
      return res.status(204).send([]);
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

    // מצא את הקובץ במסד הנתונים
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).send({ message: "קובץ לא נמצא" });
    }

    // מחק את הקובץ מהשרת (פיזית)
    await fs.promises.unlink(path.resolve(file.path));

    // מחק את הרשומה ממסד הנתונים
    await File.deleteOne({ _id: fileId });

    res.status(200).send({ message: "קובץ נמחק בהצלחה" });
  } catch (err) {
    console.error("שגיאה במחיקת הקובץ:", err.message);

    // בדוק אם השגיאה נגרמה מכך שהקובץ לא נמצא במערכת הקבצים
    if (err.code === 'ENOENT') {
      // אם הקובץ לא נמצא פיזית, מחק רק את הרשומה ממסד הנתונים
      await File.deleteOne({ _id: req.params.fileId });
      return res.status(200).send({ message: "הרשומה נמחקה, אך הקובץ לא נמצא במערכת הקבצים" });
    }

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
      file.name = newFile.originalname.toLowerCase();
      file.path = newFile.path;
      // file.type = newFile.mimetype.split("/")[1]; // לדוג' "pdf", "jpeg"
      file.size = Number((newFile.size / 1024).toFixed(2))
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
// const viewFileContent = async (req, res) => {
//   try {
//     const { fileId } = req.params;
//     const file = await File.findById(fileId);

//     if (!file) {
//       return res.status(404).send({ message: "קובץ לא נמצא" });
//     }
//     // שליחת תוכן הקובץ
//     res.sendFile(path.resolve(file.path));
//   } catch (err) {
//     res.status(500).send({ message: "שגיאה בהצגת תוכן הקובץ", error: err.message });
//   }
// };

const viewFileContent = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).send({ message: "קובץ לא נמצא" });
    }

    const absolutePath = path.resolve(file.path);
    const contentType = mime.lookup(file.name) || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'inline'); // מאפשר הצגה בתוך iframe

    // זרימת נתונים (stream) לתמיכה בקבצים גדולים
    const stream = fs.createReadStream(absolutePath);
    stream.pipe(res);

    stream.on('error', (err) => {
      res.status(500).send({ message: "שגיאה בקריאת הקובץ", error: err.message });
    });
  } catch (err) {
    res.status(500).send({ message: "שגיאה בהצגת תוכן הקובץ", error: err.message });
  }

  
};

module.exports = {
  viewFileContent,
  uploadFile,
  getAllFiles,
  getFilesByTitle,
  downloadFile,
  deleteFile,
  updateFile
};

