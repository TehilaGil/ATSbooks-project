// import React, { useState, useEffect, useRef } from 'react';
// import { Button } from 'primereact/button';
// import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
// import { classNames } from 'primereact/utils';
// import axios from 'axios';
// import BookCreate from "./BookCreat";

// export default function BooksDataView() {
//   const [books, setBooks] = useState([]);
//   const [layout, setLayout] = useState('grid');
//   const [templateMode, setTemplateMode] = useState('item'); // 'item' or 'list'
//   const [visibleCreateBook, setVisibleCreateBook] = useState(false);
//   const [editingBook, setEditingBook] = useState(null);

//   // Fetch all books
//   const getBooks = async () => {
//     try {
//       const res = await axios.get('http://localhost:7000/api/book');
//       if (res.status === 200) setBooks(res.data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     getBooks();
//   }, []);

//   // Create or book

//      const createBook = async (nameRef, selectedItem, imageRef) => {
//         console.log(selectedItem)

//         const newBook = {
//             name: nameRef.current.value ? nameRef.current.value : " ",
//             grades: selectedItem ? selectedItem : " ",// ? selectedItem.split(',') : "" ,
//             image: imageRef.current.value ? imageRef.current.value : " "
//         };
//         console.log(newBook.grades)
//         try {
//             const res = await axios.post('http://localhost:7000/api/book', newBook)

//             if (res.status === 200 || res.status === 201) {
//                 console.log("ספר נוצר:", res.data);
//                 getBooks(); // אם יש לך פונקציה כזו לרענון
//             }
//         } catch (e) {
//             console.error("שגיאה ביצירת ספר:", e);
//         }
//     };
//   // Delete handler
//   const deleteBook = async (bookId) => {
//     try {
//       await axios.delete(`http://localhost:7000/api/book/${bookId}`);
//       getBooks();
//     } catch (err) {
//       console.error('Error deleting book:', err);
//     }
//   };

//   // Edit handler
//   const handleEdit = (book) => {
//     setEditingBook(book);
//     setVisibleCreateBook(true);
//   };

//   // Render list item
//   const listItem = (book, index) => (
//     <div className="col-12" key={book._id}>
//       <div
//         className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', {
//           'border-top-1 surface-border': index !== 0
//         })}
//       >
//         <img
//           className="w-9 sm:w-16rem xl:w-10rem shadow-2 block mx-auto border-round"
//           src={book.image}
//           alt={book.name}
//         />
//         <div className="flex flex-column sm:flex-row justify-content-between align-items-center flex-1 gap-4">
//           <div className="flex flex-column align-items-center sm:align-items-start gap-3">
//             <div className="text-2xl font-bold text-900">{book.name}</div>
//             <div className="text-sm text-color-secondary">
//               מספר שכבות גיל: {book.grades.length}
//             </div>
//           </div>
//           <div className="flex align-items-center gap-2">
//             <Button
//               icon="pi pi-pencil"
//               className="p-button-rounded p-button-warning"
//               onClick={() => handleEdit(book)}
//               tooltip="ערוך"
//             />
//             <Button
//               icon="pi pi-trash"
//               className="p-button-rounded p-button-danger"
//               onClick={() => deleteBook(book._id)}
//               tooltip="מחק"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Render grid item
//   const gridItem = (book) => (
//     <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={book._id}>
//       <div className="p-4 border-1 surface-border surface-card border-round">
//         <div className="flex flex-column align-items-center gap-3 py-5">
//           <img className="w-9 shadow-2 border-round" src={book.image} alt={book.name} />
//           <div className="text-2xl font-bold">{book.name}</div>
//           <strong>Suitable for:</strong>
//           <ul className="m-0 pl-3 list-disc text-xs">
//             {book.grades.map((grade, idx) => (
//               <li key={idx}>{grade.name}</li>
//             ))}
//           </ul>
//         </div>
//         <div className="flex align-items-center justify-content-center mt-3 gap-2">
//           <Button
//             icon="pi pi-pencil"
//             className="p-button-rounded p-button-warning"
//             onClick={() => handleEdit(book)}
//             tooltip="ערוך"
//           />
//           <Button
//             icon="pi pi-trash"
//             className="p-button-rounded p-button-danger"
//             onClick={() => deleteBook(book._id)}
//             tooltip="מחק"
//           />
//         </div>
//       </div>
//     </div>
//   );

//   // Item template for DataView
//   const itemTemplate = (book, layoutType, index) => {
//     if (!book) return null;
//     return layoutType === 'list' ? listItem(book, index) : gridItem(book);
//   };

