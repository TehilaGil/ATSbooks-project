

// import React, { useState, useEffect } from 'react'; 
// import { Divider } from 'primereact/divider';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

// import { setToken, logOut } from '../redux/tokenSlice'




// const Login = () => {
//     const [userCon, setUserCon] = useState(null); // Initializing userCon with null
//     const [error, setError] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const {token} = useSelector((state) => state.token);
//     const {user} = useSelector((state) => state.token);


// const login = async () => {
//     if (email && password) {
//         try {
//             console.log(email);
//             console.log(password);
//             const res = await axios.post('http://localhost:7000/api/user/login', { email, password });
//             console.log(email);
//             console.log(password);
//             if (res && res.status === 200) {
//                 dispatch(setToken({token:res.data.accessToken,user:res.data.user}))
//         navigate('../home'); // ניווט אחרי השינוי

//                 console.log(res.data);
//             }
//         } catch (err) {
//             if (err.response && err.response.status === 401) {
//                 setError('You are not authorized.');
//             } else if (err.response && err.response.status === 403) {
//                 setError('Your account has not been confirmed yet.');
//             } else {
//                 setError('An error occurred, please try again.');
//             }
//         }
//     } else {
//         setError('Please fill in both email and password.');
//     }
// };


//     return (
//         <div className="card">
//             <div className="flex flex-column md:flex-row">
//                 <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
//                     <div className="flex flex-wrap justify-content-center align-items-center gap-2">
//                         <label className="w-6rem">Email</label>
//                         <InputText
//                             onChange={(e) => setEmail(e.target.value)}
//                             id="username"
//                             type="text"
//                             className="w-12rem"
//                         />
//                     </div>
//                     <div className="flex flex-wrap justify-content-center align-items-center gap-2">
//                         <label className="w-6rem">Password</label>
//                         <InputText
//                             onChange={(e) => setPassword(e.target.value)}
//                             id="password"
//                             type="password"
//                             className="w-12rem"
//                         />
//                     </div>
//                     <div className="form-group">
//                     {/* <label htmlFor="password">Password</label> */}
//                     <a href="#" className="forgot-password">Forgot password?</a>

//             </div>
//                     {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error if exists */}
//                     <Button
//                         onClick={login} 
//                         label="Login" 
//                         icon="pi pi-user" 
//                         className="w-10rem mx-auto"
//                     />

//                 </div>

//             </div>

//         </div>
//     );
// };

// export default Login;

// import React, { useState } from 'react';

// import axios from 'axios';

// import { Password } from 'primereact/password'; // Correct import for Password
// import { InputText } from 'primereact/inputtext'; // Correct import for InputText
// import { Button } from 'primereact/button'; // Correct import for Button
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';


import React, { useState, useEffect } from 'react';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Password } from 'primereact/password'; // Correct import for Password
import { setToken, logOut } from '../redux/tokenSlice'
import '../Styles/login.css'



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [forgotPassword, setForgotPassword] = useState(false); // Toggle for "Forgot Password"
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [validationError, setValidationError] = useState(''); // For password validation errors

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.token);
    const { user } = useSelector((state) => state.token);



    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [forgotPassword, setForgotPassword] = useState(false);
    const [verificationStep, setVerificationStep] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    // const [newPassword, setNewPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    // const [error, setError] = useState('');
    // const [successMessage, setSuccessMessage] = useState('');



    const handlePasswordReset = async () => {

        validatePassword(newPassword);
        
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:7000/api/user/reset-password-with-code', {
                email,
                verificationCode,
                newPassword
            });
            if (res && res.status === 200) {
                dispatch(setToken({token:res.data.accessToken,user:res.data.user}))

                console.log("❤❤❤❤❤❤❤❤❤"+token)
                console.log("🥼🎨🖼🖼🖼🖼👔🧵🧵"+res);
        navigate('../home'); // ניווט אחרי השינוי

                setSuccessMessage('Password has been reset successfully. You can now log in.');
                setForgotPassword(false);
                setVerificationStep(false);
            }
        } catch (err) {
            setError('Failed to reset password. Please check the verification code and try again.');
        }
    };

    const sendVerificationCode = async () => {
        try {
            const res = await axios.post('http://localhost:7000/api/user/send-verification-code', { email });
            if (res && res.status === 200) {
                alert("A verification code will be sent to your email.")
                setVerificationStep(true);
                setSuccessMessage('Verification code sent to your email.');
            }
        } catch (err) {
            setError('Failed to send verification code. Please try again.');
        }
    };

    const login = async () => {
        if (email && password) {
            try {
                console.log(email);
                console.log(password);
                const res = await axios.post('http://localhost:7000/api/user/login', { email, password });
                console.log(email);
                console.log(password);
                if (res && res.status === 200) {
                    dispatch(setToken({ token: res.data.accessToken, user: res.data.user }))
                    navigate('../home'); // ניווט אחרי השינוי

                    console.log(res.data);
                }
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('You are not connect- There is a problem with the data you entered.');
                } else if (err.response && err.response.status === 403) {
                    setError('Your account has not been confirmed yet.');
                } else {
                    setError('An error occurred, please try again.');
                }
            }
        } else {
            setError('Please fill in both email and password.');
        }
    };



    const validatePassword = (value) => {
        if (!value) {
            setValidationError('Password is required.');
        } else if (value.length < 6) {
            setValidationError('Password must be at least 6 characters long.');
        } else if (!/[A-Z]/.test(value)) {
            setValidationError('Password must contain at least one uppercase letter.');
        } else if (!/[a-z]/.test(value)) {
            setValidationError('Password must contain at least one lowercase letter.');
        } else if (!/[0-9]/.test(value)) {
            setValidationError('Password must contain at least one digit.');
        } else {
            setValidationError(''); // Clear validation error
        }
    };

return (
    <div className="login-page-container">
        <h2 className="login-title">Sign in to ATS-books</h2>
        {!forgotPassword ? (
            <>
                <div className="login-input-wrapper">
                    <label htmlFor="email" className="login-label">Email address</label>
                    <InputText
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        className="login-input"
                    />
                </div>
                <div className="login-input-wrapper">
                    <label htmlFor="password" className="login-label">Password</label>
                    <InputText
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="login-input"
                    />
                </div>
                <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setForgotPassword(true); }}
                    className="btn-secondary forgot-password-link"
                >
                    Forgot Password?
                </a>
                <button onClick={login} className="login-button">
                    Login
                </button>
            </>
        ) : verificationStep ? (
            <>
                <div className="login-input-wrapper">
                    <label htmlFor="verification-code" className="login-label">Verification Code</label>
                    <InputText
                        id="verification-code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        type="text"
                        className="login-input"
                    />
                </div>
                <div className="login-input-wrapper">
                    <label htmlFor="new-password" className="login-label">New Password</label>
                    <Password
                        inputId="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        toggleMask
                        className="login-input"
                    />
                </div>
                <div className="login-input-wrapper">
                    <label htmlFor="confirm-password" className="login-label">Confirm Password</label>
                    <Password
                        inputId="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        toggleMask
                        className="login-input"
                    />
                </div>
                <button
                    onClick={handlePasswordReset}
                    className="login-button"
                >
                    Reset Password
                </button>
            </>
        ) : (
            <>
                <div className="login-input-wrapper">
                    <label htmlFor="email" className="login-label">Email address</label>
                    <InputText
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        className="login-input"
                    />
                </div>
                <button
                    onClick={sendVerificationCode}
                    className="login-button"
                >
                    Send Verification Code
                </button>
            </>
        )}
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
);
};

export default Login;