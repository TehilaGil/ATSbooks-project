import React, { useState, useEffect } from 'react';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { register } from '../../../Server/Controllers/userController';
import { Password } from 'primereact/password';
import  {FloatLabel}  from 'primereact/floatlabel';

import { useContext } from 'react';

const Register = () => {
    // const [userCon, setUserCon] = useState(null); // Initializing userCon with null
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({
        email: "",
        name: "",
        password: "",
        phone: "",
    });
    const navigate = useNavigate();
    
    
  
const createUser = async (name, email, phone, password) => {
        const newUser = {
            name,
            email,
            phone,
            password
        };

        try {
            const res = await axios.post('http://localhost:7000/api/user/register', newUser);
            if(res.status===409)
                alert("email exits")
            if (res.status === 200 || res.status === 201) {
                console.log("res.data", res.data);
                alert("Your request to join has been sent to the site administrator. You will receive an email notification when your request is approved.")
                navigate('/login')
                // getUsers()
                // setSource(prevSource => prevSource.filter(user => user._id !== res._id)); 
                //  setTarget(prevTarget => prevTarget.filter(user => user._id !== res._id))
            }
        } catch (e) {
            console.error(e);
        }
    };

    // useEffect hook to handle redirection after successful login

    useEffect(() => {

        // Set user in parent component
        // navigate('/login'); // Navigate to home page after login
        // Trigger validation when the form is loaded to display initial error messages for empty fields. //****
        validateEmail(email); //****
        validateName(name); //****
        validatePassword(password); //****
    }, [email, name, password]);


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
            setErrors((prev) => ({ ...prev, phone:"The phone number can only contain digits."}));
        } else if (value.length > 10) {
            setErrors((prev) => ({ ...prev, phone:"The phone number can contain up to 10 digits only."}));
        } else {
            setErrors((prev) => ({ ...prev, phone: "" }));
        }
        setPhone(value);
    };
    const isFormValid = Object.values(errors).every((error) => error === "") &&
        email && name && password;





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
                    {errors.password && <small className="p-error">{errors.password}</small>}



                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Phone</label>
                        <InputText
                            onChange={(e) => { validatePhone(e.target.value); setPhone(e.target.value) }}
                            id="username"
                            type="text"

                            className={`w-12rem ${errors.phone ? "p-invalid" : ""}`}

                        />
                    </div>
                    {errors.phone && <small className="p-error">{errors.phone}</small>}


                    {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error if exists */}

                    {/* <Button
                        onClick={createUser(name,email,phone,password)}
                        label="register"
                        icon="pi pi-user"
                        className={`w-10rem mx-auto ${errors.phone ? "p-button-secondary opacity-50 cursor-not-allowed" : ""}`}
                        //disabled={!!errorPhone && !!phone}
                        disabled={!isFormValid}
                    /> */}
<Button
    onClick={() => createUser(name, email, phone, password)}
    label="Register"
    icon="pi pi-user"
    className={`w-10rem mx-auto ${errors.phone ? "p-button-secondary opacity-50 cursor-not-allowed" : ""}`}
    disabled={!isFormValid}
/>
                </div>
            </div>
        </div>
    );
};

export default Register;
