const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
require("dotenv").config();

const nodemailer = require("nodemailer");
const OpenAI = require("openai"); // גרסה חדשה
const { log } = require("console");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function transcribeAudio(filePath) {
  const wavPath = filePath + ".wav";

    return new Promise((resolve, reject) => {
        exec(`ffmpeg -i ${filePath} -ar 16000 -ac 1 -c:a pcm_s16le ${wavPath}`, (err) => {
            if (err) {
                console.error("Error converting file:", err);
                reject("Error converting audio");
                return;
            }

            exec(`whisper ${wavPath} --language English --model small --fp16 False`, (error, stdout, stderr) => {
                if (error) {
                    console.error("Error running whisper:", error);
                    reject("Error during transcription");
                    return;
                }
                resolve(stdout);
            });
        });
    });
}


const handleCourseSubmission = async (req, res) => {
  console.log("1111");

  if (!req.file) {
    console.log("No audio file uploaded");
    return res.status(400).send("No audio file uploaded");
  }
  console.log(req.file);

  const filePath = path.join(__dirname, "..", req.file.path);
  console.log("333");

  try {
    const transcript = await transcribeAudio(filePath);
    const prompt = `This is a transcript in English. Please rate the English level from 1 to 10 and provide a short feedback. Text: "${transcript}"`;
    console.log("444");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
    });

    const result = completion.choices[0].message.content.trim();
    const level = parseInt(result.match(/\d+/)[0], 10);
    const feedback = result.replace(/\d+/g, "").trim();

    const { firstName, lastName, schoolName, email, grade } = req.body;

    const emailBody = `
📋 New English Course Sign-Up Request:
👤 Name: ${firstName} ${lastName}
🏫 School: ${schoolName}
✉️ Email: ${email}
🎓 Grade: ${grade}
📈 English Level: ${level}
📝 Feedback: ${feedback}
`;

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS, // סיסמת אפליקציה
    //   },
    // });

    // const mailOptions = {
    //   from: `"Course Bot" <${process.env.EMAIL_USER}>`,
    //   to: process.env.ADMIN_EMAIL,
    //   subject: "New English Course Registration",
    //   text: emailBody,
    //   attachments: [
    //     {
    //       filename: req.file.originalname,
    //       path: filePath,
    //     },
    //   ],
    // };

    // await transporter.sendMail(mailOptions);

    fs.unlinkSync(filePath); // מחיקת הקובץ
    console.log("File deleted successfully");
    res.json({ firstName, level, feedback });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing the file");
  }
};

module.exports = { handleCourseSubmission };