//   // Manual listTemplate
//   const listTemplate = (booksArr, layoutType) => (
//     <div className="grid grid-nogutter">
//       {booksArr.map((book, idx) => itemTemplate(book, layoutType, idx))}
//     </div>
//   );

//   // Header with layout switcher
//   const header = (
//     <div className="flex justify-content-end gap-2">
//       <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
//       <Button
//         label="DataView"
//         className={templateMode === 'item' ? 'p-button-outlined' : ''}
//         onClick={() => setTemplateMode('item')}
//       />
//       <Button
//         label="Custom List"
//         className={templateMode === 'list' ? 'p-button-outlined' : ''}
//         onClick={() => setTemplateMode('list')}
//       />
//     </div>
//   );

//   return (
//     <div>
//       <Button icon="pi pi-plus" rounded aria-label="Add" onClick={() => setVisibleCreateBook(true)} />
//       <BookCreate
//         createBook={createBook}
//         setVisibleCreatBook={setVisibleCreateBook}
//         visibleCreatBook={visibleCreateBook}
//       />
//       <div className="card">
//         {templateMode === 'item' ? (
//           <DataView
//             value={books}
//             itemTemplate={itemTemplate}
//             layout={layout}
//             header={header}
//           />
//         ) : (
//           listTemplate(books, layout)
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import BookCreate from "./BookCreat"
import BookUpdate from './BookUpdate';

import { Link } from 'react-router-dom'; // ייבוא של Link
import Tittles from './Tittels';
import { Route } from 'react-router-dom'; // ייבוא של Route


export default function BooksDataView() {
    const [books, setBooks] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [visibleCreatBook, setVisibleCreatBook] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        getBooks();
    }, []);

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

    const deleteBook = async (bookId) => {
        try {
            await axios.delete(`http://localhost:7000/api/book/${bookId}`);
            getBooks();
        } catch (err) {
            console.error('Error deleting book:', err);
        }
    };

    const updateBook = async (nameRef, selectedItem, imageRef,book) => {
        console.log(selectedItem)
        const updatebook = {
            ...book,
            name: nameRef.current.value? nameRef.current.value :book.name,
            grades: selectedItem,
            image: imageRef.current.value ?imageRef.current.value : book.image,
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
            grades: selectedItem ? selectedItem : " ",// ? selectedItem.split(',') : "" ,
            image: imageRef.current.value ? imageRef.current.value : " "
        };
        try {
            const res = await axios.post('http://localhost:7000/api/book', newBook)

            if (res.status === 200 || res.status === 201) {
                console.log("ספר נוצר:", res.data);
                getBooks(); // אם יש לך פונקציה כזו לרענון
            }
        } catch (e) {
            console.error("שגיאה ביצירת ספר:", e);
        }

    };



    const listItem = (book, index) => (
        <div className="col-12" key={book._id}>
            <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={book.image} alt={book.name} />

                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4 w-full">
                    {/* מידע על הספר */}
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{book.name}</div>
                        <div className="text-sm text-color-secondary">מספר שכבות גיל: {book.grades.length}</div>
                    </div>

                    {/* כפתורים בצד ימין */}
                    <div className="flex align-items-center justify-content-end gap-2 w-full sm:w-auto">
                        <Button
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-warning"
                            onClick={() => setVisible(true)}
                            tooltip="ערוך"
                        />
                        <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-danger"
                            onClick={() => deleteBook(book._id)}
                            tooltip="מחק"
                        />
             <BookUpdate updateBook={updateBook} setVisible={setVisible} visible={visible} book={book} />

                    </div>

                </div>
            </div>
        </div>
    );

    const gridItem = (book) => (
        <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={book._id}>
            <div className="p-4 border-1 surface-border surface-card border-round">
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
                        onClick={() => setVisible(true)}
                        tooltip="ערוך"
                    />
                    <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-danger"
                        onClick={() => deleteBook(book._id)}
                        tooltip="מחק"
                    />
            <BookUpdate updateBook={updateBook} setVisible={setVisible} visible={visible} book={book} />
                    
            </div>

            <div className="flex align-items-center justify-content-center mt-3">
            </div> <Link to={`/book/${book._id}`} className="text-center p-2">
                <Button icon="pi pi-search" className="p-button-rounded" label="לפרטים" />
            </Link>
        </div>
        </div >
    );

    const itemTemplate = (book, layout, index) => {
        if (!book) return;
        return layout === 'list' ? listItem(book, index) : gridItem(book);
    };

    const listTemplate = (books, layout) => (
        <div className="grid grid-nogutter">{books.map((book, index) => itemTemplate(book, layout, index)) } </div>
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

