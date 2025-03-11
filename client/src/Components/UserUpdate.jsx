
import React, { useEffect,useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';

 
 import 'primeicons/primeicons.css';
 import axios from 'axios'

const UpdateUser=(props)=>{
    useEffect(() => {
        if (userCon) {
            console.log("Setting user:", userCon);
            props.setUserFunc(userCon); // עדכון המשתמש בקונטקסט
            navigate('/home'); // ניווט אחרי השינוי
        setVisible(true);
        }

    }, []);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [userCon, setUserCon] = useState(null);
    const updateUser = async (nameRef, passwordRef, emailRef, phoneRef) => {
 
        console.log(nameRef.current.value ? nameRef.current.value : props.user.name)
        const UpdateUser = {
            ...props.user,
            name: nameRef.current.value ? nameRef.current.value : props.user.name,
            password: passwordRef.current.value ? passwordRef.current.value : props.user.Username,
            email: emailRef.current.value ? emailRef.current.value : props.user.email,
            //address: addressRef.current.value ? addressRef.current.value : props.user.address,
            phone: phoneRef.current.value ? phoneRef.current.value : props.user.phone
        }
        setUserCon(UpdateUser.name)
        try {
            const res = await axios.put('http://localhost:7000/api/user', UpdateUser)
            if (res.status === 200) {

                console.log("res.data", res.data);
                // props.setUsersData(res.data)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const usernameRef = useRef("")
    const passwordRef=useRef("")
    const nameRef = useRef("")
    const emailRef = useRef("")
    const phoneRef = useRef("")
    

return(

  
        <Dialog
            visible={visible}
            modal
            onHide={() => {if (!visible) return; setVisible(false); }}
            content={({ hide }) => (
                <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="username" className="text-primary-50 font-semibold">
                        name
                        </label>
                        <InputText id="name" label="name" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="name" ref={nameRef} defaultValue={props.user.name} required="required"></InputText>
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="username" className="text-primary-50 font-semibold">
                        password
                        </label>
                        <InputText id="username" label="Username" className="bg-white-alpha-20 border-none p-3 text-primary-50" ref={passwordRef} defaultValue={props.user.password}></InputText>
                    </div>
                    
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="username" className="text-primary-50 font-semibold">
                        email
                        </label>
                        <InputText id="name" label="name" className="bg-white-alpha-20 border-none p-3 text-primary-50"  ref={emailRef} defaultValue={props.user.email}></InputText>
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="username" className="text-primary-50 font-semibold">
                        phone
                        </label>
                        <InputText id="name" label="name" className="bg-white-alpha-20 border-none p-3 text-primary-50"  ref={phoneRef} defaultValue={props.user.phone}></InputText>
                    </div>
                    <div className="flex align-items-center gap-2">
                        <Button label="Update" onClick={(e) =>{ updateUser(nameRef,passwordRef,emailRef,phoneRef); hide(e)}} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        <Button label="Cancel" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                    </div>
                </div>
            )}
        ></Dialog>
   
)
}
export default UpdateUser