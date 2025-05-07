import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import BookCreate from "./BookCreat";
import BookUpdate from './BookUpdate';
import './Grades.css';
import { useSelector } from "react-redux";
import { Link, useParams } from 'react-router-dom';
import Tittles from './Titles';
import { Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function BooksDataView() {
    const [books, setBooks] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [selectedBook, setSelectedBook] = useState({});
    const [flagGradeId, setFlagGradeId] = useState(false);


    const [visibleCreatBook, setVisibleCreatBook] = useState(false);
    const [visible, setVisible] = useState(false);
    const { gradeId } = useParams(); // Get gradeId from URL
    const { token } = useSelector((state) => state.token);
    const { user } = useSelector((state) => state.token);


    useEffect(() => {
        if (gradeId) {
            getBooksByGrade(gradeId); // Fetch books for the specific grade
        } else {
            getBooks(); // Fetch all books if no gradeId is provided
        }

    }, [gradeId, flagGradeId]);

    const getBooks = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/book');
            if (res.status === 200) {
                console.log(res.data);
                setBooks(res.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const getBooksByGrade = async (Id) => {
        try {
            const res = await axios.get(`http://localhost:7000/api/book/grade/${Id}`
            );

            if (res.status === 200) {
                console.log(res.data);
                setBooks(res.data);
            }
        } catch (e) {
            if (e.status === 400) {
                alert("there are no book for this grade")
                // navigate('/Grades')
            }
            console.log(e);
        }
    };

    const deleteBook = async (bookId) => {
        try {
            const res = await axios.delete(`http://localhost:7000/api/book/${bookId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // setBooks(res.data);
            setFlagGradeId(!flagGradeId)
        } catch (err) {
            console.error('Error deleting book:', err);
        }
    };

    const updateBook = async (name, selectedItem, image, book) => {
        console.log(selectedItem, name, image, book);

        const updatebook = {
            ...book,

            name: name ? name : book.name,
            grades: selectedItem,
            image: image ? image : book.image,
        };
        try {
            const res = await axios.put('http://localhost:7000/api/book', updatebook, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.status === 200) {
                console.log("res.data", res.data);
                setFlagGradeId(!flagGradeId)
            }
        } catch (e) {

            console.error(e);
        }
    };
    const createBook = async (name, selectedItem, image) => {
        console.log("🤣🤣😂😂");
        if (!image)
            alert("confirm the image")


        const formData = new FormData();
        formData.append('name', name);
        formData.append('grades', JSON.stringify(selectedItem));
        formData.append('image', image); // הוספת הקובץ ל-FormData

        try {
            const res = await axios.post('http://localhost:7000/api/book', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // הגדרת התוכן כ-multipart
                },
            });
            if (res.status === 200 || res.status === 201) {
                if (gradeId) {
                    getBooksByGrade(gradeId);
                } else {
                    getBooks();
                }
            }
        } catch (e) {


            if (e.status === 400)
                alert("name and image are required")
            console.error("Error creating book:", e);
        }
    };

    // const listItem = (book, index) => (
    //     <div
    //         className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}
    //         onClick={() => navigate(`/Titles/${book._id}`)}
    //         style={{ cursor: 'pointer' }}
    //     >
    //         <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={book.image} alt={book.name} />
    //         <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4 w-full">
    //             <div className="flex flex-column align-items-center sm:align-items-start gap-3">
    //                 <div className="text-2xl font-bold text-900">{book.name}</div>
    //                 {book.grades && book.grades.length > 0 && (
    //                     <>
    //                         <strong>Suitable for:</strong>
    //                         <ul className="m-0 pl-3 list-disc text-xs">
    //                             {book.grades.map((grade, idx) => (
    //                                 <li key={idx}>{grade.name}</li>
    //                             ))}
    //                         </ul>
    //                     </>
    //                 )}
    //             </div>
    //             <div className="flex align-items-center justify-content-end gap-2 w-full sm:w-auto">
    //                 <Button
    //                     icon="pi pi-pencil"
    //                     className="p-button-rounded p-button-warning"
    //                     onClick={(e) => {
    //                         e.stopPropagation();
    //                         setVisible(true);
    //                     }}
    //                     tooltip="Edit"
    //                 />
    //                 <Button
    //                     icon="pi pi-trash"
    //                     className="p-button-rounded p-button-danger"
    //                     onClick={(e) => {
    //                         e.stopPropagation();
    //                         deleteBook(book._id);
    //                     }}
    //                     tooltip="Delete"
    //                 />
    //                 <BookUpdate updateBook={updateBook} setVisible={setVisible} visible={visible} book={book} />
    //             </div>
    //         </div>
    //     </div>
    // );

    const navigate = useNavigate();
    const handleNavigation = (id) => {
        if (user?.roles != "Admin") {
            
            console.log(user.confirm ,"ppp",user?.roles)
            console.log(user)
            alert('You are not allowed to view the book files.')  
        }
        else {
            navigate(`/Titles/${id}`);
            // אם המשתמש אינו מורשה, מפעיל פונקציה להצגת דיאלוג
            
        }
    };
    const gridItem = (book) => (
        <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={book._id}>
            <div
                className="p-4 border-1 surface-border surface-card border-round"
                onClick={() => handleNavigation(book._id)}
                style={{ cursor: 'pointer' }}>
                <div className="flex flex-column align-items-center gap-3 py-5">

                    {/* <img className="w-9 shadow-2 border-round" src={book.image} alt={book.name} /> */}
                    <img
                        className="object-cover w-full h-full"
                        src={`http://localhost:7000${book.image}`}
                        alt={book.name}
                        style={{ objectFit: 'cover', width: '80%', height: '80%' }} // תמונה בגודל קטן יותר
                    />
                    <div className="text-2xl font-bold">{book.name}</div>
                    {book.grades && book.grades.length > 0 && (
                        <>
                            <strong>Suitable for:</strong>
                            <ul className="m-0 pl-3 list-disc text-xs">
                                {book.grades.map((grade, idx) => (
                                    <li key={idx}>{grade.name}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
                <div className="flex align-items-center justify-content-center mt-3">
                    {user?.roles === "Admin" && (
                        <>
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-warning"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setVisible(true);
                                    setSelectedBook(book);
                                }}
                                tooltip="Edit"
                            />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteBook(book._id);
                                }}
                                tooltip="Delete"
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    const itemTemplate = (book, layout, index) => {
        if (!book) return;
        return layout === 'list' ? gridItem(book) : gridItem(book);
    };

    const listTemplate = (books, layout) => (
        <div className="grid grid-nogutter">
            {books.map((book, index) => itemTemplate(book, layout, index))}
        </div>
    );

    // const header = () => (
    //     <div className="flex justify-content-end">
    //         <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
    //     </div>
    // );

    return (
        <div>
            {user?.roles === "Admin" && (
                <Button icon="pi pi-plus" rounded aria-label="Filter" onClick={() => setVisibleCreatBook(true)} className="add-button" />)}
            <BookCreate createBook={createBook} setVisibleCreatBook={setVisibleCreatBook} visibleCreatBook={visibleCreatBook} />
            <div className="card">
                <DataView value={Array.isArray(books) ? books : []} listTemplate={listTemplate} layout={layout} />
            </div>
            {selectedBook ? <BookUpdate updateBook={updateBook} setVisible={setVisible} visible={visible} book={selectedBook} /> : <></>}

        </div>
    );
}