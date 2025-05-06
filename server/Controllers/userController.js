const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
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
    console.log(to)
    try {
        console.log('Sending email...');
        const response = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error in sendEmail:', error.message);
        throw error;
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
            The user is waiting for approval. You can access the system through the button below:
        </p>
        <p>
            <a href="${projectLink}" style="display: inline-block; text-decoration: none; background-color: rgb(23, 86, 221); color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                Go to the Website to confirm her
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
    const projectLink = 'http://localhost:3000//login';
    //sent email:

    if (user.confirm) {
        try {
            const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #1756DD;">hi! "${user.name}" Welcome to the Final Project 🎉</h2>
        <p>
            Your registration has been successfully completed! You can now log in and start exploring the project.
        </p>
        <p>
            Click the button below to access the project:
        </p>
        <p>
            <a href="${projectLink}" style="display: inline-block; text-decoration: none; background-color: #1756DD; color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                Go to the Project
            </a>
        </p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 0.9em; color: #888;">If you have any questions, feel free to contact us.</p>
    </div>
`;
            await sendEmail(
                user.email,
                'New Registration on Final Project 🎉',
                emailHtml
            );
        }
        catch (err) {
            console.error('Failed to send email:', err);
        }
    }
    else {
        try {
            const emailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #D9534F;">Access to Final Project Website Blocked 🚫</h2>
                <p>
                    Hello,"${user.name}"
                </p>
                <p>
                    We regret to inform you that your access to the Final Project website has been blocked.
                </p>
                <p>
                    If you believe this is a mistake or you would like to appeal, please contact our support team for further assistance.
                </p>
                <p>
                    <a href="mailto:support@finalproject.com" style="display: inline-block; text-decoration: none; background-color: #D9534F; color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                        Contact Support
                    </a>
                </p>
                <hr style="border: none; border-top: 1px solid #ddd;" />
                <p style="font-size: 0.9em; color: #888;">This is an automated email. Please do not reply to this email.</p>
            </div>
        `;
            await sendEmail(
                user.email,
                'Access to Final Project Website Blocked 🚫',
                emailHtml
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



// Store the verification codes in memory (for simplicity; use a database in production).
const verificationCodes = {};

const sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Generate a random verification code
        const verificationCode = crypto.randomInt(100000, 999999);

        // Store the code along with the user's email
        verificationCodes[email] = verificationCode;

        // Send the verification code via email
        const emailHtml = `
            <p>Your password reset verification code is: <strong>${verificationCode}</strong></p>
            <p>If you did not request this, please ignore this email.</p>
        `;

        await sendEmail(email, 'Password Reset Verification Code', emailHtml);
        console.log(email);
        

        res.status(200).json({ message: 'Verification code sent to email.' });
    } catch (err) {
        console.log("😉🤞🌹💋🐱‍🐉🐱‍👓🐱‍🚀✔✔🤳🤳🎉🎉😎👍👍🎶😎😎");

        res.status(500).json({ message: 'Error sending verification code.', error: err.message });
    }
};

const resetPasswordWithCode = async (req, res) => {
    const { email, verificationCode, newPassword } = req.body;

    if (!email || !verificationCode || !newPassword) {
        return res.status(400).json({ message: 'Email, verification code, and new password are required.' });
    }

    try {
        // Validate the verification code
        if (verificationCodes[email] !== parseInt(verificationCode)) {
            return res.status(400).json({ message: 'Invalid verification code.' });
        }

        // Find the user by email
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        console.log(newPassword);
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;

        // Save the updated user
        await user.save();

        // Remove the verification code (it's no longer needed)
        delete verificationCodes[email];

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error resetting password.', error: err.message });
    }
};


module.exports = { register, login, getAllUser, updateUser, deleteUser, confirmUser,sendVerificationCode,resetPasswordWithCode }




