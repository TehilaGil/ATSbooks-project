
import React, { useState, useRef, useEffect } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import axios from 'axios';

const BookCreate = (props) => {
    const { createBook, visibleCreatBook, setVisibleCreatBook } = props;

    const nameRef = useRef("");
    const imageRef = useRef("");

    const [selectedGrades, setSelectedGrades] = useState([]);
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

    return (
        <Dialog
            visible={visibleCreatBook}
            modal
            header="Create Book"
            style={{ width: '400px', borderRadius: '8px' }}
            onHide={() => setVisibleCreatBook(false)}
        >
            <div className="flex flex-column px-8 py-5 gap-4">
                <div className="inline-flex flex-column gap-2">
                    <label htmlFor="name" className="font-medium">Name</label>
                    <InputText
                        id="name"
                        className="p-inputtext-sm"
                        type="text"
                        ref={nameRef}
                        placeholder="Enter book name"
                    />
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
                        className="p-inputtext-sm"
                        type="text"
                        ref={imageRef}
                        placeholder="Enter image URL"
                    />
                </div>

                <div className="flex justify-content-center gap-2">
                    <Button
                        label="Create"
                        onClick={() => {
                            createBook(nameRef, selectedGrades, imageRef);
                            setVisibleCreatBook(false);
                        }}
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