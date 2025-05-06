const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
require('dotenv').config();

//פונקצית שליחת מייל
const sendEmail = async (to, subject, html) => {


    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.OUTLOOK_USER,
            pass: process.env.OUTLOOK_PASS,
        },
    });
    const mailOptions = {
        from: process.env.OUTLOOK_USER,
        to: to,
        subject: subject,
        html: html,
        replyTo: '',
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
};



//get all user

const getAllUser = async (req, res) => {

    const users = await User.find().lean()
    if (!users?.length)
        return res.status(404).json({ message: 'No users found' })
    res.json(users)
}



//update

const updateUser = async (req, res) => {
    const { _id, name, phone, email } = req.body
    const user = await User.findById(_id)
    if (!user)
        return res.status(400).json({ message: 'No user found' })
    user.name = name
    user.email = email
    user.phone = phone
    const updateUser = await user.save()
    if (!updateUser) { return res.status(201).send("The update failed") }
    res.json(updateUser)
}




//register

const register = async (req, res) => {
    console.log("jjj");
    const { password, name, email, phone } = req.body
    if (!name || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    console.log("ppp");
    const duplicate = await User.findOne({ email: email }).lean()
    if (duplicate) {
        console.log("lll");
        return res.status(409).json({ message: "Duplicate email" })
    }

    const hashedpwd = await bcrypt.hash(password, 10)
    const userobject = { name, email, phone, confirm: false, roles: "User", password: hashedpwd }
    const user = await User.create(userobject)

    if (!user) {
        return res.status(400).json({ message: 'Invalid user received' })
    }
    const projectLink = 'http://localhost:3000'; // שימי כאן את הקישור לפרויקט


    const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color:rgb(23, 86, 221);">New Registration Pending Approval</h2>
        <p>
            A new user has registered: <strong>${name}</strong> (<a href="mailto:${email}" style="color:rgb(23, 86, 221);">${email}</a>).
        </p>
        <p>
            The user is waiting for approval. You can access the system through the link below:
        </p>
        <p>
            <a href="${projectLink}" style="display: inline-block; text-decoration: none; background-color: rgb(23, 86, 221); color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                Go to the Website
            </a>
        </p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 0.9em; color: #888;">This is an automated email. Please do not reply to it.</p>
    </div>
`;

    sendEmail(process.env.OUTLOOK_Admin, 'New Registration on Final Project 🎉', emailHtml)

    return res.status(201).json({

        message: `New user ${user.email} created`
    })


};









//login
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({ message: 'All fields are required' })
    const foundUser = await User.findOne({ email }).lean()
    console.log(foundUser)
    if (!foundUser) {
        console.log("*********")
        return res.status(401).json({ message: 'Cant connect' })

    }

    const Match = await bcrypt.compare(password, foundUser.password)
    console.log(Match)
    console.log(password)
    console.log(foundUser.password)
    if (!Match) return res.status(401).json({ message: 'Cant connect' })


    if (!foundUser.confirm && foundUser.roles != "Admin") {
        return res.status(403).json({ message: 'You are not confirmed to login yet.' });
    }

    const NewUser = {
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        roles: foundUser.roles

    }

    const accessToken = jwt.sign(NewUser, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken, user: NewUser })


}
const confirmUser = async (req, res) => {
    const { _id } = req.body

    const user = await User.findById(_id).exec()
    if (!user)
        return res.status(400).json({ message: 'No user found' })

    user.confirm = !user.confirm
    // user.roles="User"
    const updateUser = await user.save()
    const users = await User.find().lean()
    const projectLink = 'http://localhost:3000';
    //sent email:
    if (user.confirm) {
        try {
            await sendEmail(
                user.email,
                'New Registration on Final Project 🎉',
                `<p>You are avalable to go in</p>
                <p>You avalable to log in.</p>
                 <p>You can view the project here: <a href="${projectLink}">${projectLink}</a></p>`
            );
        }
        catch (err) {
            console.error('Failed to send email:', err);
        }
    }
    res.json(users)
}

const deleteUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user)
        return res.status(400).json({ message: 'No user found' })
    const result = await user.deleteOne()
    // const users = await User.find().lean()
    // if (!users?.length)
    //     return res.status(400).json({ message: 'No users found' })
    res.json(user)

}



module.exports = { register, login, getAllUser, updateUser, deleteUser, confirmUser }




