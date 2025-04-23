const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
require('dotenv').config();

//פונקצית שליחת מייל
const sendEmail = async (to, subject, html) => {


    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // כתובת הג'ימייל שלך
            pass: process.env.EMAIL_PASS, // סיסמת האפליקציה שיצרת
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
};



//get all user

const getAllUser = async (req, res) => {

    const users = await User.find().lean()
    if (!users?.length)
        return res.status(400).json({ message: 'No users found' })
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
    const {  password, name, email, phone } = req.body
    if (!name || !password||!email) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    console.log("ppp");
    const duplicate = await User.findOne({ email: email }).lean()
    if (duplicate) {
         console.log("lll");
        return res.status(409).json({ message: "Duplicate email" })
    }
   
    const hashedpwd = await bcrypt.hash(password, 10)
    const userobject = { name, email, phone, password: hashedpwd }
    const user = await User.create(userobject)

    if (user) {
        const projectLink = 'http://localhost:3000'; // שימי כאן את הקישור לפרויקט
        try {
            await sendEmail(
                't0583271152@gmail.com',
                'New Registration on Final Project 🎉',
                `<p>User <strong>${name}</strong> has just registered.</p>
                 <p>You can view the project here: <a href="${projectLink}">${projectLink}</a></p>`
            );
        } catch (err) {
            console.error('Failed to send email:', err);
        }
        return res.status(201).json({
            
            message: `New user ${user.email} created` })
    } else {
        return res.status(400).json({ message: 'Invalid user received' })
    }
}








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


    if (!foundUser.confirm) {
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




