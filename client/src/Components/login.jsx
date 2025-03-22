
// import React, { useState ,useEffect} from 'react'; 
// import { Divider } from 'primereact/divider';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';


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


import React, { useState, useEffect } from 'react'; 
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



// const login = async () => {
//     if (email && password) {
//         try {
//             const res = await axios.post('http://localhost:7000/api/user/login', { email, password });
//             if (res && res.status === 200) {
//                 console.log(res.data);
//                 setUserCon(res.data); // עדכון userCon עם הנתונים מהשרת
//             }
//         } catch (err) {
//             if (err.response && err.response.status === 401) {
//                 setError('You are not authorized.');
//             } else {
//                 setError('An error occurred, please try again.');
//             }
//         }
//     } else {
//         setError('Please fill in both email and password.');
//     }
// };
// // עיכוב הניווט עד שהמשתמש נשמר
// useEffect(() => {
//     if (userCon) {
//         setUserFunc(userCon); // עדכון המשתמש בקונטקסט
//         navigate('/home'); // ניווט אחרי השינוי
//     }
// }, [userCon, setUserFunc, navigate]);

const Login = ({ setUserFunc }) => {
    const [userCon, setUserCon] = useState(null); // Initializing userCon with null
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


const login = async () => {
    if (email && password) {
        try {
            console.log(email);
            console.log(password);
            const res = await axios.post('http://localhost:7000/api/user/login', { email, password });
            console.log(email);
            console.log(password);
            if (res && res.status === 200) {
                console.log(res.data);
                setUserCon(res.data.user);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('You are not authorized.');
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
// עיכוב הניווט עד שהמשתמש נשמר
useEffect(() => {
    if (userCon) {
        console.log("Setting user:", userCon);
        setUserFunc(userCon); // עדכון המשתמש בקונטקסט
        navigate('/home'); // ניווט אחרי השינוי
    }
}, [userCon, setUserFunc, navigate]);

    return (
        <div className="card">
            <div className="flex flex-column md:flex-row">
                <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Email</label>
                        <InputText
                            onChange={(e) => setEmail(e.target.value)}
                            id="username"
                            type="text"
                            className="w-12rem"
                        />
                    </div>
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Password</label>
                        <InputText
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            type="password"
                            className="w-12rem"
                        />
                    </div>
                    {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error if exists */}
                    <Button
                        onClick={login} 
                        label="Login" 
                        icon="pi pi-user" 
                        className="w-10rem mx-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
