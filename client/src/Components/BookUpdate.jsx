import React, { useState, useRef, useEffect } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import axios from 'axios';
import { AutoComplete } from "primereact/autocomplete";




const BookUpdate = (props) => {
    const [selectedItem, setSelectedItem] = useState(null);
    // const grades = [
    //     { label: 'First Grade', value: 'first grade' },
    //     { label: 'Second Grade', value: 'second grade' },
    //     { label: 'Third Grade', value: 'third grade' },
    //     { label: 'Fourth Grade', value: 'fourth grade' },
    //     { label: 'Fifth Grade', value: 'fifth grade' },
    //     { label: 'Sixth Grade', value: 'sixth grade' },
    //     { label: 'Seventh Grade', value: 'seventh grade' },
    //     { label: 'Eighth Grade', value: 'eighth grade' }
    // ];

    const [grades, setGrades] = useState([]);

    const AvailablGrade = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/grade');
            if (res.status === 204) {
                setGrades([]);
            } else {
                const gradeOptions = res.data.map((grade) => ({
                    label: grade.name,
                    value: grade.name,
                }));
                setGrades(gradeOptions);
            }
        } catch (error) {
            console.error('Error fetching grades:', error);
            setGrades([]);
        }
    };

    useEffect(() => {
        AvailablGrade();
    }, []);

    const [filteredItems, setFilteredItems] = useState(null);
    const [selectedGrades, setSelectedGrades] = useState([]);

    const { updateBook } = props
    const { visible } = props
    const { book } = props


    const nameRef = useRef("")
    const imageRef = useRef("")


    const searchItems = (event) => {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo purposes we filter at client side
        // let query = event.query;
        // let _filteredItems = [];

        setFilteredItems(grades);
    }



    return (


        <Dialog
        visible={visible}
        modal
        header="Update Book" // הוספת כותרת לדיאלוג
        style={{ width: '400px', borderRadius: '8px' }} // התאמת הגודל והעיגול
        onHide={() => { if (!visible) return; props.setVisible(false); }}
        onClick={(e) => e.stopPropagation()}
    >
        <div className="flex flex-column gap-4" style={{ padding: '1rem' }}>
            {/* Name Field */}
            <div className="flex flex-column gap-2">
                <label htmlFor="Postname" className="font-medium">Name</label>
                <InputText
                    id="name"
                    placeholder="Enter book name"
                    className="p-inputtext-sm"
                    type="name"
                    ref={nameRef}
                    defaultValue={book.name}
                />
            </div>
    
            {/* Grades Field */}
            <div className="flex flex-column gap-2">
                <label htmlFor="Bookname" className="font-medium">Grades</label>
                <MultiSelect
                    id="grades"
                    value={selectedGrades}
                    options={grades}
                    onChange={(e) => setSelectedGrades(e.value)}
                    optionLabel="label"
                    placeholder="Select Grades"
                    display="chip"
                    className="w-full md:w-20rem custom-multiselect"
                    virtualScrollerOptions={{ itemSize: 38 }}
                />
            </div>
    
            {/* Image Field */}
            <div className="flex flex-column gap-2">
                <label htmlFor="Postname" className="font-medium">Image</label>
                <InputText
                    id="name"
                    placeholder="Enter image URL"
                    className="p-inputtext-sm"
                    type="name"
                    ref={imageRef}
                    defaultValue={book.image}
                />
            </div>
    
            {/* Buttons Section */}
            <div className="flex justify-content-center gap-2">
                <Button
                    label="Update"
                    onClick={(e) => {
                        e.stopPropagation();
                        updateBook(nameRef, selectedGrades, imageRef, book);
                        props.setVisible(false); // סגירת הדיאלוג
                    }}
                    className="p-button p-button-primary"
                />
                <Button
                    label="Cancel"
                    onClick={(e) => {
                        e.stopPropagation();
                        props.setVisible(false); // סגירת הדיאלוג
                    }}
                    className="p-button p-button-secondary"
                />
            </div>
        </div>
    </Dialog>

    )
}
export default BookUpdate