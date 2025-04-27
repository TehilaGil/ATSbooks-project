import React, { useState, useRef } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';

const BookCreate = (props) => {
    const { createBook, visibleCreatBook, setVisibleCreatBook } = props;

    const nameRef = useRef("");
    const imageRef = useRef("");

    const [selectedGrades, setSelectedGrades] = useState([]);
    const grades = [
        { label: 'First Grade', value: 'first grade' },
        { label: 'Second Grade', value: 'second grade' },
        { label: 'Third Grade', value: 'third grade' },
        { label: 'Fourth Grade', value: 'fourth grade' },
        { label: 'Fifth Grade', value: 'fifth grade' },
        { label: 'Sixth Grade', value: 'sixth grade' },
        { label: 'Seventh Grade', value: 'seventh grade' },
        { label: 'Eighth Grade', value: 'eighth grade' }
    ];

    return (
        <Dialog
            visible={visibleCreatBook}
            modal
            onHide={() => { if (!visibleCreatBook) return; setVisibleCreatBook(false); }}
            content={({ hide }) => (
                <div className="flex flex-column px-8 py-5 gap-4"
                    style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                    
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="name" className="text-primary-50 font-semibold">Name</label>
                        <InputText id="name" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="text" ref={nameRef} />
                    </div>

                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="grades" className="text-primary-50 font-semibold">Grades</label>
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

                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="image" className="text-primary-50 font-semibold">Image</label>
                        <InputText id="image" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="text" ref={imageRef} />
                    </div>

                    <div className="flex align-items-center gap-2">
                        <Button
                            label="Create"
                            onClick={(e) => { createBook(nameRef, selectedGrades, imageRef); hide(e); }}
                            text
                            className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                        />
                        <Button
                            label="Cancel"
                            onClick={(e) => hide(e)}
                            text
                            className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                        />
                    </div>
                </div>
            )}
        />
    );
};

export default BookCreate;
