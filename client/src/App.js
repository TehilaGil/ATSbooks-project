// import './index.css';
// import './flags.css';
// import './App.css';

// import { PrimeReactProvider } from 'primereact/api';

// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';
// import 'primereact/resources/primereact.css';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import  { Suspense, useState } from 'react';
// import userName from './Context/UserName';

// import React from 'react'; 
// import { Menubar } from 'primereact/menubar';
// import { useNavigate } from 'react-router-dom';
// //import userName from './Context'

// import { Link, Route, Routes } from 'react-router-dom'

// const LazyGrade = React.lazy(() => import('./Components/Grades'))
// const LazyHome = React.lazy(() => import('./Components/Home'))
// const LazyLogOut = React.lazy(() => import('./Components/LogOut'))

// //import App from './App';
// function App() {
//   const [name, setName] = useState("userName")
//   const navigate = useNavigate();
//   const items = [
//         {
//             label: 'Home',
//             icon: 'pi pi-home',
//             command: () => {
//               navigate('./Home')
//         }
//       },
//         {
//             label: 'Grades',
//             icon: 'pi pi-user',
//             command: () => {
//              navigate('./Grades')
//           }
//         },
//         {
//           label: name,
//           icon: 'pi pi-user',
//           command: () => {
//            navigate('./LogOut')
//         }
//       }
//     ];
    
//   return (
//       <div className="App">
//         <div className="card">
//             <Menubar model={items} />
//         </div>
        
//      <div id="navbar">
//        </div>
 
//       <userName.Provider value={{ name, setName }} >
//        <Routes> 
//        <Route path='/Home' element={<Suspense fallback="loading..."><LazyHome  /></Suspense>} />
//        <Route path='/Grades' element={<Suspense fallback="loading..."><LazyGrade  /></Suspense>} />
//        <Route path='/LogOut' element={<Suspense fallback="loading..."><LazyLogOut  /></Suspense>} />
//        </Routes>
//        </userName.Provider>
//     </div>
//   );
// }

// export default App;



import './index.css';
import './flags.css';
import './App.css';

import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import React, { Suspense, useState ,useEffect} from 'react';
import userName from './Context/UserName';

// import UserProvider from './Context/Provider';

import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { Button } from 'primereact/button';
import UserProvider from './Context/Provider';

const LazyGrade = React.lazy(() => import('./Components/Grades'));
const LazyHome = React.lazy(() => import('./Components/Home'));
const LazyLogOut = React.lazy(() => import('./Components/LogOut'));
const LazyRegister = React.lazy(() => import('./Components/Register'));
const LazyLogin= React.lazy(() => import('./Components/login'));
const LazyUser = React.lazy(() => import('./Components/Users'));

function App() {
  const [user, setUser] = useState("UserName");
  // const [name, setName] = useState("UserName");
  const [menuVisible, setMenuVisible] = useState(false); // מצב הצגת התפריט
  const navigate = useNavigate();
  const setUserCallback = (user) => {
    setUser(user);
  }

  useEffect(() => {
    console.log("User state in App updated:", user);
}, [user]);
  // הגדרת אפשרויות בתפריט הירידה (Register, LogOut)
  const userMenu = [
    ...(!user || user === "UserName" ? [{
      label: 'Register',
      icon: 'pi pi-user-plus',
      command: () => {
        navigate('./Register');
        setMenuVisible(false);
      }
    }] : []),
    
    {
      label: user && user !== "UserName" ? 'Logout' : 'Login',
      icon: 'pi pi-user',
      command: () => {
        if (user && user !== "UserName") {
            setUser("UserName"); // ✅ איפוס המשתמש
            setMenuVisible(false); // סגירת התפריט
            navigate('/Home'); // ✅ חזרה לדף הבית
        } else {
            navigate('/Login');
        }
      }
  }
  ];

  // הכפתור בצד ימין, עם שם המשתמש, לצד החץ
  const end = (
    <div className="user-container">
      <span className="user-name">{user}{!user.confirm}<p className="avalable"><br/>You not avalable</p></span>
      <Button
        icon="pi pi-caret-down"
        className="user-dropdown"
        onClick={() => setMenuVisible(!menuVisible)}
        style={{ marginLeft: '5px', background: 'transparent', border: 'none' }}
      />
      {menuVisible && (
        <div className="dropdown-menu">
          {userMenu.map((item, index) => (
            <div key={index} onClick={item.command}>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => {
        navigate('./Home');
      }
    },
    {
      label: 'Grades',
      icon: 'pi pi-user',
      command: () => {
        navigate('./Grades');
      }
    },
    // user === UserName &&
    
    {
      label: 'Users',
      icon: 'pi pi-user',
      command: () => {
        navigate('./Users');
      }
    }
  ];

  return (
    <div className="App">
      <div className="card">
        <Menubar model={items} end={end} />
      </div>
      <UserProvider  userCon={user}>
     
        <Routes>
        <Route path='/Login' element={<Suspense fallback="loading..."><LazyLogin setUserFunc={setUserCallback} /></Suspense>} />
          {/* <Route path='/Login'  setUserFunc={setUserCallback} element={<Suspense fallback="loading..."><LazyLogin /></Suspense>} /> */}
          <Route path='/Home' element={<Suspense fallback="loading..."><LazyHome /></Suspense>} />
          <Route path='/Grades' element={<Suspense fallback="loading..."><LazyGrade /></Suspense>} />
          <Route path='/Users' element={<Suspense fallback="loading..."><LazyUser /></Suspense>} />
          <Route path='/LogOut' element={<Suspense fallback="loading..."><LazyLogOut /></Suspense>} />
          <Route path='/Register' element={<Suspense fallback="loading..."><LazyRegister /></Suspense>} />
        </Routes>
        </UserProvider>
        </div>

  );
}

export default App;


 



      


