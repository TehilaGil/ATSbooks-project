
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
