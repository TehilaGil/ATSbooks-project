
// import React, { useEffect, useState, useRef } from 'react';
// import { PanelMenu } from 'primereact/panelmenu';
// import { Toast } from 'primereact/toast';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import FilesDataView from './Files';

// const Titles = () => {
//     const [titles, setTitles] = useState([]);  // לאחסן את הכותרות
//     const [loading, setLoading] = useState(true);  // מצב טעינה
//     const toast = useRef(null);
//     const { bookId } = useParams(); // Get gradeId from URL
//     const [selectedTitleId, setSelectedTitleId] = useState(null); // שומר את ה-ID של הכותרת הנבחרת
//     const [selectedFiles, setSelectedFiles] = useState([]); //


//     const Titles = () => {
//         const [selectedTitleId, setSelectedTitleId] = useState(null);
    
//         // למשל אם יש לך רשימת כותרות, נוסיף ב-onClick:
//         const handleSelectTitle = (title) => {
//             setSelectedTitleId(title._id); // שמור את ה-id
//         };
//     }


//     // שליפת הכותרות
//     const getTitles = async () => {
//         try {

//             const res = await axios.get(`http://localhost:7000/api/title/getTitlesByBook/${bookId}`); // שליפת הכותרות מהשרת
//             if (Array.isArray(res.data)) {
//                 setTitles(res.data); // הנח שהמערך נמצא ב-res.data
//             } else {
//                 console.error("Response data is not an array", res.data);
//                 toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Invalid data format', life: 3000 });
//             }
//             setLoading(false);  // סיום טעינה
//         } catch (err) {
//             console.error("Error fetching categories:", err);
//             toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load categories', life: 3000 });
//             setLoading(false);
//         }
//     };
//     const handleSelectTitle = (title) => {
//         setSelectedTitleId(title._id); // שמור את ה-ID של הכותרת
//         setSelectedFiles(title.files); // הצג את הקבצים של הכותרת הנבחרת
//     };

//     useEffect(() => {
//         getTitles();
//     }, []);
    
//     // יצירת המודל עבור ה-PanelMenu
//     // if (titles?.length > 0) {
//         const items = titles.map(title => ({
//             label: title.name,
//             icon: 'pi pi-book',
//             items: (title.files || []).map(file => ({
//                 label: file.name,
//                 icon: 'pi pi-file',
//                 command: () => {
//                     toast.current?.show({ severity: 'success', summary: 'File opened', detail: `Opening ${file.name}`, life: 3000 });
//                 }
//             }))
//         }));
//     // }

//     if (loading) {
//         return <div>Loading...</div>;  // מציג הודעת טעינה
//     }

//     return (

//     //     <div>
//     //     <div className="grid">
//     //         {titles.map(title => (
//     //             <div key={title._id} className="col">
//     //                 <div
//     //                     className="p-2 border-1 surface-border surface-card border-round cursor-pointer"
//     //                     onClick={() => handleSelectTitle(title)}
//     //                 >
//     //                     {title.name}
//     //                 </div>
//     //             </div>
//     //         ))}
//     //     </div>

   
    


//     //     <div className="card flex justify-content-center">
//     //         <PanelMenu model={items} className="w-full md:w-20rem" />
//     //         <Toast ref={toast} />
//     //     </div>
//     //  </div>
//     <div>
//     <div className="grid">
//         {titles.map(title => (
//             <div key={title._id} className="col">
//                 <div
//                     className="p-2 border-1 surface-border surface-card border-round cursor-pointer"
//                     onClick={() => handleSelectTitle(title)}
//                 >
//                     {title.name}
//                 </div>
//             </div>
//         ))}
//     </div>

//     {selectedTitleId && selectedFiles.length > 0 && (
//         <div className="mt-5">
//             <h3>קבצים של כותרת נבחרת</h3>
//             <div className="file-list">
//                 {selectedFiles.map(file => (
//                     <div key={file._id} className="file-item">
//                         <div
//                             className="p-2 border-1 surface-border surface-card border-round cursor-pointer"
//                             onClick={() => {
//                                 toast.current?.show({ severity: 'success', summary: 'File opened', detail: `Opening ${file.name}`, life: 3000 });
//                             }}
//                         >
//                             {file.name}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )}

//     <Toast ref={toast} />
// </div>
//     );
// }

// export default Titles;


import React, { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { useParams } from 'react-router-dom';
import FilesDataView from './Files'; // קבלת קומפוננטת הקבצים
import axios from 'axios';

const Titles = () => {
    const [titles, setTitles] = useState([]);  // רשימת כותרות
    const [loading, setLoading] = useState(true); // סטטוס טעינה
    const toast = useRef(null);
    const { bookId } = useParams(); // קבלת bookId מה-URL
    const [selectedTitleId, setSelectedTitleId] = useState(null); // הכותרת שנבחרה

    // שליפת כותרות מהשרת
    const getTitles = async () => {
        try {
            const res = await axios.get(`http://localhost:7000/api/title/getTitlesByBook/${bookId}`);
            if (Array.isArray(res.data)) {
                setTitles(res.data);
            } else {
                console.error("Response data is not an array", res.data);
                toast.current?.show({ severity: 'error', summary: 'שגיאה', detail: 'פורמט נתונים שגוי', life: 3000 });
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching titles:", err);
            toast.current?.show({ severity: 'error', summary: 'שגיאה', detail: 'שגיאה בטעינת כותרות', life: 3000 });
            setLoading(false);
        }
    };

    useEffect(() => {
        getTitles();
    }, []);

    const handleSelectTitle = (title) => {
        setSelectedTitleId(title._id);
    };

    if (loading) {
        return <div>טוען כותרות...</div>;
    }

    return (
        <div>
            <div className="grid">
                {titles.map(title => (
                    <div key={title._id} className="col">
                        <div
                            className="p-2 border-1 surface-border surface-card border-round cursor-pointer"
                            onClick={() => handleSelectTitle(title)}
                        >
                            {title.name}
                        </div>
                    </div>
                ))}
            </div>

            {selectedTitleId && (
                <div className="mt-5">
                    <h3>קבצים של הכותרת הנבחרת</h3>
                    <FilesDataView titleId={selectedTitleId} />
                </div>
            )}

            <Toast ref={toast} />
        </div>
    );
}

export default Titles;
