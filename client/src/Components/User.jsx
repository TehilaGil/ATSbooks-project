import { useState } from "react"
 import { Card } from 'primereact/card';
 import { Button } from 'primereact/button';
 import { Dialog } from 'primereact/dialog';
 
 import UpdateUser from "./UserUpdate"
 
 import 'primeicons/primeicons.css';
 import axios from 'axios'
 
 const User = (props) => {
     const [visible, setVisible] = useState(false);
 
 
     //**********updateUser
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
         try {
             const res = await axios.put('http://localhost:7000/api/user', UpdateUser)
             if (res.status === 200) {
 
                 console.log("res.data", res.data);
                 props.setUsersData(res.data)
             }
         } catch (e) {
             console.error(e)
         }
     }
 
     //************delete
     // const deleteUser = async (id) => {
     //     const res = await axios.delete(`http://localhost:7000/api/user/${id}`)
     //     props.setUsersData(res.data)
     // }
 
 
     //***********return
 
     return (
         <>
 
             {/* <Card name={props.user.name}>
                 <p className="m-0">
                 <div className="card flex flex-wrap gap-2 justify-content-center">
                     
                     <Button icon="pi pi-pencil" onClick={() => setVisible(true)} />
                     </div>
                     <UpdateUser updateUser={updateUser} setVisible={setVisible}  visible={visible} user={props.user}/>
                 </p>
             </Card> */}
 
 
 
 
         </>
     )
 }
 
 
 export default User