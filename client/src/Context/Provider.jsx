import { useState, useEffect } from "react";
import UserContext from './UserName';

const UserProvider = ({ children,userCon}) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        if(userCon){
            setUser(userCon);
        }
    }, [userCon]);
    useEffect(() => {
        console.log("UserContext updated:", user);
    }, [user]);

    return (
        <UserContext.Provider value={{user, setUser} } >
            {children}
        </UserContext.Provider>
    );
}
export default UserProvider;


// import React, { createContext, useState } from 'react';

// // יצירת ה- UserContext
// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);  // תחילה ה- user הוא null

//     return (
//         <UserContext.Provider value={{ user, setUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// };
