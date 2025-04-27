
import React, { useEffect, useState, useRef } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const Tittels = () => {
    const [categories, setCategories] = useState([]);  // לאחסן את הכותרות
    const [loading, setLoading] = useState(true);  // מצב טעינה
    const toast = useRef(null);

    // שליפת הכותרות
    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/api/titles'); // שליפת הכותרות מהשרת
            setCategories(data);  // עדכון הכותרות במצב
            setLoading(false);  // סיום טעינה
        } catch (err) {
            console.error("Error fetching categories:", err);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load categories', life: 3000 });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // יצירת המודל עבור ה-PanelMenu
    const items = categories.map(category => ({
        label: category.name,
        icon: 'pi pi-book',
        items: category.files.map(file => ({
            label: file.name,
            icon: 'pi pi-file',
            command: () => {
                toast.current?.show({ severity: 'success', summary: 'File opened', detail: `Opening ${file.name}`, life: 3000 });
            }
        }))
    }));

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

export default Tittels;
