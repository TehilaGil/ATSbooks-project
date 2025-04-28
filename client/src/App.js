
import './index.css';
import './flags.css';
import './App.css';
import UpdateUser from './Components/UserUpdate';

import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import React, { Suspense, useState, useEffect } from 'react';
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
const LazyLogin = React.lazy(() => import('./Components/login'));
const LazyUser = React.lazy(() => import('./Components/Users'));
const LazyUpdateUser = React.lazy(() => import('./Components/UserUpdate'));
const LazyBook = React.lazy(() => import('./Components/Books'));
const LazyTittles = React.lazy(() => import('./Components/Tittels'));




function App() {
  const [user, setUser] = useState({ name: "UserName" });
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

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
    ...(!user || user.name === "UserName" ? [{
      label: 'Register',
      icon: 'pi pi-user-plus',
      command: () => {
        navigate('./Register');
        setMenuVisible(false);
      }
    }] : [{
      label: 'Update User',
      icon: 'pi pi-user-edit',
      command: () => {
        setShowUpdateDialog(true)
        setMenuVisible(false);
      }
    }]),

    {
      label: user && user.name !== "UserName" ? 'Logout' : 'Login',
      icon: 'pi pi-user',
      command: () => {
        if (user && user.name !== "UserName") {
          setUser({ name: "UserName", confirm: false });
          setMenuVisible(false);
          navigate('/Home');
        } else {
          navigate('/Login');

        }
      }
    }
  ];

  // הכפתור בצד ימין, עם שם המשתמש, לצד החץ
  const end = (
    <div className="user-container">
      <div className="user-name">{user.name}{user.name !== "UserName" && user.confirm === false && (
        <p className="avalable"><br />You are not confirmed</p>
      )}</div>
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
    {
      label: 'Books',
      icon: 'pi pi-user',
      command: () => {
        navigate('./Books');
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
      <UserProvider userCon={user}>

        <Routes>
          <Route path='/Login' element={<Suspense fallback="loading..."><LazyLogin setUserFunc={setUserCallback} /></Suspense>} />
          {/* <Route path='/Login'  setUserFunc={setUserCallback} element={<Suspense fallback="loading..."><LazyLogin /></Suspense>} /> */}
          <Route path='/Home' element={<Suspense fallback="loading..."><LazyHome /></Suspense>} />
          <Route path='/Grades' element={<Suspense fallback="loading..."><LazyGrade /></Suspense>} />
          <Route path='/Users' element={<Suspense fallback="loading..."><LazyUser /></Suspense>} />
          <Route path='/LogOut' element={<Suspense fallback="loading..."><LazyLogOut /></Suspense>} />
          <Route path='/Register' element={<Suspense fallback="loading..."><LazyRegister /></Suspense>} />
          <Route path='/Update' element={<Suspense fallback="loading..."><LazyUpdateUser user={user} setUserFunc={setUserCallback} /></Suspense>} />
          <Route path='/Books' element={<Suspense fallback="loading..."><LazyBook /></Suspense>} />
          <Route path="/Book/:bookName" element={<Suspense fallback="loading..."><LazyTittles /></Suspense>} />
          <Route path="/Grades/:gradeName" element={<Suspense fallback="loading..."><LazyHome /></Suspense>} />



        </Routes>
        <UpdateUser
          visible={showUpdateDialog}
          onHide={() => setShowUpdateDialog(false)}

          user={user}
          setUserFunc={setUserCallback}
        />
      </UserProvider>
    </div>

  );
}

export default App;









