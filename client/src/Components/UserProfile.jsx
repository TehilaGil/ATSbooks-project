import React from 'react';
 import { Avatar } from 'primereact/avatar';
 
 // פונקציה להגרלת צבע על בסיס שם המשתמש
 const getColorFromName = (name) => {
     const colors = ['#007ad9', '#ff5722', '#4caf50', '#9c27b0', '#e91e63', '#ffc107', '#673ab7'];
     const index = name.toLowerCase().charCodeAt(0) % colors.length;  // חשב צבע על פי האות הראשונה בשם
     return colors[index];
 };
 
 const UserProfile = ({ name }) => {
     // חישוב האות הראשונה מהשם
     const firstLetter = name ? name.charAt(0).toUpperCase() : '';
     // חישוב צבע אחיד על פי השם
     const backgroundColor = getColorFromName(name);
 
     return (
         <div className="flex align-items-center">
             {/* שימוש ב-Avatar להצגת האות הראשונה עם צבע רקע אחיד לכל שם */}
             <Avatar label={firstLetter} size="large" className="mr-2" style={{ backgroundColor, color: 'white', borderRadius: '50%' }} />
             <span className="font-semibold">{name}</span>
         </div>
     );
 };
 
 export default UserProfile;