import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import axios from 'axios'
import User from "./User"
import CreatUser from "./UserCreat"
import { useRef } from 'react';
import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';
import UserProfile from './UserProfile';
import { FaTrashAlt } from 'react-icons/fa'; // אייקון פח (התקן את react-icons אם לא מותקן)
import "../Styles/Users.css"; // או שם הקובץ הרלוונטי

//  const Users = () => {
//      const [usersData, setUsersData] = useState([])
//      const [visibleCreatUser, setVisibleCreatUser] = useState(false);

//      const [source, setSource] = useState([]);
//      const [target, setTarget] = useState([]);

//      //******GET - getAllUsers***** */

//      const getUsers = async () => {

//          try {
//              const res = await axios.get('http://localhost:7000/api/user')
//              if (res.status === 200) {
//                  console.log(res.data);
//                  //setUsersData(res.data)
//                  let arrConifirm = []
//                  let arrNotConifirm = []
//                  res.data.map((user) => {
//                      if (user.conifirm === true)
//                          arrConifirm.push(user)
//                      else
//                          arrNotConifirm.push(user)
//                  })
//                  setSource(arrNotConifirm)
//                  setTarget(arrConifirm)
//              }
//          } catch (e) {
//              console.error(e)
//          }
//      }

//      //******POST - createUser***** */
//      const createUser = async (nameRef, emailRef, phoneRef, passwordRef) => {

//          const newUser = {
//              name: nameRef.current.value ? nameRef.current.value : " ",
//              email: emailRef.current.value ? emailRef.current.value : "",
//              phone: phoneRef.current.value ? phoneRef.current.value : " ",
//              password: passwordRef.current.value ? passwordRef.current.value : " "
//          }

//          try {
//              const res = await axios.post('http://localhost:7000/api/user', newUser)
//              if (res.status === 200) {

//                  console.log("res.data", res.data);
//                  getUsers()
//              }
//          }
//          catch (e) {
//              console.error(e)
//          }
//      }

//      const deleteUser = async (id) => {
//          const res = await axios.delete(`http://localhost:7000/api/user/${id}`)
//          // props.setUsersData(res.data)
//          let arrConifirm = []
//          let arrNotConifirm = []
//          res.data.map((user) => {
//              if (user.conifirm === true)
//                  arrConifirm.push(user)
//              else
//                  arrNotConifirm.push(user)
//          });
//      }


//      const onChange = (event) => {
//          setSource(event.source);
//          setTarget(event.target);
//      };

//      const itemTemplate = (item) => {
//          return (

//              // <User user={itam} ></User>

//              <div className="flex flex-wrap p-2 align-items-center gap-3">
//                  {/* src={`https://primefaces.org/cdn/primereact/images/product/${item.image}`} */}
//                  <img className="w-4rem shadow-2 flex-shrink-0 border-round" alt={item.name} />
//                  <div className="flex-1 flex flex-column gap-2">
//                      <span className="font-bold">{item.name}</span>
//                      <div className="flex align-items-center gap-2">
//                          <i className="pi pi-tag text-sm"></i>
//                          <span>{item.createdAd}</span>
//                      </div>
//                      <Button icon="pi pi-times" aria-label="Filter" onClick={() => deleteUser(item._id)} />
//                  </div>
//                  <span className="font-bold text-900">${item.price}</span>
//              </div>

//          );
//      };


//      useEffect(() => {
//          getUsers()
//      }, [])

//      return (
//          <>

//              {/* <Button icon="pi pi-plus" aria-label="Filter" onClick={() =>setVisibleCreatUser(true)} />
//          <CreatUser createUser={createUser} setVisibleCreatUser={setVisibleCreatUser}  visibleCreatUser={visibleCreatUser}/> */}

//              {/* 
//              {
//                  usersData ?
//                      usersData.sort((user1, user2) => user1.createdAt - user2.createdAt).map((u) => { return <User user={u} getUsers={getUsers} setUsersData={setUsersData} /> }) : null
//              } */}

//              <div className="card">
//                  <PickList dataKey="id" source={source} target={target} onChange={onChange} itemTemplate={itemTemplate} filter filterBy="name" breakpoint="1280px"
//                      sourceHeader="Available" targetHeader="Selected" sourceStyle={{ height: '24rem' }} targetStyle={{ height: '24rem' }}
//                      sourceFilterPlaceholder="Search by name" targetFilterPlaceholder="Search by name" />
//              </div>

//          </>)
//  }

//  export default Users

import { useNavigate } from 'react-router-dom';

