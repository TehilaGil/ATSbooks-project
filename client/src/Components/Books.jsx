
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import BookCreate from "./BookCreat"
import BookUpdate from './BookUpdate';

import { Link, useParams } from 'react-router-dom';
import Tittles from './Titles';
import { Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function BooksDataView() {
    const [books, setBooks] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [visibleCreatBook, setVisibleCreatBook] = useState(false);
    const [visible, setVisible] = useState(false);
    const { gradeId } = useParams(); // Get gradeId from URL

    // useEffect(() => {
        
    //     getBooks();
    // }, []);

    useEffect(() => {
        
        if (gradeId) {
            getBooksByGrade(gradeId); // Fetch books for the specific grade
        } else {
            getBooks(); // Fetch all books if no gradeId is provided
        }
    }, [gradeId]);

    const getBooks = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/book')
            if (res.status === 200) {
                console.log(res.data);
                setBooks(res.data)
            }
        } catch (e) {
            console.error(e)
        }
    }
    const getBooksByGrade = async (Id) => {
        try {
            const res = await axios.get(`http://localhost:7000/api/book/grade/${Id}`)
            if (res.status === 200) {
                console.log(res.data);
                setBooks(res.data)
            }
        }
        catch (e) {
            console.log(e)

        }
    }

    const deleteBook = async (bookId) => {
        try {
            const res = await axios.delete(`http://localhost:7000/api/book/${bookId}`);
            // קרא ל-getBooks בכל מקרה, גם אם אין ספרים
            setBooks(res.data)
        } catch (err) {
            console.error('Error deleting book:', err);
            // יתכן שתרצה לקרוא ל-getBooks גם במקרה של שגיאה:
        }
    };

    const updateBook = async (nameRef, selectedItem, imageRef, book) => {
        console.log(selectedItem)
        const updatebook = {
            ...book,
            name: nameRef.current.value ? nameRef.current.value : book.name,
            grades: selectedItem,
            image: imageRef.current.value ? imageRef.current.value : book.image,
        };
        try {
            const res = await axios.put('http://localhost:7000/api/book', updatebook)
            if (res.status === 200) {

                console.log("res.data", res.data);
                setBooks(res.data)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const createBook = async (nameRef, selectedItem, imageRef) => {
        const newBook = {
            name: nameRef.current.value ? nameRef.current.value : " ",
            grades: selectedItem ? selectedItem : " ",
            image: imageRef.current.value ? imageRef.current.value : " "
        };
        try {
            const res = await axios.post('http://localhost:7000/api/book', newBook);
    
            if (res.status === 200 || res.status === 201) {
                // if (gradeId) {
                //     getBooksByGrade(gradeId); // רענון לפי כיתה
                // } else {
                //     getBooks();
                // }
                setBooks(prevBooks => [...prevBooks, res.data]);

            }
        } catch (e) {
            console.error("שגיאה ביצירת ספר:", e);
        }
    };
    


    const listItem = (book, index) => (
        // <div className="col-12" key={book._id}>
            <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                
            <div
    className="p-4 border-1 surface-border surface-card border-round"
    onClick={() => navigate(`/Titles/${book._id}`)}
    style={{ cursor: 'pointer' }}
>
                <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={book.image} alt={book.name} />

                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4 w-full">
                    {/* מידע על הספר */}
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{book.name}</div>
                        <strong>Suitable for:</strong>

                        {console.log("Book grades:", book.grades)}
                        <ul className="m-0 pl-3 list-disc text-xs">
                            {book.grades.map((grade, idx) => (
                                <li key={idx}>{grade.name}</li>
                            ))}
                        </ul>
                    </div>

                    {/* כפתורים בצד ימין */}
                    <div className="flex align-items-center justify-content-end gap-2 w-full sm:w-auto">
                        <Button
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-warning"
                            onClick={(e) =>{e.stopPropagation()
                                 setVisible(true)}}
                            tooltip="ערוך"

                        />
                        <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-danger"
                            onClick={(e) =>{e.stopPropagation() 
                                deleteBook(book._id)}}
                            tooltip="מחק"
                        />
                        <BookUpdate updateBook={updateBook} setVisible={setVisible} visible={visible} book={book} />

                    </div>

                </div>
            </div>
        </div>
    );


const navigate = useNavigate();
 // <Link to={`/Titles/${book._id}`} className="link-custom"> //
                // <div className="p-4 border-1 surface-border surface-card border-round">
    const gridItem = (book) => (
        <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={book._id}>

<div
    className="p-4 border-1 surface-border surface-card border-round"
    onClick={() => navigate(`/Titles/${book._id}`)}
    style={{ cursor: 'pointer' }}
>

                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <img className="w-9 shadow-2 border-round" src={book.image} alt={book.name} />
                        <div className="text-2xl font-bold">{book.name}</div>
                        <strong>Suitable for:</strong>

                        {console.log("Book grades:", book.grades)}
                        <ul className="m-0 pl-3 list-disc text-xs">
                            {book.grades.map((grade, idx) => (
                                <li key={idx}>{grade.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex align-items-center justify-content-center mt-3">
                    <Button
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-warning"
                            onClick={(e) =>{e.stopPropagation()
                                 setVisible(true)}}
                            tooltip="ערוך"

                        />
                        <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-danger"
                            onClick={(e) =>{e.stopPropagation() 
                                deleteBook(book._id)}}
                            tooltip="מחק"
                        />
                        <BookUpdate updateBook={updateBook} setVisible={setVisible} visible={visible} book={book} />

                    </div>




                </div>

            {/* </Link> */}
        </div >

    );

    const itemTemplate = (book, layout, index) => {
        if (!book) return;
        return layout === 'list' ? listItem(book, index) : gridItem(book);
    };

    const listTemplate = (books, layout) => (
        <div className="grid grid-nogutter">{books.map((book, index) => itemTemplate(book, layout, index))} </div>
    );

    const header = () => (
        <div className="flex justify-content-end">
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );

    return (
        <div>
            <Button icon="pi pi-plus" rounded aria-label="Filter" onClick={() => setVisibleCreatBook(true)} />
            <BookCreate createBook={createBook} setVisibleCreatBook={setVisibleCreatBook} visibleCreatBook={visibleCreatBook} />
            <div className="card">
                <DataView value={books} listTemplate={listTemplate} layout={layout} header={header()} />

            </div></div>
    );
}


