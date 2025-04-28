
import React, { useEffect, useState, useRef } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Titles = () => {
    const [titles, setTitles] = useState([]);  // לאחסן את הכותרות
    const [loading, setLoading] = useState(true);  // מצב טעינה
    const toast = useRef(null);
    const { bookId } = useParams(); // Get gradeId from URL
    // שליפת הכותרות
    const getTitles = async () => {
        try {

            const res = await axios.get(`http://localhost:7000/api/title/getTitlesByBook/${bookId}`); // שליפת הכותרות מהשרת
            if (Array.isArray(res.data)) {
                setTitles(res.data); // הנח שהמערך נמצא ב-res.data
            } else {
                console.error("Response data is not an array", res.data);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Invalid data format', life: 3000 });
            }
            setLoading(false);  // סיום טעינה
        } catch (err) {
            console.error("Error fetching categories:", err);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load categories', life: 3000 });
            setLoading(false);
        }
    };

    useEffect(() => {
        getTitles();
    }, []);
    
    // יצירת המודל עבור ה-PanelMenu
    // if (titles?.length > 0) {
         const items = titles.map(title => ({
            label: title.name,
            icon: 'pi pi-book',
            // items: title.files.map(file => ({
            //     label: file.name,
            //     icon: 'pi pi-file',
            //     command: () => {
            //         toast.current?.show({ severity: 'success', summary: 'File opened', detail: `Opening ${file.name}`, life: 3000 });
            //     }
            // }))
        }));
    // }

    if (loading) {
        return <div>Loading...</div>;  // מציג הודעת טעינה
    }

    return (
        <div className="card flex justify-content-center">
            <PanelMenu model={items} className="w-full md:w-20rem" />
            <Toast ref={toast} />
        </div>
    );
}

export default Titles;
