import React, { useState, useEffect } from 'react';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { register } from '../../../Server/Controllers/userController';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';

// const Login =({setUser}) =>{
//     const [userCon, setUserCon] =useState();
//     const [error, setError] = useState('');
//     const [email, setEmail] = useState();
//     const [password, setPassword] = useState();
//     const navigate = useNavigate();


// const  login=async()=>{
//     if(email && password){
//         console.log(setUser);
//      try{  
//         const res = await axios.post('http://localhost:7000/api/user/login',{email,password})
//         if(res&& res.status === 200){
//             console.log(res);
//             setUserCon(res.data)
//         }} 
//         catch (err) {
//             if (err.response && err.response.status === 401) {
//                 setError('You are not authorized.');
//             } else {
//                 setError('An error occurred, please try again.');

//          } 
//         // if(res.status==401)
//         //     return(<h2>you are not in</h2>)

// }

//     useEffect(() => {
//         if (userCon) {
//         // const navigate = useNavigate();
//           setUser(userCon);
//           navigate('/home');
//         }
//       }, [userCon, setUser, navigate]);
//     return (
//         <div className="card">
//             <div className="flex flex-column md:flex-row">
//                 <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
//                     <div className="flex flex-wrap justify-content-center align-items-center gap-2">
//                         <label className="w-6rem">Email</label>
//                         <InputText  onChange={(e)=>{setEmail(e.target.value)}} id="username" type="text" className="w-12rem" />
//                     </div>
//                     <div className="flex flex-wrap justify-content-center align-items-center gap-2">
//                         <label className="w-6rem">Password</label>
//                         <InputText  onChange={(e)=>{setPassword(e.target.value)}} id="password" type="password" className="w-12rem" />
//                     </div>
//                     <Button  onClick={()=>{login()}} label="Login" icon="pi pi-user" className="w-10rem mx-auto"></Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// }
// }
// export default Login







const Register = () => {
    // const [userCon, setUserCon] = useState(null); // Initializing userCon with null
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');

    const navigate = useNavigate();

    const register = async () => {
        if (email && password && name) {
            try {
                const res = await axios.post('http://localhost:7000/api/user/register', { name, email, password, phone });
                if (res && res.status === 200) {
                    console.log(res);
                    // navigate('/home'); 
                    // setUserCon(res.data); // Store the response data in userCon
                }
            } catch (err) {
                setError('An error occurred, please try again.');
            }
        } else {
            setError('Please fill in both email and password.');
        }
    };

    // useEffect hook to handle redirection after successful login
    useEffect(() => {

        // Set user in parent component
        // navigate('/login'); // Navigate to home page after login

    }, [navigate]); // Dependencies for useEffect
    const [errorPhone, setErrorPhone] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
    });

    const validateEmail = (value) => {
        setEmail(value);
        if (!value) {
            setErrors((prev) => ({ ...prev, email: "This field is required" }));
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
            setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
        } else {
            setErrors((prev) => ({ ...prev, email: "" }));
        }
    };

    const validateName = (value) => {
        setName(value);
        if (!value) {
            setErrors((prev) => ({ ...prev, name: "This field is required" }));
        } else if (value.length < 4) {
            setErrors((prev) => ({ ...prev, name: "At least 4 characters required" }));
        } else {
            setErrors((prev) => ({ ...prev, name: "" }));
        }
    };

    const validatePassword = (value) => {
        setPassword(value);
        if (!value) {
            setErrors((prev) => ({ ...prev, password: "This field is required" }));
        } else if (value.length < 6) {
            setErrors((prev) => ({ ...prev, password: "Minimum 6 characters required" }));
        } else {
            setErrors((prev) => ({ ...prev, password: "" }));
        }
    };

    const validatePhone = (value) => {
        if (!/^\d*$/.test(value)) {
            setErrorPhone("The phone number can only contain digits.");
        } else if (value.length > 10) {
            setErrorPhone("The phone number can contain up to 10 digits only.");
        } else {
            setErrorPhone(""); // No error
        }
        setPhone(value);
    };
    const isFormValid = Object.values(errors).every((error) => error === "") &&
        email && name && password && !errorPhone;





    return (
        <div className="card">
            <div className="flex flex-column md:flex-row">
                <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Name</label>
                        <InputText
                            onChange={(e) => { validateName(e.target.value); setName(e.target.value) }}
                            id="username"
                            type="text"

                            className={`w-12rem ${errors.name ? "p-invalid" : ""}`}

                        />
                    </div>
                    {errors.name && <small className="p-error">{errors.name}</small>}

                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Email</label>
                        <InputText
                            onChange={(e) => { validateEmail(e.target.value); setEmail(e.target.value) }}
                            id="username"
                            type="text"
                            className={`w-12rem ${errors.email ? "p-invalid" : ""}`}
                        />
                    </div>
                    {errors.email && <small className="p-error">{errors.email}</small>}

                    {/* <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Password</label>
                        <InputText
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            type="password"
                            className="w-12rem"
                        />
                    </div> */}

                    <div className="flex flex-wrap justify-content-center align-items-center gap-2" >
                        <label className="w-6rem">Password</label>
                        <FloatLabel >
                            <Password
                                inputId="password"
                                value={password}
                                onChange={(e) => {validatePassword(e.target.value); setPassword(e.target.value)}} toggleMask
                                
                                className={`w-12rem ${errors.password ? "p-invalid" : ""}`}
                                feedback={true}
                                promptLabel="Choose a password" weakLabel="Too simple" mediumLabel="Average complexity" strongLabel="Complex password" />
                        </FloatLabel>
                    </div>


                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Phone</label>
                        <InputText
                            onChange={(e) => { validatePhone(e.target.value); setPhone(e.target.value) }}
                            id="username"
                            type="text"

                            className={`w-12rem ${errorPhone ? "p-invalid" : ""}`}

                        />
                    </div>
                    {errorPhone && <small className="p-error">{errorPhone}</small>}


                    {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error if exists */}

                    <Button
                        onClick={register}
                        label="Register"
                        icon="pi pi-user"
                        className={`w-10rem mx-auto ${errorPhone ? "p-button-secondary opacity-50 cursor-not-allowed" : ""}`}
                        //disabled={!!errorPhone && !!phone}
                        disabled={!isFormValid}
                    />

                </div>
            </div>
        </div>
    );
};

export default Register;
