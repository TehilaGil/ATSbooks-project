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
    const {book}=props


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
            onHide={() => { if (!visible) return; props.setVisible(false); }}
            content={({ hide }) => (
                <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                      <div className="inline-flex flex-column gap-2">
                        <label htmlFor="Postname" className="text-primary-50 font-semibold">
                            name
                        </label>
                        <InputText id="name" label="name" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="name" ref={nameRef}defaultValue={book.name} ></InputText>
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="Bookname" className="text-primary-50 font-semibold">
                          Grades
                        </label>
                       
                    <div className="inline-flex flex-column gap-2">
                   
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
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="Postname" className="text-primary-50 font-semibold">
                            image
                        </label>
                        <InputText id="name" label="name" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="name" ref={imageRef} defaultValue={book.image}></InputText>
                    </div>
                    <div className="flex align-items-center gap-2">
                        <Button label="Update" onClick={(e) => { updateBook(nameRef,selectedGrades, imageRef,book); hide(e) }} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        <Button label="Cancel" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                    </div>
                </div>
            )}
        ></Dialog>

    )
}
export default BookUpdate