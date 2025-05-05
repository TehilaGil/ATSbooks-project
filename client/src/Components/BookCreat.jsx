import React, { useState, useRef, useEffect } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FileUpload } from 'primereact/fileupload';
import { useSelector } from "react-redux";


const BookCreate = (props) => {
    const { createBook, visibleCreatBook, setVisibleCreatBook } = props;
    const {token} = useSelector((state) => state.token);
    const {user} = useSelector((state) => state.token);
    const nameRef = useRef("");
    const imageRef = useRef("");

    const [selectedGrades, setSelectedGrades] = useState([]);
    const [grades, setGrades] = useState([]);
    const [nameError, setNameError] = useState(false); // מצב לניהול שגיאה בשם
    const [imageError, setImageError] = useState(false); // מצב לניהול שגיאה בתמונה

    const { gradeId } = useParams(); // קבלת gradeId מה-URL

    const AvailablGrade = async () => {

        try {
            const res = await axios.get('http://localhost:7000/api/grade',
            { headers : {'Authorization': `Bearer ${token}`}
            }
           );
            if (res.status === 204) {
                setGrades([]);
            } else {
                const gradeOptions = res.data.map((grade) => ({
                    label: grade.name,
                    value: grade.name,
                    id: grade._id, // הוספת ID כדי להשוות עם gradeId
                }));
                setGrades(gradeOptions);

                // אם קיים gradeId, בוחרים אותו כברירת מחדל
                if (gradeId) {
                    const selectedGrade = gradeOptions.find((grade) => grade.id === gradeId);
                    if (selectedGrade) {
                        setSelectedGrades([selectedGrade.value]); // מסמנים את הדרגה כברירת מחדל
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching grades:', error);
            setGrades([]);
        }
    };

    useEffect(() => {
        AvailablGrade();
    }, [gradeId]);

    const handleCreateClick = () => {
        const nameValue = nameRef.current.value.trim();
        const imageValue = imageRef.current.value.trim();

        let hasError = false;

        if (!nameValue) {
            setNameError(true); // הצגת שגיאה אם השם ריק
            hasError = true;
        } else {
            setNameError(false); // הסרת השגיאה אם השם נכון
        }

        if (!imageValue) {
            setImageError(true); // הצגת שגיאה אם התמונה ריקה
            hasError = true;
        } else {
            setImageError(false); // הסרת השגיאה אם התמונה תקינה
        }

        if (hasError) {
            return; // עצירה אם יש שגיאות
        }

        createBook(nameRef, selectedGrades, imageRef);
        setVisibleCreatBook(false);
    };

    return (
        <Dialog
            visible={visibleCreatBook}
            modal
            header="Create Book"
            style={{ width: '400px', borderRadius: '8px' }}
            onHide={() => setVisibleCreatBook(false)}
        >
            <div className="flex flex-column gap-4" style={{ padding: '1rem' }}>
            <div className="inline-flex flex-column gap-2">
                    <label htmlFor="name" className="font-medium">Name</label>
                    <InputText
                        id="name"
                        className={`p-inputtext-sm ${nameError ? 'p-invalid' : ''}`} // הוספת מחלקת שגיאה אם יש שגיאה
                        type="text"
                        ref={nameRef}
                        placeholder="Enter book name"
                    />
                    {nameError && (
                        <small className="p-error">This field is required.</small> // הודעת שגיאה לשם
                    )}
                </div>

                <div className="inline-flex flex-column gap-2">
                    <label htmlFor="grades" className="font-medium">Grades</label>
                    <MultiSelect
                        id="grades"
                        value={selectedGrades}
                        options={grades}
                        onChange={(e) => setSelectedGrades(e.value)}
                        optionLabel="label"
                        placeholder="Select Grades"
                        display="chip"
                        className="p-multiselect-sm"
                        virtualScrollerOptions={{ itemSize: 38 }}
                    />
                </div>

                <div className="inline-flex flex-column gap-2">
                    <label htmlFor="image" className="font-medium">Image</label>
                    <InputText
                        id="image"
                        className={`p-inputtext-sm ${imageError ? 'p-invalid' : ''}`} // הוספת מחלקת שגיאה אם יש שגיאה
                        type="text"
                        ref={imageRef}
                        placeholder="Enter image URL"
                    />
                    {imageError && (
                        <small className="p-error">This field is required.</small> // הודעת שגיאה לתמונה
                    )}
                </div>

                <div className="flex justify-content-center gap-2">
                    <Button
                        label="Create"
                        onClick={handleCreateClick}
                        className="p-button p-button-primary"
                    />
                    <Button
                        label="Cancel"
                        onClick={() => setVisibleCreatBook(false)}
                        className="p-button p-button-secondary"
                    />
                </div>
            </div>
            
        </Dialog>
    );
};

export default BookCreate;