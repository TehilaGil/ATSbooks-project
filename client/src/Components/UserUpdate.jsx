

import React, { useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import 'primeicons/primeicons.css';
import axios from 'axios';

const UpdateUser = (props) => {
    const navigate = useNavigate();
    const [userCon, setUserCon] = useState(null);
    const { setUserFunc }=props
    // const usernameRef = useRef("");
    // const passwordRef = useRef("");
    const nameRef = useRef("");
    const emailRef = useRef("");
    const phoneRef = useRef("");


    useEffect(() => {
        if (userCon && userCon.name !== props.user.name) {
            console.log("Setting user:", userCon);
            setUserFunc(userCon); // עדכון המשתמש בקונטקסט
            navigate('/home'); // ניווט אחרי השינוי
        }
    }, [userCon, setUserFunc, navigate]);
    

    const updateUser = async () => {
        console.log("Updated user:");
        console.log(props.user.name)
        const updatedUser = {
            ...props.user,
            name: nameRef.current.value ? nameRef.current.value : props.user.name,
            email: emailRef.current.value ? emailRef.current.value : props.user.email,
            phone: phoneRef.current.value ? phoneRef.current.value : props.user.phone
        };
        console.log(updatedUser.name)
        console.log(updatedUser.email)
        // console.log(user.name)
        try {
            const res = await axios.put('http://localhost:7000/api/user', updatedUser);
            if (res.status === 200) {
                console.log("Updated user:", res.data);
                
               // // props.setUserFunc(updatedUser.name); // עדכון המשתמש גם באפליקציה
                props.onHide(); // סגירת הדיאלוג
                setUserCon(updatedUser);
                // setUserCon(res.data.user)//
                // navigate('/home'); // מעבר לדף הבית
            }
            
        } catch (e) {
            console.error("Error updating user:", e);
        }
        
    };

    return (
        <Dialog
            visible={props.visible}
            modal
            onHide={props.onHide}
            header="Update User"
        >
            <div className="flex flex-column gap-3">
                <label>Name</label>
                <InputText ref={nameRef} defaultValue={props.user.name} />

                {/* <label>Password</label>
                <InputText ref={passwordRef} defaultValue={props.user.password} /> */}

                <label>Email</label>
                <InputText ref={emailRef} defaultValue={props.user.email} />

                <label>Phone</label>
                <InputText ref={phoneRef} defaultValue={props.user.phone} />

                <div className="flex justify-content-end gap-2 mt-4">
                    <Button label="Update" onClick={updateUser} />
                    <Button label="Cancel" onClick={props.onHide} className="p-button-secondary" />
                </div>
            </div>
        </Dialog>
    );
};

export default UpdateUser;
