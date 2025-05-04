require("dotenv").config()
const express=require("express")
const cors=require("cors")
const nodemailer = require('nodemailer');
// const path = require("path");
const corsOptions=require("./config/corsOptions")
const connectDB=require("./config/dbConn.js")
const { default: mongoose } = require("mongoose")

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


const app=express()
const PORT=process.env.PORT||4000
connectDB()

app.use(cors(corsOptions))
app.use(express.json())
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("public"))

app.use("/api/user",require("./routes/user.js"))
app.use("/api/book",require("./routes/book.js"))
app.use("/api/grade",require("./routes/grade.js"))
app.use("/api/title",require("./routes/title.js"))
app.use("/api/file",require("./routes/file.js"))


app.post("/api/cours", upload.single("audioFile"), async (req, res) => {
    console.log("**********************************")
    const { firstName, lastName, schoolName, email, grade } = req.body;
    // const audioFile = req.file;
    const emailBody = `
      📋 New English Course Sign-Up Request:
  
      👤 Name: ${firstName} ${lastName}
      🏫 School: ${schoolName}
      ✉️ Email: ${email}
      🎓 Grade: ${grade}
    `;
  
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ayali73754@gmail.com",
          pass: "YOUR_APP_PASSWORD", // השתמש בסיסמה של אפליקציה
        },
      });
  
      const mailOptions = {
        from: '"Course Bot" <YOUR_EMAIL@gmail.com>',
        to: "ADMIN_EMAIL@gmail.com",
        subject: "New English Course Registration",
        text: emailBody,
        attachments: audioFile
          ? [
              {
                filename: audioFile.originalname,
                content: audioFile.buffer,
              },
            ]
          : [],
      };
  
      await transporter.sendMail(mailOptions);
      res.status(200).send("Email sent successfully!");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error sending email");
    }
  });
  


app.get('/',(req,res)=>{ res.send("this is the home page")})

mongoose.connection.once("open",()=>{
    console.log("succsed")
    app.listen(PORT,()=>{console.log(`server runing on port ${PORT}`)})
    }) 
mongoose.connection.on("error",(err)=>{console.log(err)})