const Users = () => {

    const navigate = useNavigate();
    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);

    //*** הוספת ניהול בחירות כדי לאפשר בחירה של יותר מפריט אחד
    const [sourceSelection, setSourceSelection] = useState([]); //***
    const [targetSelection, setTargetSelection] = useState([]); //***

    //****** GET - getAllUsers *****//
    const getUsers = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/user');
            if (res.status === 200) {
                console.log(res.data);

                //*** שימוש ב-filter במקום map כדי להפריד משתמשים מאושרים ולא מאושרים
                const confirmedUsers = res.data.filter(user => user.confirm === true); //***
                const notConfirmedUsers = res.data.filter(user => !user.confirm); //***

                setSource(notConfirmedUsers);
                setTarget(confirmedUsers);
            }
        } catch (e) {
            console.error(e);
        }
    };

    //****** POST - createUser *****//
    const createUser = async (nameRef, emailRef, phoneRef, passwordRef) => {
        const newUser = {
            name: nameRef.current.value ? nameRef.current.value : " ",
            email: emailRef.current.value ? emailRef.current.value : "",
            phone: phoneRef.current.value ? phoneRef.current.value : " ",
            password: passwordRef.current.value ? passwordRef.current.value : " "
        };

        try {
            const res = await axios.post('http://localhost:7000/api/user', newUser);
            if (res.status === 200 || res.status === 201) {
                console.log("res.data", res.data);
                // getUsers()
                navigate('/login');
                // setSource(prevSource => prevSource.filter(user => user._id !== res._id)); 
                //  setTarget(prevTarget => prevTarget.filter(user => user._id !== res._id))
            }
        } catch (e) {
            console.error(e);
        }
    };

    //****** DELETE - deleteUser *****//
    const deleteUser = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:7000/api/user/${id}`);
            if (res.status === 200) {
                // setSource(prevSource => prevSource.filter(user => user._id !== res._id));
                // setTarget(prevTarget => prevTarget.filter(user => user._id !== res._id))
               
                setSource(prevSource => prevSource.filter(user => user._id !== res.data._id));
                setTarget(prevTarget => prevTarget.filter(user => user._id !== res.data._id))
            }
        } catch (e) {
            console.error(e);
        }
    };
    const confirmUser = async (id) => {

        try {
            const _id=id
            const res = await axios.put('http://localhost:7000/api/user/confirm', { _id })
            if (res.status === 200) {
                console.log("res.data", res.data);
            }
        } catch (e) {
            console.error(e)
        }
    }
    const onChange = (event) => {
        const movedToTarget = event.target.filter(user => !target.some(u => u._id === user._id)); // משתמשים שעברו ל"מאושרים"
        const movedToSource = event.source.filter(user => !source.some(u => u._id === user._id)); // משתמשים שעברו ל"לא מאושרים"

        // קריאה לפונקציה confirmUser עבור כל משתמש שעבר רשימה
        movedToTarget.forEach(user => confirmUser(user._id)); // אישור משתמשים שעברו ל"מאושרים"
        movedToSource.forEach(user => confirmUser(user._id)); // ביטול האישור של משתמשים שעברו ל"לא מאושרים"

        setSource(event.source);
        setTarget(event.target);

        //*** איפוס הבחירה לאחר ההעברה כדי למנוע בעיות
        setSourceSelection([]); //***
        setTargetSelection([]); //***
    };

    const itemTemplate = (item) => {
        return (

            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <UserProfile name={item.name}></UserProfile>
                <span className="font-semibold">{item.email}</span>
                <div className="flex-1 flex flex-column gap-2">
                    {/* <span className="font-bold">{item.name}</span> */}
                    <div className="flex align-items-center gap-2">
                        <div className="flex align-items-center gap-2">
                            {/* הצגת תאריך יצירת המשתמש */}
                            <br />
                            <i className="pi pi-calendar text-sm"></i>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                </div>
                <FaTrashAlt
                
                    size={20}
                    className="delete-icon" // הכיתה שהוספנו לעיצוב 
                    onClick={() => deleteUser(item._id)} // הפונקציה למחיקה
                />
            </div>
        );
    };

    useEffect(() => {
        getUsers();
    }, []);


    return (

        <div className="card">
            <PickList
                dataKey="_id"
                source={source}
                target={target}
                onChange={onChange}
                itemTemplate={itemTemplate}

                //*** הוספת ניהול בחירה כדי לאפשר העברת יותר מפריט אחד
                selection={sourceSelection}
                onSelectionChange={(e) => {
                    setSourceSelection(e.sourceSelection);
                    setTargetSelection(e.targetSelection);
                }} //***
                filter
                filterBy="name"
                breakpoint="1280px"
                sourceHeader="not Confirim"
                targetHeader="Confirim"
                sourceStyle={{ height: '24rem' }}
                targetStyle={{ height: '24rem' }}
                sourceFilterPlaceholder="Search by name"
                targetFilterPlaceholder="Search by name"
            />
        </div>
    );
};

export default Users;