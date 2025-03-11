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
 
        {/* <UpdateUser updateUser={updateUser} setVisible={setVisible}  visible={visible} user={props.user}/> */}
 
 
         </>
     )
 }
 
 
 export default User