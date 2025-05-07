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
import '../Styles/from.css'


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
         <div className="min-h-screen flex items-center justify-center bg-white">
  <form className="space-y-4 p-6 border rounded-md shadow bg-white">
                    <h2 className="text-2xl font-semibold text-center">Create an account</h2>
        
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => validateName(e.target.value)}
                        className={`w-full h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.name && <small className="text-red-500">{errors.name}</small>}
        
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => validateEmail(e.target.value)}
                        className={`w-full h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.email && <small className="text-red-500">{errors.email}</small>}
        
                    <Password
                        value={password}
                        onChange={(e) => validatePassword(e.target.value)}
                        placeholder="Password"
                        toggleMask
                        className={`w-full ${errors.password ? "p-invalid" : ""}`}
                        inputClassName="w-full h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    {errors.password && <small className="text-red-500">{errors.password}</small>}
        
                    <input
                        type="text"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => validatePhone(e.target.value)}
                        className={`w-full h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.phone && <small className="text-red-500">{errors.phone}</small>}
        <br/>
                    <Button
                        onClick={() => createUser(name, email, phone, password)}
                        label="register"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md disabled:opacity-50"
                        disabled={!isFormValid}
                    />
                    </form>
                </div>
         
        );
        
        
};

export default Register;
